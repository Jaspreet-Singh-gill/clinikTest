import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";

interface Appointment {
  id: number;
  patientName: string;
  phone: string;
  doctorId: number;
  time: string;
  status: "waiting" | "seen" | "cancelled";
  createdAt: string;
  queuePosition: number;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  queue: number;
}

interface Database {
  doctors: Doctor[];
  appointments: Appointment[];
}

const dbPath = path.join(process.cwd(), "data", "db.json");

export async function POST(request: NextRequest) {
  try {
    // 2. Type the incoming body
    const body = await request.json();
    const {
      patientName,
      phone,
      doctorId,
      time,
    }: {
      patientName: string;
      phone: string;
      doctorId: string | number;
      time: string;
    } = body;

    // 3. Basic Validation
    if (!patientName || !doctorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 4. Read & Parse with Type Casting
    const fileData = fs.readFileSync(dbPath, "utf8");
    const db: Database = JSON.parse(fileData);

    const parsedDoctorId =
      typeof doctorId === "string" ? parseInt(doctorId) : doctorId;

    // 5. Create new appointment with strict typing
    const newAppointment: Appointment = {
      id: Date.now(),
      patientName,
      phone,
      doctorId: parsedDoctorId,
      time,
      status: "waiting",
      createdAt: new Date().toISOString(),
      queuePosition:
        db.appointments.filter(
          (a) => a.doctorId === parsedDoctorId && a.status === "waiting",
        ).length + 1,
    };

    // 6. Save back to DB
    db.appointments.push(newAppointment);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return NextResponse.json({
      success: true,
      message: "Appointment booked!",
      appointment: newAppointment,
      estimatedWaitMinutes: newAppointment.queuePosition * 15,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
