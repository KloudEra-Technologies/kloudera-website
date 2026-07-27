"use client";

import React, { useState } from "react";
import { useAccessibility } from "./AccessibilityContext";

interface Booking {
  id: string;
  visitorName: string;
  company: string | null;
  email: string;
  phone: string | null;
  date: string;
  duration: number;
  timezone: string;
  purpose: string;
  platform: string;
  meetingLink: string | null;
  status: string;
}

interface Lead {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string | null;
  payload: string | null;
  status: string;
  createdAt: string;
}

interface AuditLog {
  id: string;
  email: string | null;
  action: string;
  details: string;
  ipAddress: string | null;
  createdAt: string;
}

interface AdminDashboardClientProps {
  initialBookings: Booking[];
  initialLeads: Lead[];
  initialAuditLogs: AuditLog[];
}

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({
  initialBookings,
  initialLeads,
  initialAuditLogs,
}) => {
  const { playAudio } = useAccessibility();
  const [activeTab, setActiveTab] = useState<"analytics" | "meetings" | "leads" | "careers" | "audits">("analytics");
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  const handleUpdateBooking = async (id: string, status: string) => {
    playAudio("click");
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        playAudio("success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLead = async (id: string, status: string) => {
    playAudio("click");
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        playAudio("success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = () => {
    playAudio("click");
    // Standard signout redirect
    window.location.href = "/api/auth/signout";
  };

  // Simple statistics
  const totalLeads = leads.length;
  const pendingMeetings = bookings.filter(b => b.status === "PENDING").length;
  const approvedMeetings = bookings.filter(b => b.status === "APPROVED").length;
  const quoteRequests = leads.filter(l => l.type === "HARDWARE_ENQUIRY").length;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-mono selection:bg-teal-500/30">
      {/* Admin header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div>
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">KLOUDERA INTEGRATION PANEL // SYSTEM CONTROL</span>
          <h1 className="text-lg font-bold tracking-widest text-white uppercase mt-1 glow-text-teal">
            SECURITY COMMAND CONTROL DECK
          </h1>
        </div>

        <button
          onClick={handleSignOut}
          className="mt-4 sm:mt-0 px-4 py-1.5 border border-rose-500/30 text-rose-400 text-[10px] tracking-wider rounded hover:bg-rose-500/10 cursor-none transition-all"
        >
          SIGNOUT // DISCONNECT
        </button>
      </header>

      {/* Navigation tabs */}
      <div className="border-b border-teal-500/10 bg-zinc-900/20 px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: "analytics", label: "BUSINESS_ANALYTICS" },
          { id: "meetings", label: "MEETING_SLOTS" },
          { id: "leads", label: "LEAD_INBOUNDS" },
          { id: "careers", label: "CAREERS_APPLICATIONS" },
          { id: "audits", label: "AUDIT_TELEMETRY" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); playAudio("click"); }}
            className={`px-4 py-2 border rounded text-[10px] font-bold tracking-widest transition-all cursor-none ${
              activeTab === tab.id
                ? "bg-teal-500 border-teal-400 text-black shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-teal-500/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* Tab 1: Analytics Dashboard */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Quick stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="cyber-panel p-4 rounded-lg border border-teal-500/20">
                <span className="text-[9px] text-zinc-500 uppercase">TOTAL INBOUND LEADS</span>
                <span className="block text-2xl font-bold text-teal-400 mt-2">{totalLeads}</span>
              </div>
              <div className="cyber-panel p-4 rounded-lg border border-teal-500/20">
                <span className="text-[9px] text-zinc-500 uppercase">APPROVED MEETINGS</span>
                <span className="block text-2xl font-bold text-white mt-2">{approvedMeetings}</span>
              </div>
              <div className="cyber-panel p-4 rounded-lg border border-teal-500/20">
                <span className="text-[9px] text-zinc-500 uppercase">PENDING MEETINGS</span>
                <span className="block text-2xl font-bold text-amber-400 mt-2">{pendingMeetings}</span>
              </div>
              <div className="cyber-panel p-4 rounded-lg border border-teal-500/20">
                <span className="text-[9px] text-zinc-500 uppercase">HARDWARE ENQUIRIES</span>
                <span className="block text-2xl font-bold text-rose-500 mt-2">{quoteRequests}</span>
              </div>
            </div>

            {/* Custom SVG Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line graph */}
              <div className="cyber-panel p-5 rounded-lg border border-teal-500/20 h-64 flex flex-col justify-between">
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider mb-2">WEEKLY LEAD REGISTRATION</span>
                <div className="flex-1 w-full bg-black/40 border border-teal-500/5 rounded p-2 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 150">
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(20, 184, 166, 0.05)" />
                    <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(20, 184, 166, 0.05)" />
                    <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(20, 184, 166, 0.05)" />
                    
                    {/* Line Plot */}
                    <polyline
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="2.5"
                      points="10,130 80,110 150,90 220,60 290,70 360,35"
                      className="glow-text-teal"
                    />

                    {/* Nodes */}
                    <circle cx="10" cy="130" r="3.5" fill="#a855f7" />
                    <circle cx="80" cy="110" r="3.5" fill="#14b8a6" />
                    <circle cx="150" cy="90" r="3.5" fill="#14b8a6" />
                    <circle cx="220" cy="60" r="3.5" fill="#14b8a6" />
                    <circle cx="290" cy="70" r="3.5" fill="#14b8a6" />
                    <circle cx="360" cy="35" r="3.5" fill="#14b8a6" />
                  </svg>
                </div>
                <div className="flex justify-between text-[8px] text-zinc-500 mt-2">
                  <span>WEEK 1</span>
                  <span>WEEK 2</span>
                  <span>WEEK 3</span>
                  <span>WEEK 4</span>
                  <span>WEEK 5</span>
                  <span>CURRENT</span>
                </div>
              </div>

              {/* Bar graph */}
              <div className="cyber-panel p-5 rounded-lg border border-teal-500/20 h-64 flex flex-col justify-between">
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider mb-2">LEAD DISTRIBUTION CLASS</span>
                <div className="flex-1 w-full bg-black/40 border border-teal-500/5 rounded p-4 flex justify-around items-end">
                  {[
                    { label: "QUOTE", height: 80, val: quoteRequests, color: "#f43f5e" },
                    { label: "CONTACT", height: 60, val: leads.filter(l => l.type === "CONTACT").length, color: "#14b8a6" },
                    { label: "SUPPORT", height: 35, val: leads.filter(l => l.type === "SUPPORT").length, color: "#3b82f6" },
                    { label: "CAREERS", height: 45, val: leads.filter(l => l.type === "CAREER_APPLICATION").length, color: "#a855f7" }
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-12">
                      <span className="text-[9px] text-zinc-300 font-bold">{bar.val}</span>
                      <div
                        className="w-8 rounded-t transition-all duration-1000 shadow-lg"
                        style={{
                          height: `${bar.height}%`,
                          backgroundColor: bar.color,
                          boxShadow: `0 0 10px ${bar.color}40`
                        }}
                      />
                      <span className="text-[8px] text-zinc-500 uppercase">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Meeting Bookings */}
        {activeTab === "meetings" && (
          <div className="cyber-panel p-5 rounded-lg border border-teal-500/20">
            <h2 className="text-xs font-bold text-teal-400 border-b border-teal-500/10 pb-3 mb-6 uppercase">
              MEETING REQUESTS REGISTRY
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-teal-500/20 text-zinc-500 uppercase">
                    <th className="p-3">Client</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Date/Time (UTC)</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Platform</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-500/10 text-zinc-300">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-zinc-900/30 transition-all">
                      <td className="p-3">
                        <span className="block text-white font-bold">{booking.visitorName}</span>
                        <span className="block text-zinc-500 text-[9px]">{booking.email}</span>
                      </td>
                      <td className="p-3 max-w-xs truncate">{booking.purpose}</td>
                      <td className="p-3">{new Date(booking.date).toLocaleDateString()} // {new Date(booking.date).toLocaleTimeString()}</td>
                      <td className="p-3">{booking.duration} mins</td>
                      <td className="p-3">{booking.platform}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                          booking.status === "APPROVED"
                            ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                            : booking.status === "DECLINED" || booking.status === "CANCELLED"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3 text-right flex justify-end gap-2">
                        {booking.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleUpdateBooking(booking.id, "APPROVED")}
                              className="px-2 py-1 bg-teal-500 text-black font-bold uppercase rounded cursor-none hover:bg-teal-400"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateBooking(booking.id, "DECLINED")}
                              className="px-2 py-1 bg-rose-500 text-black font-bold uppercase rounded cursor-none hover:bg-rose-400"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {booking.status === "APPROVED" && (
                          <button
                            onClick={() => handleUpdateBooking(booking.id, "CANCELLED")}
                            className="px-2 py-1 border border-rose-500/30 text-rose-400 uppercase rounded cursor-none hover:bg-rose-500/10"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-zinc-500">No meeting slots reserved in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Leads & Quotes */}
        {activeTab === "leads" && (
          <div className="cyber-panel p-5 rounded-lg border border-teal-500/20">
            <h2 className="text-xs font-bold text-teal-400 border-b border-teal-500/10 pb-3 mb-6 uppercase">
              INBOUND LEADS DECK
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-teal-500/20 text-zinc-500 uppercase">
                    <th className="p-3">Sender</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Subject / Message</th>
                    <th className="p-3">Metadata</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-500/10 text-zinc-300">
                  {leads.filter(l => l.type !== "CAREER_APPLICATION").map((lead) => (
                    <tr key={lead.id} className="hover:bg-zinc-900/30 transition-all">
                      <td className="p-3">
                        <span className="block text-white font-bold">{lead.name}</span>
                        <span className="block text-zinc-500 text-[9px]">{lead.email}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-teal-400 font-bold border border-teal-500/10">
                          {lead.type}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs">
                        <span className="block text-white font-semibold">{lead.subject}</span>
                        <span className="block text-zinc-400 mt-1 leading-normal truncate">{lead.message}</span>
                      </td>
                      <td className="p-3 max-w-xs truncate font-mono text-[9px] text-zinc-500">
                        {lead.payload || "N/A"}
                      </td>
                      <td className="p-3">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                          lead.status === "RESOLVED"
                            ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                            : lead.status === "IN_PROGRESS"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3 text-right flex justify-end gap-2">
                        {lead.status === "OPEN" && (
                          <button
                            onClick={() => handleUpdateLead(lead.id, "IN_PROGRESS")}
                            className="px-2 py-1 bg-amber-500 text-black font-bold uppercase rounded cursor-none hover:bg-amber-400"
                          >
                            Engage
                          </button>
                        )}
                        {lead.status !== "RESOLVED" && (
                          <button
                            onClick={() => handleUpdateLead(lead.id, "RESOLVED")}
                            className="px-2 py-1 bg-teal-500 text-black font-bold uppercase rounded cursor-none hover:bg-teal-400"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {leads.filter(l => l.type !== "CAREER_APPLICATION").length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-zinc-500">No leads submitted in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Career Applications */}
        {activeTab === "careers" && (
          <div className="cyber-panel p-5 rounded-lg border border-teal-500/20">
            <h2 className="text-xs font-bold text-teal-400 border-b border-teal-500/10 pb-3 mb-6 uppercase">
              JOB APPLICATIONS DATABASE
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-teal-500/20 text-zinc-500 uppercase">
                    <th className="p-3">Applicant</th>
                    <th className="p-3">Target Role</th>
                    <th className="p-3">Cover Brief</th>
                    <th className="p-3">Resume Payload</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-500/10 text-zinc-300">
                  {leads.filter(l => l.type === "CAREER_APPLICATION").map((app) => {
                    const parsedPayload = app.payload ? JSON.parse(app.payload) : {};
                    return (
                      <tr key={app.id} className="hover:bg-zinc-900/30 transition-all">
                        <td className="p-3">
                          <span className="block text-white font-bold">{app.name}</span>
                          <span className="block text-zinc-500 text-[9px]">{app.email}</span>
                          <span className="block text-zinc-600 text-[8px]">{app.phone}</span>
                        </td>
                        <td className="p-3 font-semibold text-teal-400">{parsedPayload.jobTitle || "N/A"}</td>
                        <td className="p-3 max-w-xs truncate">{app.message}</td>
                        <td className="p-3">
                          {parsedPayload.fileName ? (
                            <a
                              href={parsedPayload.resumeBase64}
                              download={parsedPayload.fileName}
                              className="text-teal-400 hover:underline font-bold cursor-none"
                            >
                              Download Resume ({parsedPayload.fileSize})
                            </a>
                          ) : (
                            <span className="text-zinc-600">No Resume File</span>
                          )}
                        </td>
                        <td className="p-3">{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                            app.status === "RESOLVED"
                              ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3 text-right flex justify-end gap-2">
                          {app.status !== "RESOLVED" && (
                            <button
                              onClick={() => handleUpdateLead(app.id, "RESOLVED")}
                              className="px-2 py-1 bg-teal-500 text-black font-bold uppercase rounded cursor-none hover:bg-teal-400"
                            >
                              Approve / Hire
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {leads.filter(l => l.type === "CAREER_APPLICATION").length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-zinc-500">No job applications logged in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Audit Log Telemetry */}
        {activeTab === "audits" && (
          <div className="cyber-panel p-5 rounded-lg border border-teal-500/20">
            <h2 className="text-xs font-bold text-teal-400 border-b border-teal-500/10 pb-3 mb-6 uppercase">
              SYSTEM SECURITY AUDIT LOGS
            </h2>
            <div className="space-y-3 font-mono text-[9px]">
              {initialAuditLogs.map((log) => (
                <div key={log.id} className="p-2 rounded bg-black/40 border border-teal-500/5 flex justify-between gap-4 text-zinc-400">
                  <div className="flex gap-2">
                    <span className="text-zinc-600">[{new Date(log.createdAt).toISOString()}]</span>
                    <span className="text-teal-400 font-semibold">{log.action}:</span>
                    <span className="text-zinc-300">{log.details}</span>
                  </div>
                  <span className="text-zinc-600">IP: {log.ipAddress || "127.0.0.1"}</span>
                </div>
              ))}
              {initialAuditLogs.length === 0 && (
                <div className="text-center py-6 text-zinc-500">No audit logs indexed.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
