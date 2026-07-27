import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Verify developer access token
    const devToken = req.headers.get("x-developer-token") || req.cookies.get("developer_token")?.value;
    const expectedToken = process.env.DEVELOPER_PASSWORD || "admin123";

    if (devToken !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized access token." }, { status: 401 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and prepare public uploads folder
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileExt = path.extname(file.name) || ".png";
    const sanitizedBase = path.basename(file.name, fileExt).replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${Date.now()}_${sanitizedBase}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save image file to disk
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;
    return NextResponse.json({ success: true, url: publicUrl, fileName });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
