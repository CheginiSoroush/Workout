"use client";

// ============================================================
// رکوردهای شخصی (PR) — سنگین‌ترین ست ثبت‌شده برای هر حرکت
// فقط با خودِ کاربر مقایسه می‌شود؛ هیچ‌جای اپ مقایسه با دیگران نیست
// ============================================================

import { Trophy, CalendarDays, type LucideIcon } from "lucide-react";
import EmptyState from "@/components/app/EmptyState";
import { getExerciseById } from "@/lib/program";
import { faNum, faDate } from "@/lib/fa";
import { formatWeight, type Units } from "@/lib/units";

interface Pr {
  exerciseId: string;
  weight: number;
  reps: number | null;
  date: string;
}

export default function PrsCards({
  prs,
  units,
}: {
  prs: Pr[];
  units: Units;
}) {
  if (prs.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="رکوردهای شخصیت اینجا ساخته می‌شوند"
        description="با ثبت ست‌ها در جلسه‌های تمرین، سنگین‌ترین ستت برای هر حرکت همین‌جا جمع می‌شه — رکورد تو با خودت."
      />
    );
  }

  return (
    <div
      role="list"
      aria-label="رکوردهای شخصی"
      className="grid gap-3 sm:grid-cols-2"
    >
      {prs.map((pr) => {
        const ex = getExerciseById(pr.exerciseId);
        const name = ex?.faName ?? pr.exerciseId;
        return (
          <div
            key={pr.exerciseId}
            role="listitem"
            className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/60 p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/12">
              <Trophy className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold" dir="auto">
                {name}
              </p>
              <p className="mt-1 text-sm font-bold text-primary">
                {formatWeight(pr.weight, units)}
                {pr.reps != null && (
                  <span className="font-normal text-foreground/80">
                    {" "}
                    × {faNum(pr.reps)} تکرار
                  </span>
                )}
              </p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                <CalendarDays className="h-3 w-3" aria-hidden="true" />
                {faDate(pr.date)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
