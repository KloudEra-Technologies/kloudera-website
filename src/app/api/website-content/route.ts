import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FILE_PATH = path.join(process.cwd(), "src", "data", "website_content.json");

export async function GET() {
  try {
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

import { recordAuditNotification } from "@/app/api/admin-audit/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!fs.existsSync(FILE_PATH)) {
      return NextResponse.json({ error: "Content file not found" }, { status: 404 });
    }

    const currentContent = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
    const currentCredentials = currentContent.credentials || { contentPassword: "content123", ultimatePassword: "admin", adminEmail: "admin@kloudera.ai" };
    
    // Check developer password gate
    const devToken = req.headers.get("x-developer-token") || req.cookies.get("developer_token")?.value;

    const isUltimate = Boolean(devToken && devToken === currentCredentials.ultimatePassword);
    const isContent = Boolean(devToken && devToken === currentCredentials.contentPassword);

    if (!isUltimate && !isContent) {
      return NextResponse.json({ error: "Unauthorized. Access token mismatch." }, { status: 401 });
    }

    // If payload attempts to modify credentials, restrict to Ultimate Access only
    if (body.credentials && !isUltimate) {
      return NextResponse.json({ error: "Forbidden. Only Ultimate Access master can modify access credentials." }, { status: 403 });
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid data payload" }, { status: 400 });
    }

    const targetEmail = body.credentials?.adminEmail || currentCredentials.adminEmail || "admin@kloudera.ai";

    // Detect if credentials were changed
    const credentialsChanged = body.credentials && (
      body.credentials.contentPassword !== currentCredentials.contentPassword ||
      body.credentials.ultimatePassword !== currentCredentials.ultimatePassword ||
      body.credentials.adminEmail !== currentCredentials.adminEmail
    );

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

    // Write back to website_content.json
    fs.writeFileSync(FILE_PATH, JSON.stringify(body, null, 2), "utf8");
    
    return NextResponse.json({ success: true, accessLevel: isUltimate ? "ultimate" : "content" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
