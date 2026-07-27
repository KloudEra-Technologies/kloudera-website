import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    redirect("/admin/login");
  }

  // Fetch initial data on the server
  const bookings = await prisma.meetingBooking.findMany({
    orderBy: { date: "desc" },
  });

  const leads = await prisma.leadSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const auditLogs = await prisma.auditLog.findMany({
    take: 30,
    orderBy: { createdAt: "desc" },
  });

  // Map Date objects to string for simple JSON serialization across Server -> Client boundary
  const serializedBookings = bookings.map((b) => ({
    ...b,
    date: b.date.toISOString(),
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));

  const serializedLeads = leads.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  }));

  const serializedAuditLogs = auditLogs.map((log) => ({
    ...log,
    createdAt: log.createdAt.toISOString(),
  }));

  return (
    <AdminDashboardClient
      initialBookings={serializedBookings}
      initialLeads={serializedLeads}
      initialAuditLogs={serializedAuditLogs}
    />
  );
}
