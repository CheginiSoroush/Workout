import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/data?mode=logs|all — پاک کردن داده‌ها فقط با انتخاب صریح کاربر
// mode=logs → جلسات/ست‌ها/چک‌لیست/کشش/دوچرخه (وزن بدن و پروفایل می‌ماند)
// mode=all  → همه‌چیز شامل وزن بدن و پروفایل
//            (پروفایل بعداً با پیش‌فرض‌ها و onboardingDone=false دوباره ساخته می‌شود)
export async function DELETE(request: NextRequest) {
  try {
    const mode = request.nextUrl.searchParams.get("mode") ?? "logs";
    if (mode !== "logs" && mode !== "all") {
      return NextResponse.json(
        { error: "حالت نامعتبر — فقط logs یا all" },
        { status: 400 }
      );
    }

    const deleted = await db.$transaction(async (tx) => {
      const bikeLogs = await tx.bikeLog.deleteMany({});
      const stretchLogs = await tx.stretchLog.deleteMany({});
      const workoutLogs = await tx.workoutLog.deleteMany({});
      const sets = await tx.setEntry.deleteMany({});
      const sessions = await tx.session.deleteMany({});

      let weightEntries: { count: number } = { count: 0 };
      let profile: { count: number } = { count: 0 };
      if (mode === "all") {
        weightEntries = await tx.weightEntry.deleteMany({});
        profile = await tx.profile.deleteMany({});
      }

      return {
        sessions: sessions.count,
        sets: sets.count,
        workoutLogs: workoutLogs.count,
        stretchLogs: stretchLogs.count,
        bikeLogs: bikeLogs.count,
        weightEntries: weightEntries.count,
        profile: profile.count,
      };
    });

    return NextResponse.json({ ok: true, mode, deleted });
  } catch (error) {
    console.error("DELETE /api/data error:", error);
    return NextResponse.json(
      { error: "خطا در پاک کردن داده‌ها" },
      { status: 500 }
    );
  }
}
