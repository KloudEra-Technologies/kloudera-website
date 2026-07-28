import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LOG_FILE_PATH = path.join(process.cwd(), "src", "data", "admin_audit_log.json");
const CONTENT_FILE_PATH = path.join(process.cwd(), "src", "data", "website_content.json");

export function getAuditLogs() {
  try {
    if (!fs.existsSync(LOG_FILE_PATH)) {
      fs.writeFileSync(LOG_FILE_PATH, JSON.stringify([], null, 2), "utf8");
      return [];
    }
    const raw = fs.readFileSync(LOG_FILE_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export async function sendEmailTransport(recipientEmail: string, subject: string, htmlContent: string, emailConfig: any = {}) {
  const apiKey = emailConfig?.apiKey || process.env.RESEND_API_KEY || "";
  const host = emailConfig?.smtpHost || "smtp.office365.com";
  const port = Number(emailConfig?.smtpPort || 587);
  const user = emailConfig?.smtpUser || recipientEmail;
  const pass = emailConfig?.smtpPass || "";

  // 1. If Resend / SendGrid API Key is provided, use HTTP API (100% Inbox Delivery guaranteed)
  if (apiKey && apiKey.startsWith("re_")) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "KloudEra Security <onboarding@resend.dev>",
          to: [recipientEmail],
          subject: subject,
          html: htmlContent
        })
      });

      const resData = await res.json();
      if (res.ok) {
        return {
          success: true,
          status: "SENT_VIA_RESEND_API",
          messageId: resData.id,
          message: `Successfully delivered email via Resend API to ${recipientEmail}!`
        };
      } else {
        return {
          success: false,
          status: "RESEND_API_ERROR",
          message: `Resend API Error: ${resData.message || JSON.stringify(resData)}`
        };
      }
    } catch (apiErr: any) {
      console.error("Resend API error:", apiErr);
    }
  }

  // 2. Outlook / Office 365 Authenticated SMTP
  if (pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false
        }
      });

      const info = await transporter.sendMail({
        from: `KloudEra Security <${user}>`,
        to: recipientEmail,
        subject,
        html: htmlContent
      });

      return {
        success: true,
        status: "SENT_VIA_OUTLOOK_SMTP",
        messageId: info.messageId,
        message: `Successfully delivered security notification to Outlook (${recipientEmail})!`
      };
    } catch (err: any) {
      console.error("Outlook SMTP error:", err);
      let errMsg = err.message || "Authentication failed";
      
      if (errMsg.includes("535") || errMsg.includes("Authentication unsuccessful")) {
        errMsg = "Microsoft Outlook rejected your standard password. Microsoft requires an 'App Password' from https://account.microsoft.com/security or enabling 'Authenticated SMTP' in Microsoft 365 Admin Center.";
      }

      return {
        success: false,
        status: "OUTLOOK_AUTH_ERROR",
        message: errMsg
      };
    }
  }

  return {
    success: false,
    status: "PASSWORD_OR_API_KEY_REQUIRED",
    message: "Outlook password or Resend API key required. Please enter an Outlook App Password or Resend API Key."
  };
}

export async function recordAuditNotification(event: string, summary: string, recipientEmail: string, details: any = {}) {
  try {
    let emailConfig: any = {};
    if (fs.existsSync(CONTENT_FILE_PATH)) {
      const contentRaw = fs.readFileSync(CONTENT_FILE_PATH, "utf8");
      const contentJson = JSON.parse(contentRaw);
      emailConfig = contentJson.credentials?.emailConfig || {};
    }

    const formattedTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) + " IST";
    const subject = `[Kloudera Security Notification] ${event === "SECURITY_CREDENTIALS_UPDATE" ? "🔐 Security Settings Updated" : "🚀 Website Content Published"}`;
    
    const htmlBody = `
      <div style="background-color: #030712; color: #f4f4f5; font-family: monospace, sans-serif; padding: 30px; border-radius: 12px; border: 1px solid #14b8a6; max-width: 550px; margin: 0 auto;">
        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #22d3ee; margin: 0; font-size: 18px; text-transform: uppercase;">KLOUDERA TECHNOLOGIES // SECURITY ALERT</h2>
          <span style="color: #64748b; font-size: 11px;">SYSTEM NOTIFICATION DISPATCH</span>
        </div>
        
        <div style="background-color: #090d16; padding: 20px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0; font-size: 13px; color: #cbd5e1;">
            <strong style="color: #f59e0b;">EVENT TYPE:</strong> ${event}
          </p>
          <p style="margin: 0 0 10px 0; font-size: 13px; color: #cbd5e1;">
            <strong style="color: #f59e0b;">TIMESTAMP:</strong> ${formattedTime}
          </p>
          <p style="margin: 0 0 10px 0; font-size: 13px; color: #cbd5e1;">
            <strong style="color: #f59e0b;">RECIPIENT EMAIL:</strong> ${recipientEmail}
          </p>
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 15px 0;" />
          <p style="margin: 0; font-size: 13px; color: #e2e8f0; line-height: 1.5;">${summary}</p>
        </div>

        <div style="text-align: center; padding-top: 10px;">
          <a href="http://localhost:3000/developer" style="background-color: #06b6d4; color: #000000; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 12px; display: inline-block;">
            OPEN DEVELOPER CONTROL PANEL
          </a>
        </div>
      </div>
    `;

    const shouldSendEmail = event === "SECURITY_CREDENTIALS_UPDATE";
    const emailResult = shouldSendEmail 
      ? await sendEmailTransport(recipientEmail, subject, htmlBody, emailConfig)
      : { success: true, status: "SKIPPED_EMAIL_NOTIFICATION", message: "Email notifications disabled for general content updates." };

    const logs = getAuditLogs();
    const newEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      formattedTime,
      event,
      recipientEmail: recipientEmail || "admin@kloudera.ai",
      summary,
      details,
      status: emailResult.status,
      smtpMessage: emailResult.message
    };

    logs.unshift(newEntry);
    const trimmed = logs.slice(0, 50);
    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(trimmed, null, 2), "utf8");

    return newEntry;
  } catch (err) {
    console.error("Failed to record admin audit log", err);
    return null;
  }
}

export async function GET() {
  const logs = getAuditLogs();
  return NextResponse.json({ logs });
}
