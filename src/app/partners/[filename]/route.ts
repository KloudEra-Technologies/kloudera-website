import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const githubRawUrl = `https://raw.githubusercontent.com/KloudEra-Technologies/kloudera-website/main/public/partners/${filename}`;
    
    console.log(`[Partners Proxy] File not found locally, fetching from GitHub Raw: ${githubRawUrl}`);
    const res = await fetch(githubRawUrl, { cache: "no-store" });
    
    if (!res.ok) {
      return new Response("Not Found", { status: 404 });
    }

    const contentType = res.headers.get("content-type") || "image/png";
    const arrayBuffer = await res.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error: any) {
    console.error("[Partners Proxy] Error proxying file:", error.message);
    return new Response("Error proxying image", { status: 500 });
  }
}
