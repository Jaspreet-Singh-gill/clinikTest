"use client";

import { Stethoscope, Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const doctors = [
  {
    id: 1,
    name: "Dr. Sharma",
    specialty: "General Medicine",
    available: true,
    queue: 6,
    wait: "30 min",
  },
  {
    id: 2,
    name: "Dr. Khan",
    specialty: "Pediatrics",
    available: true,
    queue: 2,
    wait: "10 min",
  },
  {
    id: 3,
    name: "Dr. Mehta",
    specialty: "Dermatology",
    available: false,
    queue: 0,
    wait: "Unavailable",
  },
];

export default function DoctorListPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-10">
      {/* PAGE HEADER */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-bold">Available Doctors</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Check doctor availability and book your appointment before visiting
          the clinic.
        </p>
      </div>

      {/* DOCTOR GRID */}
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            {/* Doctor Info */}
            <h2 className="text-xl font-semibold">{doc.name}</h2>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
              <Stethoscope size={16} />
              {doc.specialty}
            </div>

            {/* Status */}
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  doc.available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {doc.available ? "Available Today" : "Not Available"}
              </span>
            </div>

            {/* Queue Info */}
            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Users size={16} />
                Queue: {doc.queue} patients
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} />
                Est Wait: {doc.wait}
              </div>
            </div>

            {/* Button */}
            <button
              disabled={!doc.available}
              onClick={() => router.push(`/book?doctor=${doc.id}`)}
              className={`mt-6 w-full py-2 rounded-xl font-medium transition
              ${
                doc.available
                  ? "bg-black text-white hover:opacity-90 dark:bg-white dark:text-black"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
