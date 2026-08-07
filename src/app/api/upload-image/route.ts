import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { commitToGithub } from "@/lib/githubCommitter";

export async function POST(req: NextRequest) {
  try {
    console.log("=== upload-image: POST request received ===");
    const formData = await req.formData().catch(err => {
      console.error("Failed to parse form data:", err);
      throw new Error("Invalid form data payload: " + err.message);
    });

    const file = formData.get("file") as File | null;
    console.log("File received:", file ? { name: file.name, type: file.type, size: file.size } : "NULL");

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Verify developer access token
    const devToken = (formData.get("token") as string | null) || req.headers.get("x-developer-token") || req.cookies.get("developer_token")?.value;
    console.log("Access token provided:", devToken ? "YES (masked)" : "NO");

    // Load credentials
    let currentContent: any = null;
    const FILE_PATH = path.join(process.cwd(), "src", "data", "website_content.json");
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key: "website_content" }
      });
      if (config) {
        currentContent = JSON.parse(config.value);
      }
    } catch (dbErr: any) {
      console.warn("DB read error in upload-image check:", dbErr.message);
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
    console.log("Auth checks - isUltimate:", isUltimate, "isContent:", isContent);

    if (!isUltimate && !isContent) {
      return NextResponse.json({ error: "Unauthorized access token." }, { status: 401 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const partnerName = formData.get("partnerName") as string | null;
    console.log("Partner name parameter:", partnerName);
    
    if (partnerName) {
      const cleanName = partnerName.trim().replace(/\s+/g, "");
      
      // Determine file extension
      let ext = "png";
      const mimeType = file.type || "image/png";
      if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = "jpg";
      else if (mimeType.includes("svg")) ext = "svg";
      else if (mimeType.includes("webp")) ext = "webp";
      else if (mimeType.includes("avif")) ext = "avif";
      else if (mimeType.includes("gif")) ext = "gif";

      const filename = `${cleanName}.${ext}`;
      console.log("Prepared filename:", filename);
      
      // Target paths
      const publicDir = path.join(process.cwd(), "public", "partners");
      const rootDir = path.join(process.cwd(), "partners");

      // Ensure target folders exist (skipped on Vercel to prevent EROFS)
      const isVercel = Boolean(process.env.VERCEL);
      console.log("Is Vercel environment:", isVercel);
      
      if (!isVercel) {
        try {
          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
          }
          if (!fs.existsSync(rootDir)) {
            fs.mkdirSync(rootDir, { recursive: true });
          }
          // Write file to both folders
          fs.writeFileSync(path.join(publicDir, filename), buffer);
          fs.writeFileSync(path.join(rootDir, filename), buffer);
          console.log("Successfully wrote file to local filesystem");
        } catch (fsErr: any) {
          console.warn("Local filesystem write failed:", fsErr.message);
        }
      }

      // Commit and push to GitHub
      const githubTokenSet = Boolean(process.env.GITHUB_PAT);
      console.log("GITHUB_PAT configured:", githubTokenSet);
      
      if (githubTokenSet) {
        try {
          console.log(`Starting GitHub commit for: public/partners/${filename}`);
          const githubResult = await commitToGithub(
            `public/partners/${filename}`,
            buffer,
            `cms: upload logo image for partner ${partnerName}`
          );
          console.log("GitHub commit response success:", githubResult.success);
          if (!githubResult.success) {
            return NextResponse.json({ error: "GitHub commit failed: " + githubResult.error }, { status: 500 });
          }
        } catch (gitErr: any) {
          console.error("GitHub image commit failed:", gitErr);
          return NextResponse.json({ error: "GitHub upload error: " + gitErr.message }, { status: 500 });
        }
      } else if (isVercel) {
        return NextResponse.json({ 
          error: "GitHub Access Token (GITHUB_PAT) is missing in Vercel Environment Variables. Please add it to enable uploads." 
        }, { status: 400 });
      }

      // Generate base64 dataUrl for instant client-side preview
      const base64Data = buffer.toString("base64");
      const tempDataUrl = `data:${file.type || "image/png"};base64,${base64Data}`;

      // Return the public static route url and the temporary dataUrl
      return NextResponse.json({ 
        success: true, 
        url: `/partners/${filename}`,
        tempDataUrl
      });
    }

    const base64Data = buffer.toString("base64");
    const mimeType = file.type || "image/png";
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    return NextResponse.json({ success: true, url: dataUrl });
  } catch (err: any) {
    console.error("CRITICAL UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Server upload error: " + err.message }, { status: 500 });
  }
}
