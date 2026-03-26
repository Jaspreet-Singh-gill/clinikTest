"use client";

import { useState, useEffect } from "react";

// Mock data
const initialQueue = [
  { id: 1, name: "Ram Sharma", time: "11:00 AM", phone: "98765 43210" },
  { id: 2, name: "Ahmed Khan", time: "11:15 AM", phone: "98765 43211" },
  { id: 3, name: "Sita Patel", time: "11:30 AM", phone: "98765 43212" },
  { id: 4, name: "You (Demo User)", time: "11:45 AM", phone: "98765 43213" },
];

export default function ClinicDashboard() {
  const [queue, setQueue] = useState(initialQueue);
  const [patientsSeenToday, setPatientsSeenToday] = useState(24);
  const [walkInName, setWalkInName] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- HACKATHON FEATURE LOGIC ---

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMarkSeen = (id: number) => {
    setQueue((prev) => prev.filter((p) => p.id !== id));
    setPatientsSeenToday((prev) => prev + 1);
    showToast("Patient marked as seen.");
  };

  const handleSkip = (id: number) => {
    setQueue((prev) => {
      const patientToSkip = prev.find((p) => p.id === id);
      if (!patientToSkip) return prev;
      return [
        ...prev.filter((p) => p.id !== id),
        { ...patientToSkip, time: "Delayed" },
      ];
    });
    showToast("Patient moved to bottom of queue.");
  };

  // Feature 1: Emergency Triage (Move to index 0)
  const handlePrioritize = (id: number) => {
    setQueue((prev) => {
      const patient = prev.find((p) => p.id === id);
      if (!patient) return prev;
      return [patient, ...prev.filter((p) => p.id !== id)];
    });
    showToast("🚨 Patient prioritized for emergency.");
  };

  // Feature 2: Add Walk-in
  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) return;

    const newPatient = {
      id: Date.now(),
      name: `${walkInName} (Walk-in)`,
      time: "Just Now",
      phone: "N/A",
    };
    setQueue([...queue, newPatient]);
    setWalkInName("");
    showToast(`Walk-in ${walkInName} added to queue.`);
  };

  // Feature 3: Ping Patient
  const handlePing = (name: string) => {
    showToast(`💬 WhatsApp reminder sent to ${name}!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Dr. Sharma's Clinic
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Receptionist Dashboard • Live Queue
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex space-x-6">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Waiting
              </p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {queue.length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Seen Today
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {patientsSeenToday}
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar (Walk-ins & Status) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <form
            onSubmit={handleAddWalkIn}
            className="flex w-full sm:w-auto gap-2"
          >
            <input
              type="text"
              placeholder="Walk-in Patient Name"
              value={walkInName}
              onChange={(e) => setWalkInName(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              + Add Walk-in
            </button>
          </form>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              System Online
            </span>
          </div>
        </div>

        {/* Active Queue List */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {queue.length === 0 ? (
              <li className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <span className="block text-4xl mb-3">🎉</span>
                Queue is empty. Great job today!
              </li>
            ) : (
              queue.map((patient, index) => (
                <li
                  key={patient.id}
                  className={`px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    index === 0 ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  {/* Patient Info */}
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold ${
                        index === 0
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {patient.name}
                        {index === 0 && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                            Next Up
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3">
                        <span>🕒 {patient.time}</span>
                        <span>📱 {patient.phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {index !== 0 && (
                      <button
                        onClick={() => handlePrioritize(patient.id)}
                        title="Emergency Priority"
                        className="px-3 py-2 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg text-sm font-medium transition-colors"
                      >
                        🚨 Triage
                      </button>
                    )}
                    <button
                      onClick={() => handlePing(patient.name)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      💬 Ping
                    </button>
                    <button
                      onClick={() => handleSkip(patient.id)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => handleMarkSeen(patient.id)}
                      className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      Mark Seen
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Toast Notification UI */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up">
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3">
            <span className="text-xl">✨</span>
            <p className="font-medium text-sm">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
