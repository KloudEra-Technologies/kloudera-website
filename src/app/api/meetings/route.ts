import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { recordAuditNotification, sendEmailTransport } from "@/app/api/admin-audit/route";
import fs from "fs";
import path from "path";

// Helper to check if date is a weekend or blackout holiday
function isBlackoutDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  const day = date.getDay();
  if (day === 0 || day === 6) return true; // Weekend

  // Simple blackout list (e.g. New Year, Christmas)
  const blackouts = ["2026-01-01", "2026-12-25", "2026-07-04"];
  return blackouts.includes(dateStr);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date"); // Format: YYYY-MM-DD

    if (!dateStr) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    if (isBlackoutDate(dateStr)) {
      return NextResponse.json({ occupiedSlots: [] }); // No slots available anyway
    }

    const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

    // Fetch all bookings for this day that are not cancelled or declined
    const bookings = await prisma.meetingBooking.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          notIn: ["CANCELLED", "DECLINED"]
        }
      },
      select: {
        date: true,
        duration: true
      }
    });

    // Map into simpler format
    const occupied = bookings.map(b => ({
      start: b.date.toISOString(),
      end: new Date(b.date.getTime() + b.duration * 60 * 1000).toISOString()
    }));

    return NextResponse.json({ occupiedSlots: occupied });
  } catch (err: any) {
    console.error("Meetings GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorName, company, email, phone, dateStr, duration, timezone, purpose, platform, specialRequests } = body;

    if (!visitorName || !email || !dateStr || !duration || !timezone) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const requestedStart = new Date(dateStr);
    const requestedEnd = new Date(requestedStart.getTime() + duration * 60 * 1000);

    // 1. Double-booking check
    // Buffer time (e.g. 15 minutes)
    const bufferMins = 15;
    const checkStart = new Date(requestedStart.getTime() - bufferMins * 60 * 1000);
    const checkEnd = new Date(requestedEnd.getTime() + bufferMins * 60 * 1000);

    const existingOverlaps = await prisma.meetingBooking.findFirst({
      where: {
        status: { notIn: ["CANCELLED", "DECLINED"] },
        date: {
          lt: checkEnd,
        },
      }
    });

    // We fetch bookings for this day and verify overlap
    const dayStart = new Date(requestedStart);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(requestedStart);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const dayBookings = await prisma.meetingBooking.findMany({
      where: {
        date: { gte: dayStart, lte: dayEnd },
        status: { notIn: ["CANCELLED", "DECLINED"] }
      }
    });

    const isOverlapped = dayBookings.some((b) => {
      const bStart = b.date.getTime();
      const bEnd = bStart + (b.duration + bufferMins) * 60 * 1000;
      const rStart = requestedStart.getTime();
      const rEnd = requestedEnd.getTime();
      return rStart < bEnd && rEnd > bStart - (bufferMins * 60 * 1000);
    });

    if (isOverlapped) {
      return NextResponse.json(
        { error: "Time slot is already booked or overlaps with a buffer zone." },
        { status: 409 }
      );
    }

    // 2. Generate simulated video call links
    let meetingLink = "";
    if (platform === "Teams") {
      meetingLink = `https://teams.microsoft.com/l/meetup-join/kloudera-${Math.random().toString(36).substr(2, 9)}`;
    } else {
      meetingLink = `https://meet.google.com/kld-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`;
    }

    // 3. Create Booking
    const booking = await prisma.meetingBooking.create({
      data: {
        visitorName,
        company: company || null,
        email,
        phone: phone || null,
        date: requestedStart,
        duration: parseInt(duration),
        timezone,
        purpose,
        platform,
        meetingLink,
        specialRequests: specialRequests || null,
        status: "APPROVED" // Auto-approving for high-fidelity UX, can be managed in Admin panel
      }
    });

    // Seed audit log
    await prisma.auditLog.create({
      data: {
        action: "BOOK_MEETING",
        details: `Meeting booked: ${visitorName} (${email}) on ${requestedStart.toISOString()}`,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1"
      }
    });

    // Send email notification to administrator
    let adminEmail = "admin@kloudera.ai";
    let emailConfig: any = {};
    try {
      const contentRaw = fs.readFileSync(path.join(process.cwd(), "src", "data", "website_content.json"), "utf8");
      const contentJson = JSON.parse(contentRaw);
      adminEmail = contentJson.credentials?.adminEmail || "admin@kloudera.ai";
      emailConfig = contentJson.credentials?.emailConfig || {};

      await recordAuditNotification(
        "MEETING_BOOKED",
        `New consultation scheduled: ${visitorName} (${email}) on ${requestedStart.toISOString()} via ${platform}`,
        adminEmail,
        { visitorName, email, company, date: requestedStart.toISOString(), duration, platform }
      );
    } catch (auditErr) {
      console.error("Failed to send admin booking email:", auditErr);
    }

    // Send email invitation to visitor & guests
    try {
      const formattedTime = requestedStart.toLocaleString("en-US", { timeZone: timezone }) + " (" + timezone + ")";
      
      const visitorHtml = `
        <div style="background-color: #030712; color: #f4f4f5; font-family: monospace, sans-serif; padding: 30px; border-radius: 12px; border: 1px solid #14b8a6; max-width: 550px; margin: 0 auto;">
          <div style="border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-bottom: 20px; text-align: center;">
            <h2 style="color: #22d3ee; margin: 0; font-size: 18px; text-transform: uppercase;">CONSULTATION SCHEDULED</h2>
            <span style="color: #64748b; font-size: 11px;">KLOUDERA ADVISORY NETWORK</span>
          </div>
          
          <div style="background-color: #090d16; padding: 20px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 20px; line-height: 1.6;">
            <p style="margin: 0 0 10px 0; font-size: 13.5px;">Hello <strong>${visitorName}</strong>,</p>
            <p style="margin: 0 0 15px 0; font-size: 13px; color: #94a3b8;">Your business consultation slot has been reserved. Find the meeting connection coordinates below:</p>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #cbd5e1; margin-bottom: 15px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 120px;"><strong>DATE & TIME:</strong></td>
                <td style="padding: 6px 0; color: #22d3ee;"><strong>${formattedTime}</strong></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>DURATION:</strong></td>
                <td style="padding: 6px 0; color: #ffffff;">${duration} Minutes</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>PLATFORM:</strong></td>
                <td style="padding: 6px 0; color: #ffffff;">${platform} (Video conference)</td>
              </tr>
            </table>

            <div style="border-top: 1px solid #1e293b; padding-top: 15px; margin-top: 10px;">
              <span style="color: #64748b; font-size: 10px; display: block; margin-bottom: 8px;">JOIN MEETING LINK:</span>
              <a href="${meetingLink}" target="_blank" style="color: #14b8a6; text-decoration: underline; word-break: break-all; font-size: 11px; font-weight: bold;">
                ${meetingLink}
              </a>
            </div>
          </div>

          <div style="text-align: center; font-size: 10px; color: #475569; border-top: 1px solid #1e293b; padding-top: 15px;">
            Thank you for connecting with KloudEra.
          </div>
        </div>
      `;

      // 1. Send email to primary visitor
      await sendEmailTransport(email, `Confirmed: Consultation with KloudEra`, visitorHtml, emailConfig);

      // 2. Send email to guests if any were added
      if (specialRequests && specialRequests.includes("Guests: ")) {
        const match = specialRequests.match(/Guests:\s*([^;]+)/);
        if (match && match[1]) {
          const guestList = match[1].split(",").map((g: string) => g.trim()).filter((g: string) => g.includes("@"));
          for (const guest of guestList) {
            await sendEmailTransport(guest, `Invitation: Consultation with KloudEra (via ${visitorName})`, visitorHtml, emailConfig);
          }
        }
      }
    } catch (inviteErr) {
      console.error("Failed to send visitor invitations:", inviteErr);
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      meetingLink,
      cancelToken: booking.cancelToken
    }, { status: 201 });

  } catch (err: any) {
    console.error("Meetings POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
