"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  currentQueue: number;
  estimatedWaitTime: number;
  isAvailable: boolean;
}

export default function BookingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false); // Fix for Hydration Error

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    doctor: "",
    time: "10:30 AM",
  });

  const [doctorListData, setDoctorListData] = useState<Doctor[]>([]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors");
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();

      // FIX: Handle both array and object responses
      if (data.doctors) {
        setDoctorListData(data.doctors);
      } else if (Array.isArray(data)) {
        setDoctorListData(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    setMounted(true); // Component has mounted on the client
    fetchDoctors();
    const interval = setInterval(fetchDoctors, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctor) return alert("Please select a doctor");

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: formData.name,
          phone: formData.phone,
          doctorId: formData.doctor,
          time: formData.time,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `Booking confirmed! You are #${result.appointment.queuePosition} in line.`,
        );
        router.push("/queue");
      } else {
        throw new Error("Booking failed");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent hydration mismatch by returning null until client-side mount
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Book Appointment
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Secure your spot in the queue instantly.
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <div className="flex">
            <span className="text-amber-500 text-xl">⏱️</span>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Clinic Busy Alert
              </h3>
              <div className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                <p>
                  Average wait: <strong>1.5 hours</strong>. Arrival:{" "}
                  <strong>12:10 PM</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Patient Name
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ram Sharma"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone / WhatsApp Number
            </label>
            <input
              type="tel"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Doctor
            </label>
            <select
              required
              className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={formData.doctor}
              onChange={(e) =>
                setFormData({ ...formData, doctor: e.target.value })
              }
            >
              <option value="" disabled>
                Choose a specialist...
              </option>
              {Array.isArray(doctorListData) &&
                doctorListData.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} — {doctor.specialty} ({doctor.currentQueue} in
                    queue)
                  </option>
                ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white transition-all ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Securing Spot..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
