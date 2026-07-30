"use client";

import React, { useState, useEffect } from "react";
import { useAccessibility } from "@/components/AccessibilityContext";
import { InlineText, useEditor } from "@/components/editor";
import { BgAnimation } from "@/components/BgAnimation";

interface Job {
  id: string;
  title: string;
  department: "Security" | "Engineering" | "Consulting" | "Sales";
  location: string;
  experience: string;
  desc: string;
  requirements: string[];
}

const JOBS_CATALOG: Job[] = [
  {
    id: "sec-auditor",
    title: "Senior Security Threat Auditor",
    department: "Security",
    location: "Hybrid (New York, NY)",
    experience: "Senior (5+ years)",
    desc: "Lead penetration testing runs and secure configuration reviews of enterprise Microsoft Entra ID and cloud networks.",
    requirements: [
      "Deep understanding of Active Directory, Entra ID, and cloud vectors.",
      "Certifications: OSCP, CISSP, or CEH preferred.",
      "Experience auditing containerized Kubernetes clusters."
    ]
  },
  {
    id: "ai-engineer",
    title: "AI Pipeline Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    experience: "Mid-level (3+ years)",
    desc: "Build and scale automated RAG frameworks, fine-tune localized LLMs, and optimize high-throughput CUDA compute matrices.",
    requirements: [
      "Proficient in Python, PyTorch, and vector database indexing (Pinecone, pgvector).",
      "Hands-on experience deploying LLM agent pipelines.",
      "Understanding of model quantization and inference deployment."
    ]
  },
  {
    id: "cloud-consultant",
    title: "Cloud Migration Architect",
    department: "Consulting",
    location: "Onsite (Sydney, NSW)",
    experience: "Lead (8+ years)",
    desc: "Guide Fortune 500 companies migrating legacy data rinks to secure, hybrid Azure Cloud infrastructures.",
    requirements: [
      "Azure Solutions Architect Expert certification.",
      "Proven history of managing migrations above 10,000 active users.",
      "Strong background in network design (VNets, ExpressRoute)."
    ]
  }
];

