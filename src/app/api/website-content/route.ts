import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { recordAuditNotification } from "@/app/api/admin-audit/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FILE_PATH = path.join(process.cwd(), "src", "data", "website_content.json");



export async function GET() {
  try {
    // 1. Try to load from database first
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key: "website_content" }
      });
      if (config) {
        const parsed = JSON.parse(config.value);
        return NextResponse.json(parsed, {
          headers: {
            "Cache-Control": "no-store, max-age=0, must-revalidate",
            "Pragma": "no-cache"
          }
        });
      }
    } catch (dbErr: any) {
      console.error("DATABASE READ FAILURE in GET /api/website-content:", dbErr);
    }

    // 2. Fallback to reading the local JSON file from disk
    if (!fs.existsSync(FILE_PATH)) {
      return NextResponse.json({ error: "Content file not found" }, { status: 404 });
    }
    const rawData = fs.readFileSync(FILE_PATH, "utf8");
    const data = JSON.parse(rawData);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
        "Pragma": "no-cache"
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Retrieve current credentials using our fallback priority system
    let currentContent: any = null;
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key: "website_content" }
      });
      if (config) {
        currentContent = JSON.parse(config.value);
      }
    } catch (dbErr) {
      console.warn("DB read error in credentials check", dbErr);
    }
    
    if (!currentContent && fs.existsSync(FILE_PATH)) {
      currentContent = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
    }

    const currentCredentials = currentContent?.credentials || { 
      contentPassword: "content123", 
      ultimatePassword: "PasswordAdmin", 
      adminEmail: "info@kloudera.ai" 
    };
    
    // Check developer password gate
    const devToken = req.headers.get("x-developer-token") || req.cookies.get("developer_token")?.value;

    const isUltimate = Boolean(devToken && devToken === currentCredentials.ultimatePassword);
    const isContent = Boolean(devToken && devToken === currentCredentials.contentPassword);

    if (!isUltimate && !isContent) {
      return NextResponse.json({ error: "Unauthorized. Access token mismatch." }, { status: 401 });
    }

    // Detect if credentials were changed
    const credentialsChanged = body.credentials && (
      body.credentials.contentPassword !== currentCredentials.contentPassword ||
      body.credentials.ultimatePassword !== currentCredentials.ultimatePassword ||
      body.credentials.adminEmail !== currentCredentials.adminEmail
    );

    // If payload attempts to modify credentials, restrict to Ultimate Access only
    if (credentialsChanged && !isUltimate) {
      return NextResponse.json({ error: "Forbidden. Only Ultimate Access master can modify access credentials." }, { status: 403 });
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid data payload" }, { status: 400 });
    }

    const targetEmail = body.credentials?.adminEmail || currentCredentials.adminEmail || "info@kloudera.ai";

    if (credentialsChanged) {
      recordAuditNotification(
        "SECURITY_CREDENTIALS_UPDATE",
        "System security access passwords or admin notification email were modified.",
        targetEmail,
        {
          modifiedBy: isUltimate ? "Ultimate Master Admin" : "Content Editor",
          newContentPassword: body.credentials.contentPassword ? "Updated (Masked)" : "Unchanged",
          newUltimatePassword: body.credentials.ultimatePassword ? "Updated (Masked)" : "Unchanged",
          adminEmail: targetEmail
        }
      );
    } else {
      recordAuditNotification(
        "WEBSITE_CONTENT_PUBLISHED",
        "Website content packets were updated and published live.",
        targetEmail,
        {
          publishedBy: isUltimate ? "Ultimate Master Admin" : "Content Editor"
        }
      );
    }

    // Save updates

    // 1. Save to Database (Prisma SystemConfig table)
    try {
      await prisma.systemConfig.upsert({
        where: { key: "website_content" },
        update: { value: JSON.stringify(body) },
        create: { key: "website_content", value: JSON.stringify(body) }
      });
    } catch (dbErr: any) {
      console.error("CRITICAL DATABASE WRITE FAILURE in POST /api/website-content:", dbErr);
      return NextResponse.json({ 
        error: "Database publish failed: " + dbErr.message + ". Please check your Vercel DATABASE_URL connection variable." 
      }, { status: 500 });
    }

    // 2. Save to Disk (Prisma SQLite or local filesystem - will fail gracefully on serverless hosts like Vercel)
    try {
      fs.writeFileSync(FILE_PATH, JSON.stringify(body, null, 2), "utf8");
    } catch (diskErr: any) {
      console.warn("Disk write failed (expected on read-only cloud hosts like Vercel):", diskErr.message);
    }
    
    return NextResponse.json({ success: true, accessLevel: isUltimate ? "ultimate" : "content" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
