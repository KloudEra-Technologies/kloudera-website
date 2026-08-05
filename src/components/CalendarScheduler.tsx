"use client";

import React, { useState, useEffect } from "react";
import { useAccessibility } from "./AccessibilityContext";
import { InlineText } from "./editor";

interface OccupiedSlot {
  start: string;
  end: string;
}

export const CalendarScheduler: React.FC = () => {
  const { playAudio } = useAccessibility();
  
  // Calendly Booking Phases: "date_time" | "details" | "confirmed"
  const [phase, setPhase] = useState<"date_time" | "details" | "confirmed">("date_time");
  
  // Selection States
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [activeTimeSlot, setActiveTimeSlot] = useState<string>(""); // For click-to-confirm UX
  const [duration, setDuration] = useState<number>(30);
  const [timezone, setTimezone] = useState<string>("Asia/Kolkata");
  const [platform, setPlatform] = useState<string>("Teams");
  
  // Month Pagination States
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Slot Loading & Storage
  const [occupiedSlots, setOccupiedSlots] = useState<OccupiedSlot[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form States
  const [visitorName, setVisitorName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [guests, setGuests] = useState<string[]>([]);
  const [guestInput, setGuestInput] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  const timezones = [
    "UTC", 
    "America/New_York", 
    "America/Los_Angeles", 
    "Europe/London", 
    "Asia/Kolkata", 
    "Asia/Singapore", 
    "Australia/Sydney"
  ];

  // Auto-detect visitor timezone on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezones.includes(zone)) {
        setTimezone(zone);
      }
    }
  }, []);

  // Fetch occupied slots whenever selectedDate or duration changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await fetch(`/api/meetings?date=${selectedDate}`);
        if (res.ok) {
          const data = await res.json();
          setOccupiedSlots(data.occupiedSlots || []);
          generateSlots(selectedDate, data.occupiedSlots || []);
        }
      } catch (err) {
        console.error("Fetch slots error:", err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, duration]);

  // Generate 30-min interval slots between 09:00 and 17:00 (Business Hours)
  const generateSlots = (dateStr: string, occupied: OccupiedSlot[]) => {
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 17;
    const intervalMins = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += intervalMins) {
        const timeString = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
        
        // Construct localized Date objects
        const slotStart = new Date(`${dateStr}T${timeString}:00.000Z`);
        const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

        // Overlap logic: start1 < end2 AND end1 > start2
        const isOverlap = occupied.some((occ) => {
          const oStart = new Date(occ.start).getTime();
          const oEnd = new Date(occ.end).getTime();
          const sStart = slotStart.getTime();
          const sEnd = slotEnd.getTime();
          return sStart < oEnd && sEnd > oStart;
        });

        const isPast = slotStart.getTime() < Date.now();

        if (!isOverlap && !isPast) {
          slots.push(timeString);
        }
      }
    }

    setAvailableSlots(slots);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    playAudio("click");

    const requestedStart = `${selectedDate}T${selectedTime}:00.000Z`;

    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorName,
          email,
          company,
          phone,
          dateStr: requestedStart,
          duration,
          timezone,
          purpose: purpose || "General Consultation",
          platform,
          specialRequests: `Guests: ${guests.join(", ")}; Note: ${specialRequests}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        const successPayload = {
          id: data.bookingId,
          date: requestedStart,
          duration,
          meetingLink: data.meetingLink,
          cancelToken: data.cancelToken,
          visitorName,
          email,
          company,
          purpose,
          platform
        };
        setBookingSuccess(successPayload);
        playAudio("success");
        setPhase("confirmed");
      } else {
        const err = await res.json();
        alert(err.error || "Overlapping booking detected. Please select another slot.");
      }
    } catch (err) {
      console.error("Booking submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Calendar URL Generator
  const getGoogleCalendarUrl = () => {
    if (!bookingSuccess) return "";
    const start = new Date(bookingSuccess.date);
    const end = new Date(start.getTime() + bookingSuccess.duration * 60 * 1000);
    
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const title = "KloudEra Consultation Session";
    const details = `Purpose: ${bookingSuccess.purpose}\nMeeting Link: ${bookingSuccess.meetingLink}`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(bookingSuccess.meetingLink)}`;
  };

  // Outlook Calendar URL Generator
  const getOutlookCalendarUrl = () => {
    if (!bookingSuccess) return "";
    const start = new Date(bookingSuccess.date);
    const end = new Date(start.getTime() + bookingSuccess.duration * 60 * 1000);
    
    const fmt = (d: Date) => d.toISOString();
    const title = "KloudEra Consultation Session";
    const details = `Purpose: ${bookingSuccess.purpose}\nMeeting Link: ${bookingSuccess.meetingLink}`;
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${fmt(start)}&enddt=${fmt(end)}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(bookingSuccess.meetingLink)}`;
  };

  // Client-side .ics download helper
  const downloadIcs = () => {
    if (!bookingSuccess) return;
    playAudio("click");

    const start = new Date(bookingSuccess.date);
    const end = new Date(start.getTime() + bookingSuccess.duration * 60 * 1000);
    
    const formatIcsDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Kloudera Technologies//Meeting Scheduler//EN",
      "BEGIN:VEVENT",
      `UID:${bookingSuccess.id}@kloudera.tech`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:Kloudera Business Consultation`,
      `DESCRIPTION:Meeting Purpose: ${bookingSuccess.purpose}\\nVideo Link: ${bookingSuccess.meetingLink}`,
      `LOCATION:${bookingSuccess.meetingLink}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `kloudera-meeting-${bookingSuccess.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calendar Day Generation Helper
  const getDaysInMonthGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of month offset
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days: { dayNumber: number | null; dateString: string; isPast: boolean; isWeekend: boolean }[] = [];
    
    // Fill offsets
    for (let i = 0; i < firstDay; i++) {
      days.push({ dayNumber: null, dateString: "", isPast: true, isWeekend: false });
    }

    // Fill days
    for (let day = 1; day <= totalDays; day++) {
      const dateObj = new Date(year, month, day);
      const yyyy = dateObj.getFullYear();
      const mm = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const dd = dateObj.getDate().toString().padStart(2, "0");
      const dateString = `${yyyy}-${mm}-${dd}`;
      
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
      
      // Calculate midnight comparison to avoid local timezone issues
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPast = dateObj.getTime() < today.getTime();

      days.push({ dayNumber: day, dateString, isPast, isWeekend });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    playAudio("click");
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    playAudio("click");
  };

  const addGuest = () => {
    if (guestInput.trim() && guestInput.includes("@")) {
      setGuests([...guests, guestInput.trim()]);
      setGuestInput("");
      playAudio("click");
    }
  };

  const removeGuest = (idx: number) => {
    setGuests(guests.filter((_, i) => i !== idx));
    playAudio("click");
  };

  const daysGrid = getDaysInMonthGrid();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="max-w-5xl mx-auto bg-zinc-950/80 border border-teal-500/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(20,184,166,0.05)] backdrop-blur-xl grid grid-cols-1 md:grid-cols-12 min-h-[550px] font-mono text-zinc-300">
      
      {/* Left Pane: Host & Event Profile */}
      <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-teal-500/10 p-6 flex flex-col justify-between bg-black/40">
        <div className="space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-black font-extrabold text-sm shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              KC
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">ORGANIZATION</span>
              <InlineText as="h3" className="text-white text-xs font-bold uppercase tracking-wider block" path={["book-meeting", "orgName"]} fallback="Kloudera Advisors" />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <InlineText
              as="h2"
              className="text-sm font-extrabold text-white uppercase tracking-wider leading-relaxed block"
              path={["book-meeting", "eventTitle"]}
              fallback="Cloud Strategy & Architecture Consultation"
            />
            <InlineText
              as="p"
              multiline
              className="text-[10px] text-zinc-400 leading-relaxed font-sans block"
              path={["book-meeting", "eventDesc"]}
              fallback="Connect with our principal architects to review cloud scaling strategy, enterprise data recovery tools, and network security blueprints."
            />
          </div>

          <div className="space-y-3.5 pt-3 border-t border-teal-500/5 text-[10.5px]">
            <div className="flex items-center gap-3 text-zinc-400">
              <span className="text-base text-teal-400">⏰</span>
              <span className="font-bold text-white">{duration} Minutes Session</span>
            </div>

            <div className="flex items-center gap-3 text-zinc-400">
              <span className="text-base text-teal-400">📹</span>
              <span className="font-bold text-teal-300">{platform} video invite provided</span>
            </div>

            <div className="flex items-center gap-3 text-zinc-400">
              <span className="text-base text-teal-400">🌍</span>
              <span className="text-[10px] truncate max-w-full font-bold text-white">{timezone}</span>
            </div>
          </div>

          {phase !== "confirmed" && (
            <div className="space-y-3 pt-4 border-t border-teal-500/5">
              <InlineText as="span" className="text-[9px] text-zinc-500 font-bold uppercase block" path={["book-meeting", "lengthLabel"]} fallback="1. Select Meeting Length" />
              <div className="grid grid-cols-3 gap-2">
                {[30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => { setDuration(mins); playAudio("click"); }}
                    className={`py-1.5 rounded border text-[10px] font-bold transition-all ${
                      duration === mins
                        ? "bg-teal-500 border-teal-400 text-black shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-teal-500/20"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 text-[9px] text-zinc-600 border-t border-teal-500/5">
          KLOUDERA SCHEDULER // SECURE CONNECT v1.3.0
        </div>
      </div>

      {/* Right Pane: Calendly Deck */}
      <div className="md:col-span-8 p-6 flex flex-col justify-center">
        
        {/* Phase 1: Date & Time Selector */}
        {phase === "date_time" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
            
            {/* Monthly Calendar Grid */}
            <div className={`${selectedDate ? "lg:col-span-7" : "lg:col-span-12"} space-y-4 transition-all duration-300`}>
              <div className="flex justify-between items-center pb-2 border-b border-teal-500/10">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-teal-500/10 hover:text-teal-400 rounded transition-all cursor-pointer font-bold"
                >
                  ◀
                </button>
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">{monthName}</h4>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-teal-500/10 hover:text-teal-400 rounded transition-all cursor-pointer font-bold"
                >
                  ▶
                </button>
              </div>

              {/* Calendar Grid Header */}
              <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-zinc-500 font-extrabold uppercase">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {daysGrid.map((day, idx) => {
                  if (!day.dayNumber) {
                    return <div key={`empty-${idx}`} />;
                  }

                  const isDisabled = day.isPast || day.isWeekend;
                  const isSelected = selectedDate === day.dateString;

                  return (
                    <button
                      key={day.dateString}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => { setSelectedDate(day.dateString); setSelectedTime(""); setActiveTimeSlot(""); playAudio("click"); }}
                      className={`h-9 w-9 mx-auto rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                        isDisabled
                          ? "opacity-20 text-zinc-600 cursor-not-allowed"
                          : isSelected
                          ? "bg-teal-500 text-black shadow-[0_0_12px_rgba(20,184,166,0.4)]"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-teal-400 hover:bg-teal-500/10 cursor-pointer"
                      }`}
                    >
                      {day.dayNumber}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slide-out Time List side panel */}
            {selectedDate && (
              <div className="lg:col-span-5 space-y-4 border-l border-teal-500/5 pl-4 animate-[fadeIn_0.25s_ease-out]">
                <div>
                  <h4 className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">AVAILABLE TIME SLOTS</h4>
                  <span className="text-[11px] text-teal-400 font-bold">{selectedDate}</span>
                </div>

                {loadingSlots ? (
                  <div className="text-center py-10 text-zinc-500 animate-pulse text-[10px]">Syncing slots...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-10 text-rose-500 text-[10.5px] font-bold">No slots available.</div>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {availableSlots.map((time) => {
                      const isActive = activeTimeSlot === time;
                      return (
                        <div key={time} className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setActiveTimeSlot(time); playAudio("click"); }}
                            className={`flex-1 py-2 text-center text-xs font-extrabold border rounded-lg transition-all ${
                              isActive
                                ? "bg-zinc-900 border-teal-500 text-teal-400"
                                : "bg-zinc-950 border-zinc-800 hover:border-teal-500/20 text-zinc-300"
                            }`}
                          >
                            {time}
                          </button>
                          
                          {isActive && (
                            <button
                              type="button"
                              onClick={() => { setSelectedTime(time); setPhase("details"); playAudio("success"); }}
                              className="px-4 bg-teal-500 text-black font-extrabold uppercase rounded-lg text-[10px] tracking-wider transition-all animate-[slideIn_0.2s_ease-out] shadow-[0_0_12px_rgba(20,184,166,0.4)]"
                            >
                              Confirm
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Phase 2: Enter Details Form */}
        {phase === "details" && (
          <form onSubmit={handleBookingSubmit} className="space-y-5 animate-[fadeIn_0.25s_ease-out]">
            <div className="flex items-center gap-3 pb-3 border-b border-teal-500/10">
              <button
                type="button"
                onClick={() => { setPhase("date_time"); playAudio("click"); }}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-teal-400 text-[10px] font-bold border border-zinc-800 rounded transition-all cursor-pointer"
              >
                ← Back
              </button>
              <InlineText as="h3" className="text-white text-xs font-bold uppercase tracking-wider block" path={["book-meeting", "confirmHeading"]} fallback="Confirm Your Consultation Details" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-zinc-500 text-[9px] font-bold">FULL NAME *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="bg-black border border-zinc-800 focus:border-teal-400 rounded-lg p-2.5 text-white text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-zinc-500 text-[9px] font-bold">EMAIL ADDRESS *</label>
                <input
                  required
                  type="email"
                  placeholder="e.g. john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black border border-zinc-800 focus:border-teal-400 rounded-lg p-2.5 text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-zinc-500 text-[9px] font-bold">COMPANY NAME</label>
                <input
                  type="text"
                  placeholder="e.g. KloudEra Inc."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-black border border-zinc-800 focus:border-teal-400 rounded-lg p-2.5 text-white text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-zinc-500 text-[9px] font-bold">PHONE NUMBER</label>
                <input
                  type="text"
                  placeholder="e.g. +1 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-black border border-zinc-800 focus:border-teal-400 rounded-lg p-2.5 text-white text-xs"
                />
              </div>
            </div>

            {/* Guest list management */}
            <div className="space-y-2 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
              <span className="text-[9px] text-zinc-400 font-bold uppercase block">👥 Add Guests (Optional)</span>
              
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="e.g. colleague@company.com"
                  value={guestInput}
                  onChange={(e) => setGuestInput(e.target.value)}
                  className="flex-1 bg-black border border-zinc-800 focus:border-teal-400 rounded-lg p-2 text-xs"
                />
                <button
                  type="button"
                  onClick={addGuest}
                  className="px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {guests.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {guests.map((g, idx) => (
                    <span key={g} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[9.5px] text-zinc-300">
                      {g}
                      <button type="button" onClick={() => removeGuest(idx)} className="text-rose-400 hover:text-rose-300 font-bold text-xs cursor-pointer">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-zinc-500 text-[9px] font-bold">PRIMARY GOAL / DISCUSSION POINTS</label>
              <textarea
                rows={2}
                placeholder="Brief summary of what you'd like to discuss..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="bg-black border border-zinc-800 focus:border-teal-400 rounded-lg p-2.5 text-white text-xs resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-500 text-[9px] font-bold">VIDEO TELECONFERENCE PLATFORM</label>
              <div className="grid grid-cols-2 gap-3">
                {["Teams", "Google Meet"].map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => { setPlatform(plat); playAudio("click"); }}
                    className={`py-2 rounded-lg border font-bold text-xs transition-all ${
                      platform === plat
                        ? "bg-teal-500 border-teal-400 text-black shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-teal-500/20"
                    }`}
                  >
                    {plat === "Teams" ? "Microsoft Teams" : "Google Meet"}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-black font-extrabold uppercase rounded-xl text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "TRANSMITTING DATA..." : "Confirm & Book Consultation"}
            </button>
          </form>
        )}

        {/* Phase 3: Confirmed Success Screen */}
        {phase === "confirmed" && bookingSuccess && (
          <div className="text-center space-y-6 max-w-md mx-auto animate-[fadeIn_0.3s_ease-out]">
            <div className="h-12 w-12 bg-teal-500 rounded-full flex items-center justify-center text-black mx-auto font-bold text-lg shadow-[0_0_20px_rgba(20,184,166,0.5)]">
              ✓
            </div>
            
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">You are Scheduled!</h2>
              <p className="text-zinc-500 text-[10.5px]">A confirmation and calendar invite has been dispatched.</p>
            </div>

            <div className="text-left bg-zinc-950/60 border border-teal-500/10 p-5 rounded-xl space-y-3.5 font-mono text-[10.5px]">
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">VISITOR:</span>
                <span className="text-white font-bold">{bookingSuccess.visitorName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">DATE & TIME:</span>
                <span className="text-teal-400 font-bold">{bookingSuccess.date.split("T")[0]} // {selectedTime}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">DURATION:</span>
                <span className="text-white">{bookingSuccess.duration} Minutes</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">PLATFORM:</span>
                <span className="text-white">{bookingSuccess.platform}</span>
              </div>
              
              <div className="pt-1 flex flex-col gap-1.5">
                <span className="text-zinc-500 uppercase text-[9px] font-bold">Video Meeting Link:</span>
                <a
                  href={bookingSuccess.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 break-all hover:underline font-bold text-[9px] bg-black/40 p-2 rounded border border-zinc-900"
                >
                  {bookingSuccess.meetingLink}
                </a>
              </div>
            </div>

            {/* Export options */}
            <div className="space-y-3">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Add to Your Calendar</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-lg text-[9.5px] border border-zinc-800 flex items-center justify-center gap-1.5 transition-all"
                >
                  🟢 Google Calendar
                </a>

                <a
                  href={getOutlookCalendarUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-lg text-[9.5px] border border-zinc-800 flex items-center justify-center gap-1.5 transition-all"
                >
                  🔵 Outlook Web
                </a>

                <button
                  onClick={downloadIcs}
                  className="py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-lg text-[9.5px] border border-zinc-800 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  📥 Download iCal
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setPhase("date_time");
                setSelectedDate("");
                setSelectedTime("");
                setActiveTimeSlot("");
                setBookingSuccess(null);
                setGuests([]);
              }}
              className="px-6 py-2.5 border border-teal-500/20 hover:bg-teal-500/10 text-teal-400 font-bold uppercase rounded-lg text-[10px] transition-all cursor-pointer"
            >
              Book Another Meeting
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