export default function CareersPage() {
  const { playAudio } = useAccessibility();
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");

  let editorContext: any;
  try {
    editorContext = useEditor();
  } catch (e) {
    editorContext = { isEditMode: false, siteData: null, updateNestedValue: () => {} };
  }
  const { isEditMode: isEditActive, updateNestedValue, siteData } = editorContext;

  const jobsList = siteData?.careers?.jobs || [
    { title: "Cyber Security Auditor", category: "SECURITY", desc: "Lead VAPT penetration tests and threat vector assessments across client cloud environments." },
    { title: "AI Compute Pipeline Lead", category: "HARDWARE", desc: "Architect Nvidia HGX H100 cluster deployments and benchmark deep learning model inference speed." },
    { title: "MS Solutions Architect", category: "MICROSOFT", desc: "Design Microsoft Entra ID security policies, M365 migrations, and automated Power RPA workflows." }
  ];

  const addJob = () => {
    const updated = [...jobsList];
    updated.push({
      title: "New Position",
      category: "ENGINEERING",
      desc: "Double click to edit details."
    });
    updateNestedValue(["careers", "jobs"], updated);
  };

  const deleteJob = (idx: number) => {
    const updated = [...jobsList];
    updated.splice(idx, 1);
    updateNestedValue(["careers", "jobs"], updated);
  };
  
  // Dynamic page content states
  const [timeline, setTimeline] = useState<any[]>([
    { step: "01", name: "PACKET AUDIT", desc: "Resume parsing and credential validation." },
    { step: "02", name: "DIAGNOSTIC TESTING", desc: "Practical hands-on scenario laboratories." },
    { step: "03", name: "COMMAND INTERVIEW", desc: "Virtual whiteboard architectural review." },
    { step: "04", name: "SECURE CONTRACT", desc: "Cryptographic signature onboarding." }
  ]);

  // File drag & drop states
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; base64: string } | null>(null);
  const [appForm, setAppForm] = useState({ name: "", email: "", phone: "", letter: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("API load failed");
      })
      .then(data => {
        if (data && data.careers) {
          if (data.careers.timeline) setTimeline(data.careers.timeline);
        }
      })
      .catch(err => console.log("Using fallback static copy:", err.message));
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragover") setIsDragOver(true);
    else setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    playAudio("click");
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        base64: reader.result as string
      });
      playAudio("success");
    };
    reader.readAsDataURL(file);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !uploadedFile) return;

    setSubmitting(true);
    playAudio("click");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CAREER_APPLICATION",
          name: appForm.name,
          email: appForm.email,
          phone: appForm.phone,
          subject: `Job Application: ${selectedJob.title}`,
          message: appForm.letter,
          payload: JSON.stringify({
            jobId: selectedJob.id,
            jobTitle: selectedJob.title,
            fileName: uploadedFile.name,
            fileSize: uploadedFile.size,
            resumeBase64: uploadedFile.base64
          })
        })
      });

      if (res.ok) {
        playAudio("success");
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setSelectedJob(null);
          setUploadedFile(null);
          setAppForm({ name: "", email: "", phone: "", letter: "" });
        }, 2000);
      }
    } catch (err) {
      console.error("Apply error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredJobs = jobsList.filter((job: any) => {
    const matchSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = deptFilter === "ALL" || (job.department || job.category) === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-teal-500/30 relative overflow-hidden">
      <BgAnimation variant="careers" />
      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // HUMAN LAYER</span>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal">
            CAREERS CORE
          </h1>
        </div>

        <div className="flex gap-4 mt-4 sm:mt-0 items-center font-mono">
          <div className="text-right">
            <span className="text-[9px] text-zinc-500 block">APPLICANT_PIPELINE</span>
            <span className="text-xs text-teal-400 font-bold">HIRING_DECK // ONLINE</span>
          </div>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-1.5 border border-teal-500/30 text-teal-400 text-[10px] tracking-wider rounded hover:bg-teal-500/10 cursor-none transition-all"
          >
            DISCONNECT
          </button>
        </div>
      </header>

      {/* Content wrapper */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-12 py-12">
        
        {/* Intro Banner */}
        <section className="cyber-panel p-8 rounded-lg border border-teal-500/20 bg-zinc-950/20 space-y-6 font-mono text-xs">
          <div className="space-y-2 border-b border-teal-500/10 pb-4">
            <span className="text-[9px] text-teal-400 font-bold tracking-widest block uppercase">HUMAN CAPITAL // CAREERS</span>
            <InlineText as="h2" className="text-lg font-bold text-white uppercase" path={["careers", "title"]} fallback="Bright Future Awaits You!" />
          </div>
          
          <InlineText as="p" multiline className="text-zinc-400 leading-relaxed text-[11px]" path={["careers", "intro"]} fallback="At KloudEra Technologies, we’re shaping the future of Cyber Security, Cloud AI, and Digital Transformation. We’re a team of innovators, creators, and problem-solvers who thrive on building impactful solutions." />

          <div className="border-t border-teal-500/10 pt-4 space-y-2">
            <span className="text-[9px] text-zinc-500 font-bold block uppercase tracking-wider">Why Join Us?</span>
            <InlineText as="p" multiline className="text-zinc-400 leading-relaxed text-[10.5px]" path={["careers", "whyJoinUs"]} fallback="Work on cutting-edge projects in Cyber Security, Cloud & AI Career growth & mentorship opportunities Inclusive and collaborative culture Flexible, future-ready workplace" />
          </div>
        </section>

        {/* Recruitment Timeline Banner */}
        <section className="cyber-panel p-6 rounded-lg border border-teal-500/20">
          <h2 className="text-xs font-bold font-mono tracking-widest text-teal-400 border-b border-teal-500/10 pb-3 mb-6 uppercase">
            APPLICANT RECRUITMENT CORRIDOR
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono text-[10px]">
            {timeline.map((stage: any, idx: number) => (
              <div key={idx} className="p-4 bg-black/40 border border-teal-500/5 rounded">
                <span className="block text-xs font-bold text-teal-400">
                  <InlineText as="span" path={["careers", "timeline", String(idx), "step"]} fallback={stage.step} /> // <InlineText as="span" path={["careers", "timeline", String(idx), "name"]} fallback={stage.name} />
                </span>
                <InlineText as="p" multiline className="text-zinc-500 mt-2 leading-relaxed" path={["careers", "timeline", String(idx), "desc"]} fallback={stage.desc} />
              </div>
            ))}
          </div>
        </section>

        {/* Search & Filters */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center border-b border-teal-500/10 pb-4">
            <h2 className="text-xs font-bold font-mono tracking-widest text-teal-400 uppercase flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
              Open Positions List
            </h2>
            <div className="flex gap-2 font-mono text-xs">
              <input
                type="text"
                placeholder="Search queries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-950 border border-teal-500/20 rounded px-3 py-1.5 text-white focus:outline-none focus:border-teal-500 cursor-none text-[11px]"
              />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-zinc-950 border border-teal-500/20 rounded px-3 py-1.5 text-white focus:outline-none focus:border-teal-500 cursor-none text-[11px]"
              >
                <option value="ALL">All Departments</option>
                <option value="Security">Security</option>
                <option value="Engineering">Engineering</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>
          </div>

          {/* Job grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
            {filteredJobs.map((job: any, idx: number) => {
              // Find the true index in jobsList for editing paths
              const originalIndex = jobsList.findIndex((j: any) => j.title === job.title);
              const pathIdx = originalIndex !== -1 ? originalIndex : idx;

              return (
                <div key={idx} className="cyber-panel p-5 rounded-lg border border-teal-500/20 flex flex-col justify-between relative">
                  {/* Delete Button */}
                  {isEditActive && (
                    <button
                      onClick={() => deleteJob(pathIdx)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-zinc-900 border border-zinc-800 p-1.5 rounded-full transition-all z-10 font-bold text-xs cursor-pointer"
                      title="Delete card"
                    >
                      ✕
                    </button>
                  )}
                  <div>
                    <div className="flex justify-between text-[9px] text-zinc-500 border-b border-teal-500/10 pb-2 mb-4">
                      <InlineText as="span" path={["careers", "jobs", String(pathIdx), "category"]} fallback={job.category || job.department || "ENGINEERING"} />
                      <InlineText as="span" path={["careers", "jobs", String(pathIdx), "location"]} fallback={job.location || "Remote"} />
                    </div>
                    <InlineText as="h3" className="text-sm font-bold text-white uppercase tracking-wide block" path={["careers", "jobs", String(pathIdx), "title"]} fallback={job.title} />
                    <InlineText as="span" className="text-[10px] text-teal-400 mt-1 block" path={["careers", "jobs", String(pathIdx), "experience"]} fallback={job.experience || "Mid-level"} />
                    <InlineText as="p" multiline className="text-zinc-400 mt-3 leading-relaxed text-[11px] block" path={["careers", "jobs", String(pathIdx), "desc"]} fallback={job.desc} />
                  </div>

                  <button
                    onClick={() => { setSelectedJob(job); playAudio("click"); }}
                    className="w-full mt-6 py-2 bg-teal-500 hover:bg-teal-400 text-black font-bold uppercase rounded cursor-pointer transition-all"
                  >
                    Initiate Application
                  </button>
                </div>
              );
            })}

            {/* Add New Job Card */}
            {isEditActive && (
              <button
                onClick={addJob}
                className="rounded-lg border-2 border-dashed border-teal-500/40 bg-zinc-950/20 hover:bg-teal-500/5 hover:border-teal-500 p-6 flex flex-col items-center justify-center space-y-2 transition-all min-h-[220px] font-bold text-teal-400 uppercase tracking-widest text-xs cursor-pointer"
              >
                <span>➕</span>
                <span>Add Position</span>
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Application Drawer Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-lg border border-teal-500/30 bg-zinc-950 p-8 rounded-lg shadow-2xl font-mono text-zinc-100 mx-4">
            <div className="flex justify-between items-center border-b border-teal-500/25 pb-4 mb-6">
              <div>
                <span className="text-[9px] text-teal-400 font-bold block">APPLYING SPECIMEN LAYER</span>
                <h2 className="text-sm font-bold text-white uppercase">{selectedJob.title}</h2>
              </div>
              <button
                onClick={() => { setSelectedJob(null); setUploadedFile(null); playAudio("click"); }}
                className="text-zinc-500 hover:text-white cursor-none"
              >
                [CLOSE]
              </button>
            </div>

            {success ? (
              <div className="text-center py-12 text-teal-400 animate-pulse font-bold uppercase tracking-widest text-xs">
                APPLICATION_TELEMETRY_LOGGED_SUCCESSFULLY
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-500">APPLICANT NAME</label>
                    <input
                      required
                      type="text"
                      value={appForm.name}
                      onChange={(e) => setAppForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-black border border-teal-500/10 rounded p-2 text-white focus:outline-none focus:border-teal-500 cursor-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-500">APPLICANT EMAIL</label>
                    <input
                      required
                      type="email"
                      value={appForm.email}
                      onChange={(e) => setAppForm(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-black border border-teal-500/10 rounded p-2 text-white focus:outline-none focus:border-teal-500 cursor-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-500">CONTACT PHONE</label>
                  <input
                    required
                    type="text"
                    value={appForm.phone}
                    onChange={(e) => setAppForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-black border border-teal-500/10 rounded p-2 text-white focus:outline-none focus:border-teal-500 cursor-none"
                  />
                </div>

                {/* Drag and Drop Zone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-500">CRYPTOGRAPHIC RESUME CREDENTIAL</label>
                  <div
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed p-6 rounded-lg text-center transition-all flex flex-col items-center justify-center min-h-[110px] ${
                      isDragOver
                        ? "border-teal-500 bg-teal-500/5 text-teal-300"
                        : uploadedFile
                        ? "border-teal-500/40 bg-zinc-900/40 text-teal-400"
                        : "border-teal-500/10 hover:border-teal-500/30 text-zinc-500"
                    }`}
                  >
                    {uploadedFile ? (
                      <div className="space-y-1">
                        <span className="block text-white font-bold text-[10px]">{uploadedFile.name}</span>
                        <span className="block text-[8px] text-zinc-500 uppercase">{uploadedFile.size} // READY TO SUBMIT</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-[10px] mb-1 font-bold">DRAG & DROP RESUME DATA HERE</p>
                        <p className="text-[9px] text-zinc-600">Supports PDF, DOCX under 5MB</p>
                        <label className="mt-3 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-teal-500/20 text-[9px] text-teal-400 font-bold rounded cursor-none cursor-pointer">
                          CHOOSE FILE
                          <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-500">COVER TELEMETRY BRIEFING</label>
                  <textarea
                    rows={3}
                    placeholder="Short introduction..."
                    value={appForm.letter}
                    onChange={(e) => setAppForm(prev => ({ ...prev, letter: e.target.value }))}
                    className="bg-black border border-teal-500/10 rounded p-2 text-white focus:outline-none focus:border-teal-500 cursor-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !uploadedFile}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-black font-bold uppercase rounded cursor-none transition-all shadow-[0_0_10px_rgba(20,184,166,0.3)] disabled:opacity-40"
                >
                  {submitting ? "TRANSMITTING DATA PACKETS..." : "TRANSMIT APPLICATIONS"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
