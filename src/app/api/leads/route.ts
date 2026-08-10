import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmailTransport } from "@/app/api/admin-audit/route";
import fs from "fs";
import path from "path";

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

    // Fetch email configurations from JSON
    let adminEmail = "info@kloudera.ai";
    let emailConfig: any = {};
    try {
      const contentRaw = fs.readFileSync(path.join(process.cwd(), "src", "data", "website_content.json"), "utf8");
      const contentJson = JSON.parse(contentRaw);
      adminEmail = contentJson.credentials?.adminEmail || "info@kloudera.ai";
      emailConfig = contentJson.credentials?.emailConfig || {};
    } catch (err) {
      console.warn("Failed to load email config for lead notification:", err);
    }

    // Trigger email notification to the administrator
    const subjectLine = `[Kloudera Inquiry] ${subject || "New Lead Submission"} (${type})`;
    const htmlBody = `
      <div style="background-color: #030712; color: #f4f4f5; font-family: monospace, sans-serif; padding: 30px; border-radius: 12px; border: 1px solid #06b6d4; max-width: 550px; margin: 0 auto;">
        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #22d3ee; margin: 0; font-size: 18px; text-transform: uppercase;">KLOUDERA TECHNOLOGIES // NEW LEAD DISPATCH</h2>
          <span style="color: #64748b; font-size: 11px;">VISITOR CONTACT SUBMISSION</span>
        </div>
        
        <div style="background-color: #090d16; padding: 20px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
          <p style="margin: 0 0 8px 0; color: #cbd5e1;"><strong style="color: #f59e0b;">Name:</strong> ${name}</p>
          <p style="margin: 0 0 8px 0; color: #cbd5e1;"><strong style="color: #f59e0b;">Email:</strong> ${email}</p>
          <p style="margin: 0 0 8px 0; color: #cbd5e1;"><strong style="color: #f59e0b;">Phone:</strong> ${phone || "N/A"}</p>
          <p style="margin: 0 0 8px 0; color: #cbd5e1;"><strong style="color: #f59e0b;">Company:</strong> ${company || "N/A"}</p>
          <p style="margin: 0 0 8px 0; color: #cbd5e1;"><strong style="color: #f59e0b;">Type:</strong> ${type}</p>
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 15px 0;" />
          <p style="margin: 0; color: #e2e8f0; white-space: pre-wrap;">${message || "No message content."}</p>
        </div>
      </div>
    `;

    let emailResult: any = null;
    try {
      emailResult = await sendEmailTransport(adminEmail, subjectLine, htmlBody, emailConfig);
      console.log("Lead email notification result:", emailResult);
    } catch (mailErr: any) {
      console.error("Failed to send email alert for lead:", mailErr);
      emailResult = { success: false, status: "ERROR", message: mailErr.message };
    }

    return NextResponse.json({ success: true, leadId: lead.id, emailResult }, { status: 201 });
  } catch (err: any) {
    console.error("API Leads Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
