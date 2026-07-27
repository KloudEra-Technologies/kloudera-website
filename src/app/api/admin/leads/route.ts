import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leads = await prisma.leadSubmission.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ leads });
  } catch (err) {
    console.error("Admin Leads GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updated = await prisma.leadSubmission.update({
      where: { id },
      data: { status }
    });

    // Seed audit log
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any)?.id,
        email: (session.user as any)?.email,
        action: "UPDATE_LEAD_STATUS",
        details: `Lead ${id} status updated to ${status}`,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1"
      }
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (err) {
    console.error("Admin Leads PATCH error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
