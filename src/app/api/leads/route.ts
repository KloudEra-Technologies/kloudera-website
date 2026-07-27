import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, email, phone, company, subject, message, payload } = body;

    if (!type || !name || !email) {
      return NextResponse.json(
        { error: "Required fields missing: type, name, email are required." },
        { status: 400 }
      );
    }

    // Save lead to database
    const lead = await prisma.leadSubmission.create({
      data: {
        type,
        name,
        email,
        phone: phone || null,
        company: company || null,
        subject: subject || null,
        message: message || null,
        payload: payload || null,
      },
    });

    // Seed audit log
    await prisma.auditLog.create({
      data: {
        action: "SUBMIT_LEAD",
        details: `New lead created: ${type} from ${email}`,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (err: any) {
    console.error("API Leads Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
