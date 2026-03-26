import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";

interface Appointment {
  id: number;
  doctorId: number;
  status: "waiting" | "seen" | "cancelled";
  queuePosition: number;
}

interface Database {
  doctors: any[];
  appointments: Appointment[];
}

const dbPath = path.join(process.cwd(), "data", "db.json");

export async function POST(request: NextRequest) {
  try {
    const { doctorId } = await request.json();

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
    }

    // 1. Read Database
    const fileData = fs.readFileSync(dbPath, "utf8");
    const db: Database = JSON.parse(fileData);

    // 2. Find the FIRST patient in "waiting" status for this specific doctor
    // We sort by id (timestamp) to ensure the person who booked first is seen first
    const nextInLine = db.appointments
      .filter((a) => a.doctorId === parseInt(doctorId) && a.status === "waiting")
      .sort((a, b) => a.id - b.id)[0];

    if (!nextInLine) {
      return NextResponse.json({ message: "No patients in queue" }, { status: 200 });
    }

    // 3. Mark that patient as 'seen'
    const appointmentIndex = db.appointments.findIndex((a) => a.id === nextInLine.id);
    db.appointments[appointmentIndex].status = "seen";
    db.appointments[appointmentIndex].queuePosition = 0; // No longer in queue

    // 4. Update the remaining 'waiting' patients' queue positions
    // This makes the "Live Queue" feature work for patients watching their screens
    db.appointments = db.appointments.map((app) => {
      if (app.doctorId === parseInt(doctorId) && app.status === "waiting") {
        // Recalculate position: count how many people are ahead of this app (older timestamp)
        const ahead = db.appointments.filter(
          (other) => 
            other.doctorId === app.doctorId && 
            other.status === "waiting" && 
            other.id < app.id
        ).length;
        
        return { ...app, queuePosition: ahead + 1 };
      }
      return app;
    });

    // 5. Save back to the JSON file
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return NextResponse.json({
      success: true,
      message: `Patient ${nextInLine.id} marked as seen. Queue updated.`,
      clearedPatient: nextInLine
    });

  } catch (error) {
    console.error("Next Patient Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}