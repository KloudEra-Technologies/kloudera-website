import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("logo") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const publicDir = path.join(process.cwd(), "public");
    const logoPath = path.join(publicDir, "logo.png");

    // Ensure public folder exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write file to public/logo.png
    fs.writeFileSync(logoPath, buffer);

    return NextResponse.json({ success: true, message: "Logo updated successfully!" });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload logo" }, { status: 500 });
  }
}
