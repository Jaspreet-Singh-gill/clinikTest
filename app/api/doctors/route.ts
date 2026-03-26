import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Reuse the interfaces for consistency
interface Appointment {
  doctorId: number;
  status: "waiting" | "seen" | "cancelled";
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

interface Database {
  doctors: Doctor[];
  appointments: Appointment[];
}

const dbPath = path.join(process.cwd(), "data", "db.json");

export async function GET() {
  try {
    // 1. Read the local JSON database
    const fileData = fs.readFileSync(dbPath, "utf8");
    const db: Database = JSON.parse(fileData);

    // 2. Map through doctors and calculate their live queue stats
    const doctorListWithStats = db.doctors.map((doc) => {
      const activeQueue = db.appointments.filter(
        (app) => app.doctorId === doc.id && app.status === "waiting",
      ).length;

      return {
        ...doc,
        currentQueue: activeQueue,
        estimatedWaitTime: activeQueue * 15, // 15 mins per patient logic
        isAvailable: true, // You can toggle this based on time if needed
      };
    });

    // 3. Return the enriched list
    return NextResponse.json({
      doctors: doctorListWithStats,
      appointments: db.appointments, // Add this line!
    });
  } catch (error) {
    console.error("Fetch Doctors Error:", error);
    return NextResponse.json(
      { error: "Failed to load doctors" },
      { status: 500 },
    );
  }
}
