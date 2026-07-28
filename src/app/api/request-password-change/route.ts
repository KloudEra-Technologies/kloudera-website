import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";

const FILE_PATH = path.join(process.cwd(), "src", "data", "website_content.json");

export async function POST(req: NextRequest) {
  try {
    const { masterPassword, newContentPassword, newUltimatePassword } = await req.json();

    if (!masterPassword) {
      return NextResponse.json({ error: "Master Password required" }, { status: 400 });
    }

    // 1. Get current credentials
    let currentContent: any = null;
    try {
      const config = await prisma.systemConfig.findUnique({ where: { key: "website_content" } });
      if (config) currentContent = JSON.parse(config.value);
    } catch (e) {}

    if (!currentContent && fs.existsSync(FILE_PATH)) {
      currentContent = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
    }

    const currentCredentials = currentContent?.credentials || {
      ultimatePassword: "PasswordAdmin",
      adminEmail: "info@kloudera.ai"
    };

    // 2. Authorize
    if (masterPassword !== currentCredentials.ultimatePassword) {
      return NextResponse.json({ error: "Unauthorized. Incorrect Master Password." }, { status: 401 });
    }

    // 3. Generate Secure Token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 1000 * 60 * 60; // 1 hour

    // 4. Save Pending Request to DB
    const pendingData = {
      token,
      expiry,
      newContentPassword,
      newUltimatePassword
    };

    await prisma.systemConfig.upsert({
      where: { key: "pending_password_change" },
      update: { value: JSON.stringify(pendingData) },
      create: { key: "pending_password_change", value: JSON.stringify(pendingData) }
    });

    // 5. Send Email via nodemailer
    // Note: We use process.env.SMTP_HOST etc. if available, otherwise we log the link.
    // Assuming standard environment variables for mail transport
    const hostUrl = process.env.NEXT_PUBLIC_APP_URL || (req.headers.get("origin") || "http://localhost:3000");
    const confirmLink = `${hostUrl}/api/confirm-password?token=${token}`;

    const smtpConfig = currentCredentials.emailConfig;
    const smtpHost = process.env.SMTP_HOST || smtpConfig?.smtpHost;
    const smtpUser = process.env.SMTP_USER || smtpConfig?.smtpUser;
    const smtpPass = process.env.SMTP_PASS || smtpConfig?.smtpPass;
    const smtpPort = process.env.SMTP_PORT || smtpConfig?.smtpPort;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort) || 587,
        secure: process.env.SMTP_SECURE === "true" || Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Security System" <${smtpUser}>`,
        to: currentCredentials.adminEmail,
        subject: "Action Required: KloudEra Security Password Change Request",
        html: `
          <div style="font-family: sans-serif; max-w-md; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a;">Password Change Request</h2>
            <p>A request was made to change the editor access passwords for your website.</p>
            <p>If you authorized this change, click the secure link below to confirm and apply the new passwords:</p>
            <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #14b8a6; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">Confirm Password Change</a>
            <p style="font-size: 12px; color: #64748b; margin-top: 20px;">This link expires in 1 hour. If you did not request this, ignore this email.</p>
          </div>
        `
      });
    } else {
      // For local development or if SMTP is not configured, we log it to console so it can still be tested
      console.log("\n\n========================================================");
      console.log("MOCK EMAIL SENT TO:", currentCredentials.adminEmail);
      console.log("PLEASE CLICK THIS LINK TO CONFIRM PASSWORD CHANGE:");
      console.log(confirmLink);
      console.log("========================================================\n\n");
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Password request error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
