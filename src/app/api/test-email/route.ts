import { NextRequest, NextResponse } from "next/server";
import { sendEmailTransport } from "@/app/api/admin-audit/route";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipientEmail, emailConfig } = body;

    if (!recipientEmail) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
    }

    const subject = "🧪 [KloudEra Security] Test Email Notification";
    const htmlBody = `
      <div style="background-color: #030712; color: #f4f4f5; font-family: monospace, sans-serif; padding: 30px; border-radius: 12px; border: 1px solid #14b8a6; max-width: 550px; margin: 0 auto;">
        <h2 style="color: #22d3ee; margin: 0 0 10px 0;">KLOUDERA TECHNOLOGIES // TEST EMAIL</h2>
        <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
          This is a test notification sent from your Kloudera Developer Security Console.
        </p>
        <div style="background-color: #090d16; padding: 15px; border-radius: 8px; border: 1px solid #1e293b; margin: 15px 0;">
          <p style="margin: 0; color: #34d399; font-size: 12px; font-weight: bold;">
            ✓ SMTP Email Dispatch Connected Successfully to ${recipientEmail}!
          </p>
        </div>
      </div>
    `;

    const result = await sendEmailTransport(recipientEmail, subject, htmlBody, emailConfig);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "ERROR", message: err.message }, { status: 500 });
  }
}
