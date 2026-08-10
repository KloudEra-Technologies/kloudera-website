import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY || "";
  const smtpPassSet = Boolean(process.env.SMTP_PASSWORD);
  
  let jsonApiKey = "";
  try {
    const contentRaw = fs.readFileSync(path.join(process.cwd(), "src", "data", "website_content.json"), "utf8");
    const contentJson = JSON.parse(contentRaw);
    jsonApiKey = contentJson.credentials?.emailConfig?.apiKey || "";
  } catch (err) {}

  return NextResponse.json({
    envKeyLoaded: apiKey.startsWith("re_"),
    envKeyLength: apiKey.length,
    envKeyPrefix: apiKey ? apiKey.substring(0, 7) + "..." : "none",
    jsonKeyLoaded: jsonApiKey.startsWith("re_"),
    jsonKeyLength: jsonApiKey.length,
    smtpPassSet
  });
}
