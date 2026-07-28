import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";
import { recordAuditNotification } from "@/app/api/admin-audit/route";

const FILE_PATH = path.join(process.cwd(), "src", "data", "website_content.json");

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse("Invalid Token", { status: 400 });
    }

    // 1. Get Pending Request
    const config = await prisma.systemConfig.findUnique({ where: { key: "pending_password_change" } });
    if (!config) {
      return new NextResponse("No pending password change request found.", { status: 404 });
    }

    const pendingData = JSON.parse(config.value);

    // 2. Validate Token & Expiry
    if (pendingData.token !== token) {
      return new NextResponse("Invalid Token.", { status: 403 });
    }
    if (Date.now() > pendingData.expiry) {
      await prisma.systemConfig.delete({ where: { key: "pending_password_change" } });
      return new NextResponse("Token expired. Please request a new password change.", { status: 403 });
    }

    // 3. Load Current Content
    let currentContent: any = null;
    try {
      const contentConfig = await prisma.systemConfig.findUnique({ where: { key: "website_content" } });
      if (contentConfig) currentContent = JSON.parse(contentConfig.value);
    } catch (e) {}

    if (!currentContent && fs.existsSync(FILE_PATH)) {
      currentContent = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
    }

    if (!currentContent) {
      return new NextResponse("System content uninitialized.", { status: 500 });
    }

    if (!currentContent.credentials) {
      currentContent.credentials = {
        contentPassword: "content123",
        ultimatePassword: "PasswordAdmin",
        adminEmail: "info@kloudera.ai"
      };
    }

    // 4. Apply Updates
    if (pendingData.newContentPassword) {
      currentContent.credentials.contentPassword = pendingData.newContentPassword;
    }
    if (pendingData.newUltimatePassword) {
      currentContent.credentials.ultimatePassword = pendingData.newUltimatePassword;
    }

    // Save to DB and Disk
    await prisma.systemConfig.upsert({
      where: { key: "website_content" },
      update: { value: JSON.stringify(currentContent) },
      create: { key: "website_content", value: JSON.stringify(currentContent) }
    });

    try {
      fs.writeFileSync(FILE_PATH, JSON.stringify(currentContent, null, 2), "utf8");
    } catch (e) {}

    // Clean up pending request
    await prisma.systemConfig.delete({ where: { key: "pending_password_change" } });

    // 5. Send Audit Notification
    recordAuditNotification(
      "SECURITY_CREDENTIALS_UPDATE_CONFIRMED",
      "System security access passwords were successfully changed via email confirmation.",
      currentContent.credentials.adminEmail,
      {
        newContentPassword: pendingData.newContentPassword ? "Updated" : "Unchanged",
        newUltimatePassword: pendingData.newUltimatePassword ? "Updated" : "Unchanged"
      }
    );

    // Return friendly HTML success page
    return new NextResponse(`
      <html>
        <body style="font-family: sans-serif; background: #030712; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="background: #0f172a; padding: 40px; border-radius: 16px; text-align: center; border: 1px solid #14b8a6; box-shadow: 0 0 40px rgba(20, 184, 166, 0.2);">
            <h1 style="color: #14b8a6;">✅ Success!</h1>
            <p style="margin-top: 10px;">The password has been successfully updated.</p>
            <p style="color: #94a3b8; font-size: 14px;">You can close this window and return to the editor.</p>
          </div>
        </body>
      </html>
    `, { headers: { "Content-Type": "text/html" } });

  } catch (err: any) {
    console.error("Confirm password error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
