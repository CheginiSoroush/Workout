import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/export — خروجی JSON همه داده‌ها؛ مالکیت داده با کاربر است.
// هیچ فیلدی فیلتر یا حذف نمی‌شود — همان چیزی که روی همین دستگاه ذخیره شده.
export async function GET() {
  try {
    const [
      profile,
      sessions,
      weightEntries,
      workoutLogs,
      stretchLogs,
      bikeLogs,
    ] = await Promise.all([
      db.profile.findMany({ orderBy: { id: "asc" } }),
      db.session.findMany({
        include: { sets: { orderBy: { id: "asc" } } },
        orderBy: { id: "asc" },
      }),
      db.weightEntry.findMany({ orderBy: { date: "asc" } }),
      db.workoutLog.findMany({ orderBy: { completedAt: "asc" } }),
      db.stretchLog.findMany({ orderBy: { date: "asc" } }),
      db.bikeLog.findMany({ orderBy: { date: "asc" } }),
    ]);

    return NextResponse.json({
      app: "fitness-dashboard",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        profile,
        sessions, // شامل sets هر جلسه
        weightEntries,
        workoutLogs,
        stretchLogs,
        bikeLogs,
      },
    });
  } catch (error) {
    console.error("GET /api/export error:", error);
    return NextResponse.json(
      { error: "خطا در خروجی گرفتن داده‌ها" },
      { status: 500 }
    );
  }
}
