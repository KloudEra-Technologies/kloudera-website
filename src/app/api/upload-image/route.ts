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

    // Verify developer access token
    const devToken = req.headers.get("x-developer-token") || req.cookies.get("developer_token")?.value;

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

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const fileExt = path.extname(file.name) || ".png";
    const sanitizedBase = path.basename(file.name, fileExt).replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${Date.now()}_${sanitizedBase}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save image file to disk (will fail gracefully on serverless but succeed in persistent environments)
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      fs.writeFileSync(filePath, buffer);
    } catch (diskErr: any) {
      console.warn("Disk image write failed (expected on serverless environments):", diskErr.message);
      
      // Fallback base64 representation if disk is unwritable (so uploader still succeeds on Vercel preview!)
      const base64Data = buffer.toString("base64");
      const mimeType = file.type || "image/png";
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      return NextResponse.json({ success: true, url: dataUrl, fileName });
    }

    const publicUrl = `/uploads/${fileName}`;
    return NextResponse.json({ success: true, url: publicUrl, fileName });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
