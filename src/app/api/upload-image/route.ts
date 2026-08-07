import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Verify developer access token (checking both FormData and headers for security and bypass proxies)
    const devToken = (formData.get("token") as string | null) || req.headers.get("x-developer-token") || req.cookies.get("developer_token")?.value;

    // Load credentials from database or JSON file
    let currentContent: any = null;
    const FILE_PATH = path.join(process.cwd(), "src", "data", "website_content.json");
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key: "website_content" }
      });
      if (config) {
        currentContent = JSON.parse(config.value);
      }
    } catch (dbErr) {
      console.warn("DB read error in upload-image check", dbErr);
    }
    
    if (!currentContent && fs.existsSync(FILE_PATH)) {
      currentContent = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
    }

    const currentCredentials = currentContent?.credentials || { 
      contentPassword: "content123", 
      ultimatePassword: "PasswordAdmin" 
    };

    const isUltimate = Boolean(devToken && devToken === currentCredentials.ultimatePassword);
    const isContent = Boolean(devToken && devToken === currentCredentials.contentPassword);

    if (!isUltimate && !isContent) {
      return NextResponse.json({ error: "Unauthorized access token." }, { status: 401 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const partnerName = formData.get("partnerName") as string | null;
    if (partnerName) {
      const cleanName = partnerName.trim().replace(/\s+/g, "");
      const cleanNameLower = cleanName.toLowerCase();
      
      // Determine file extension
      let ext = "png";
      const mimeType = file.type || "image/png";
      if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = "jpg";
      else if (mimeType.includes("svg")) ext = "svg";
      else if (mimeType.includes("webp")) ext = "webp";
      else if (mimeType.includes("avif")) ext = "avif";
      else if (mimeType.includes("gif")) ext = "gif";

      const filename = `${cleanName}.${ext}`;
      
      // Target paths
      const publicDir = path.join(process.cwd(), "public", "partners");
      const rootDir = path.join(process.cwd(), "partners");

      // Ensure target folders exist
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      if (!fs.existsSync(rootDir)) {
        fs.mkdirSync(rootDir, { recursive: true });
      }

      // Write file to both folders
      fs.writeFileSync(path.join(publicDir, filename), buffer);
      fs.writeFileSync(path.join(rootDir, filename), buffer);

      // Return the public static route url
      return NextResponse.json({ success: true, url: `/partners/${filename}` });
    }

    const base64Data = buffer.toString("base64");
    const mimeType = file.type || "image/png";
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    return NextResponse.json({ success: true, url: dataUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
