"use client";
import { CalendarCheck, Users, Activity } from "lucide-react";
import Link from "next/link";

// function HomePage() {
//   return (
//     <div>
//       <h1>Welcome to the Home Page!</h1>
//       {/* Link to the about page using client-side navigation */}
//       <Link href="/about">Go to the About Page</Link>
//     </div>
//   );
// }

// export default HomePage;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Skip the Clinic Crowds
          </h2>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            Patients can check doctor availability, book appointments, and track
            their live queue position before traveling to the clinic.
          </p>

          <div className="mt-8 flex gap-4">
            <Link href={"/booking"}>
              <button className="px-6 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity">
                Book Appointment
              </button>
            </Link>
            <Link href={"/doctorList"}>
              <button className="px-6 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                View Doctors
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-6 shadow-xl">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Live Queue Preview
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Ram</span>
              <span>#1</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Sita</span>
              <span>#2</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Ahmed</span>
              <span>#3</span>
            </div>
            <div className="flex justify-between font-semibold text-blue-600 dark:text-blue-400">
              <span>You</span>
              <span>#4</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
          Features
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            icon={<CalendarCheck />}
            title="Appointment Booking"
            text="Patients can reserve slots before traveling to the clinic."
          />

          <Feature
            icon={<Users />}
            title="Live Queue Tracking"
            text="Know your exact queue position and reduce waiting time."
          />

          <Feature
            icon={<Activity />}
            title="Clinic Dashboard"
            text="Staff can mark patients as seen and manage schedules."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto bg-black text-white dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-800 rounded-3xl p-12 text-center shadow-lg">
          <h3 className="text-3xl font-bold">Smarter Rural Healthcare</h3>
          <p className="mt-4 opacity-80">
            Reduce travel time and overcrowding in rural clinics with real-time
            scheduling and queue visibility.
          </p>

          <button className="mt-6 px-8 py-3 rounded-2xl bg-white text-black dark:bg-gray-800 dark:text-white hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg dark:hover:shadow-gray-950 transition-shadow">
      <div className="mb-4 text-gray-900 dark:text-gray-100">{icon}</div>
      <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
        {title}
      </h4>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{text}</p>
    </div>
  );
}
