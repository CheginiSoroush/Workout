"use client";

// ============================================================
// جلسات اخیر — بدون قرمز و سرزنش:
// completed → «کامل شد» سبز، partial/abandoned → خنثی
// (همان نگاشت HomeView تا زبان اپ یکدست بماند)
// ============================================================

import { CheckCircle2, Circle, History, type LucideIcon } from "lucide-react";
import EmptyState from "@/components/app/EmptyState";
import { faDate } from "@/lib/fa";
import { PROGRAM } from "@/lib/program";

const STATUS: Record<string, { label: string; done: boolean }> = {
  completed: { label: "کامل شد", done: true },
  partial: { label: "نیمه‌تمام", done: false },
  abandoned: { label: "ذخیره شد", done: false },
  active: { label: "در جریان", done: false },
};

interface SessionRow {
  id: number;
  date: string;
  dayId: string;
  status: string;
}

export default function LastSessionsList({
  sessions,
}: {
  sessions: SessionRow[];
}) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="اولین جلسه‌ات اینجا ثبت می‌شه"
        description="از خانه یا برنامه «شروع تمرین» رو بزن — هر جلسه، کامل یا نیمه‌کاره، همین‌جا جمع می‌شه."
      />
    );
  }

  return (
    <ul aria-label="جلسه‌های اخیر" className="space-y-2">
      {sessions.map((s) => {
        const status = STATUS[s.status] ?? {
          label: s.status,
          done: false,
        };
        const day = PROGRAM.find((d) => d.id === s.dayId);
        const StatusIcon: LucideIcon = status.done ? CheckCircle2 : Circle;
        return (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/30 px-3.5 py-3"
          >
            <StatusIcon
              className={`h-5 w-5 shrink-0 ${
                status.done ? "text-primary" : "text-muted-foreground"
              }`}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">
                {day ? day.title : "جلسه تمرین"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {faDate(s.date)}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                status.done
                  ? "border-primary/35 bg-primary/12 text-primary"
                  : "border-border bg-muted text-muted-foreground"
              }`}
            >
              {status.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
