import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getWeekKey } from "@/lib/week";

const patchSchema = z.object({
  status: z.enum(["active", "completed", "partial", "abandoned"]),
  feeling: z.number().int().min(1).max(5).nullable().optional(),
  note: z.string().max(500).nullable().optional(),
  reason: z.enum(["fatigue", "pain", "time", "other"]).nullable().optional(),
});

// GET /api/sessions/[id] — جزئیات جلسه + ست‌ها
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionId = Number(id);
    if (!Number.isInteger(sessionId) || sessionId < 1) {
      return NextResponse.json({ error: "شناسه نامعتبر است" }, { status: 400 });
    }

    const session = await db.session.findUnique({
      where: { id: sessionId },
      include: {
        sets: { orderBy: [{ exerciseOrder: "asc" }, { createdAt: "asc" }] },
      },
    });
    if (!session) {
      return NextResponse.json({ error: "جلسه پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error("GET /api/sessions/[id] error:", error);
    return NextResponse.json({ error: "خطا در دریافت جلسه" }, { status: 500 });
  }
}

// PATCH /api/sessions/[id] — ثبت وضعیت جلسه (پایان/تکمیل/انصراف)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionId = Number(id);
    if (!Number.isInteger(sessionId) || sessionId < 1) {
      return NextResponse.json({ error: "شناسه نامعتبر است" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "داده نامعتبر است", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const current = await db.session.findUnique({ where: { id: sessionId } });
    if (!current) {
      return NextResponse.json({ error: "جلسه پیدا نشد" }, { status: 404 });
    }

    const { status, feeling, note, reason } = parsed.data;
    const leavingActive = status !== "active";

    // کلیدهای undefined حذف می‌شوند تا فیلدهای فعلی بازنویسی نشوند
    const patchData: Record<string, unknown> = { status };
    if (feeling !== undefined) patchData.feeling = feeling;
    if (note !== undefined) patchData.note = note;
    if (reason !== undefined) patchData.reason = reason;
    if (leavingActive && !current.endedAt) patchData.endedAt = new Date();

    const session = await db.session.update({
      where: { id: sessionId },
      data: patchData,
      include: {
        sets: { orderBy: [{ exerciseOrder: "asc" }, { createdAt: "asc" }] },
      },
    });

    // همگام‌سازی چک‌لیست هفتگی (WorkoutLog) با همان فرمت weekKey موجود:
    // «YYYY-Www» مثل 2025-W23 — شماره هفته ISO بر پایه تاریخ جلسه
    const weekKey = getWeekKey(current.date);
    const wasCompleted = current.status === "completed";

    if (status === "completed" && !wasCompleted) {
      await db.workoutLog.upsert({
        where: { dayId_weekKey: { dayId: current.dayId, weekKey } },
        update: { completedAt: new Date() },
        create: { dayId: current.dayId, weekKey },
      });
    } else if (wasCompleted && status !== "completed") {
      // اگر جلسه تکمیل‌شده به حالت دیگر برگشت، تیک چک‌لیست هم برداشته شود
      await db.workoutLog
        .delete({
          where: { dayId_weekKey: { dayId: current.dayId, weekKey } },
        })
        .catch(() => null); // اگر رکوردی نبود مشکلی نیست
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error("PATCH /api/sessions/[id] error:", error);
    return NextResponse.json({ error: "خطا در ثبت جلسه" }, { status: 500 });
  }
}

// DELETE /api/sessions/[id] — حذف جلسه و ست‌هایش (cascade)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionId = Number(id);
    if (!Number.isInteger(sessionId) || sessionId < 1) {
      return NextResponse.json({ error: "شناسه نامعتبر است" }, { status: 400 });
    }

    const current = await db.session.findUnique({ where: { id: sessionId } });
    if (!current) {
      return NextResponse.json({ error: "جلسه پیدا نشد" }, { status: 404 });
    }

    await db.session.delete({ where: { id: sessionId } });

    // اگر جلسه تکمیل‌شده بود، تیک چک‌لیست هفتگی هم حذف شود
    if (current.status === "completed") {
      const weekKey = getWeekKey(current.date);
      await db.workoutLog
        .delete({
          where: { dayId_weekKey: { dayId: current.dayId, weekKey } },
        })
        .catch(() => null);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/sessions/[id] error:", error);
    return NextResponse.json({ error: "خطا در حذف جلسه" }, { status: 500 });
  }
}
