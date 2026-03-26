"use client";

import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
// If using Next.js router for navigation after booking:
// import { useRouter } from "next/navigation";

export default function BookingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    doctor: "1",
    time: "10:30 AM",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // FAKE API CALL FOR HACKATHON
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/queue");
      alert("Booking confirmed! Redirecting to your live queue status...");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors duration-300">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">
            Book Appointment
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors">
            Secure your spot in the queue instantly.
          </p>
        </div>

        {/* 🚨 THE HACKATHON TWIST: Travel Advisory Banner */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg transition-colors">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-amber-500 text-xl">⏱️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 transition-colors">
                Clinic Busy Alert
              </h3>
              <div className="mt-1 text-xs text-amber-700 dark:text-amber-400 transition-colors">
                <p>
                  Average wait today:{" "}
                  <strong className="dark:text-amber-300">1.5 hours</strong>.
                </p>
                <p>
                  Book now, but recommended arrival time is{" "}
                  <strong className="dark:text-amber-300">12:10 PM</strong> to
                  avoid waiting in crowded areas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {/* Patient Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
            >
              Patient Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Ram Sharma"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
            >
              Phone / WhatsApp Number
            </label>
            <input
              type="tel"
              id="phone"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">
              We'll send you a WhatsApp alert when you're 2 patients away.
            </p>
          </div>

          {/* Doctor Selection */}
          <div>
            <label
              htmlFor="doctor"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
            >
              Select Doctor
            </label>
            <select
              id="doctor"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              value={formData.doctor}
              onChange={(e) =>
                setFormData({ ...formData, doctor: e.target.value })
              }
            >
              <option value="1">Dr. Sharma (General Medicine)</option>
              <option value="2">Dr. Khan (Pediatrics)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
              isSubmitting
                ? "bg-blue-400 dark:bg-blue-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Securing Spot...
              </span>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
