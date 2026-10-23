import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getWeekKey } from "@/lib/week";
import { todayISO } from "@/lib/fa";

// GET /api/progress — آمار پیشرفت (محاسبات در JS بعد از query)
export async function GET() {
  try {
    // جلسات تکمیل‌شده با ست‌ها — پایه‌ی PRها، حجم و روند هفتگی
    const completed = await db.session.findMany({
      where: { status: "completed" },
      include: {
        sets: { orderBy: [{ exerciseOrder: "asc" }, { createdAt: "asc" }] },
      },
      orderBy: { startedAt: "desc" },
      take: 400,
    });

    const lastSessions = await db.session.findMany({
      select: { id: true, date: true, dayId: true, status: true },
      orderBy: { startedAt: "desc" },
      take: 5,
    });

    const [stretchDays, lastWeight] = await Promise.all([
      db.stretchLog.count(),
      db.weightEntry.findFirst({ orderBy: { date: "desc" } }),
    ]);

    // ---------- PRها: برای هر حرکت، بیشترین وزنه (با reps و تاریخ همان رکورد) ----------
    const prMap = new Map<
      string,
      { exerciseId: string; weight: number; reps: number | null; date: string }
    >();
    for (const s of completed) {
      for (const set of s.sets) {
        if (set.skipped || set.weight == null) continue;
        const prev = prMap.get(set.exerciseId);
        const better =
          !prev ||
          set.weight > prev.weight ||
          (set.weight === prev.weight &&
            (set.reps ?? 0) > (prev.reps ?? 0));
        if (better) {
          prMap.set(set.exerciseId, {
            exerciseId: set.exerciseId,
            weight: set.weight,
            reps: set.reps,
            date: s.date,
          });
        }
      }
    }
    const prs = Array.from(prMap.values()).sort((a, b) =>
      b.weight - a.weight
    );

    // ---------- ۸ هفته اخیر: تعداد جلسات + حجم (وزنه × تکرار) ----------
    const weeklyMap = new Map<string, { completedCount: number; volume: number }>();
    const today = todayISO();
    const [ty, tm, td] = today.split("-").map(Number);
    for (let i = 0; i < 8; i++) {
      const d = new Date(Date.UTC(ty, tm - 1, td) - i * 7 * 86400000);
      const key = getWeekKey(
        `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`
      );
      weeklyMap.set(key, { completedCount: 0, volume: 0 });
    }
    for (const s of completed) {
      const bucket = weeklyMap.get(getWeekKey(s.date));
      if (!bucket) continue;
      bucket.completedCount += 1;
      for (const set of s.sets) {
        if (set.skipped || set.weight == null || set.reps == null) continue;
        bucket.volume += set.weight * set.reps;
      }
    }
    const weekly = Array.from(weeklyMap.entries())
      .reverse()
      .map(([weekKey, v]) => ({ weekKey, ...v }));

    // ---------- جمع کل ----------
    let totalSets = 0;
    let totalVolume = 0;
    for (const s of completed) {
      for (const set of s.sets) {
        if (set.skipped) continue;
        totalSets += 1;
        if (set.weight != null && set.reps != null) {
          totalVolume += set.weight * set.reps;
        }
      }
    }

    return NextResponse.json({
      prs,
      weekly,
      totals: {
        totalSessions: completed.length,
        totalSets,
        totalVolume,
      },
      lastSessions,
      stretchDays,
      lastWeight: lastWeight
        ? { weight: lastWeight.weight, date: lastWeight.date }
        : null,
    });
  } catch (error) {
    console.error("GET /api/progress error:", error);
    return NextResponse.json(
      { error: "خطا در محاسبه پیشرفت" },
      { status: 500 }
    );
  }
}
