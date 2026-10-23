import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const logSchema = z.object({
  dayId: z.enum(["day1", "day2", "day3"]),
  weekKey: z.string().regex(/^\d{4}-W\d{2}$/, "فرمت هفته باید 2025-W23 باشد"),
});

// GET /api/workout-logs?weekKey=... — لاگ‌های یک هفته یا همه
export async function GET(request: NextRequest) {
  try {
    const weekKey = request.nextUrl.searchParams.get("weekKey");
    const logs = await db.workoutLog.findMany({
      where: weekKey ? { weekKey } : undefined,
      orderBy: { completedAt: "desc" },
    });
    return NextResponse.json({ logs });
  } catch (error) {
    console.error("GET /api/workout-logs error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت لاگ تمرین" },
      { status: 500 }
    );
  }
}

// POST /api/workout-logs — ثبت جلسه انجام‌شده
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = logSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "داده نامعتبر است", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const log = await db.workoutLog.upsert({
      where: {
        dayId_weekKey: {
          dayId: parsed.data.dayId,
          weekKey: parsed.data.weekKey,
        },
      },
      update: { completedAt: new Date() },
      create: { dayId: parsed.data.dayId, weekKey: parsed.data.weekKey },
    });

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.error("POST /api/workout-logs error:", error);
    return NextResponse.json(
      { error: "خطا در ثبت جلسه" },
      { status: 500 }
    );
  }
}

// DELETE /api/workout-logs?dayId=day1&weekKey=... — حذف ثبت جلسه
export async function DELETE(request: NextRequest) {
  try {
    const dayId = request.nextUrl.searchParams.get("dayId");
    const weekKey = request.nextUrl.searchParams.get("weekKey");
    if (!dayId || !weekKey) {
      return NextResponse.json(
        { error: "dayId و weekKey الزامی هستند" },
        { status: 400 }
      );
    }
    await db.workoutLog.delete({
      where: { dayId_weekKey: { dayId, weekKey } },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/workout-logs error:", error);
    return NextResponse.json(
      { error: "خطا در حذف جلسه" },
      { status: 500 }
    );
  }
}
