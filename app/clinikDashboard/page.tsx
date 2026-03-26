"use client";

import React, { useEffect, useState } from "react";

interface Patient {
  id: number;
  patientName: string;
  phone: string;
  doctorId: number;
  status: "waiting" | "seen";
  time: string;
}

export default function ClinicDashboard() {
  const [queue, setQueue] = useState<Patient[]>([]);
  const [patientsSeenToday, setPatientsSeenToday] = useState(0);
  const [walkInName, setWalkInName] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const DOCTOR_ID = 1;

  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/doctors");
      const data = await res.json();

      const waitingPatients = data.appointments.filter(
        (app: Patient) =>
          app.doctorId === DOCTOR_ID && app.status === "waiting",
      );

      const seenCount = data.appointments.filter(
        (app: Patient) => app.doctorId === DOCTOR_ID && app.status === "seen",
      ).length;

      setQueue(waitingPatients.sort((a: any, b: any) => a.id - b.id));
      setPatientsSeenToday(seenCount);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkSeen = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/next-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: DOCTOR_ID }),
      });
      showToast("Patient marked as seen!");
      fetchQueue();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) return;
    try {
      await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: walkInName,
          phone: "Walk-in",
          doctorId: DOCTOR_ID,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }),
      });
      setWalkInName("");
      showToast("Walk-in added!");
      fetchQueue();
    } catch (err) {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* TOP STATS CARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 md:col-span-2 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Dr. Sharma's Clinic
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Managing {queue.length} waiting patients
              </p>
            </div>
            <div className="hidden sm:block">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                <span className="w-2 h-2 mr-2 bg-green-500 rounded-full animate-pulse"></span>
                System Live
              </span>
            </div>
          </div>

          <div className="bg-blue-600 dark:bg-blue-700 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-center">
            <p className="text-blue-100 dark:text-blue-200 text-sm uppercase font-semibold">
              Total Seen Today
            </p>
            <p className="text-4xl font-black">{patientsSeenToday}</p>
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleAddWalkIn} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="New Walk-in Name..."
              value={walkInName}
              onChange={(e) => setWalkInName(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            />
            <button className="bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95">
              Add
            </button>
          </form>

          <button
            onClick={handleMarkSeen}
            disabled={queue.length === 0 || isLoading}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            {isLoading ? "Processing..." : "Next Patient →"}
          </button>
        </div>

        {/* QUEUE LIST */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              Current Waiting List
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 italic">
              Updates every 3s
            </span>
          </div>

          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {queue.length === 0 ? (
              <li className="p-12 text-center text-slate-400 dark:text-slate-600">
                <p className="text-3xl mb-2">🎉</p>
                No patients waiting.
              </li>
            ) : (
              queue.map((p, index) => (
                <li
                  key={p.id}
                  className={`p-6 flex items-center justify-between transition-colors ${index === 0 ? "bg-blue-50/50 dark:bg-blue-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index === 0 ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {p.patientName}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {p.time} • {p.phone}
                      </p>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="animate-pulse bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800">
                      In Consultation
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-500 border border-slate-700 dark:border-slate-200">
          <span className="w-2 h-2 bg-blue-400 dark:bg-blue-600 rounded-full animate-ping" />
          <p className="font-semibold text-sm">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
