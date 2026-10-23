"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CalendarCheck, CheckCircle2, Circle, Trophy } from "lucide-react";
import { PROGRAM } from "@/lib/program";

interface WorkoutLog {
  id: string;
  dayId: string;
  weekKey: string;
}

function getWeekKey(d = new Date()): string {
  // شماره هفته ISO
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7; // یکشنبه=7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export default function WorkoutChecklist() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const { toast } = useToast();
  const weekKey = getWeekKey();

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/workout-logs?weekKey=${weekKey}`);
      const data = await res.json();
      setLogs(data.logs ?? []);
    } catch {
      // بی‌صدا — خطا در رندر اولیه آزاردهنده است
    } finally {
      setLoading(false);
    }
  }, [weekKey]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (dayId: string) => {
    setBusy(dayId);
    const done = logs.some((l) => l.dayId === dayId);
    try {
      if (done) {
        await fetch(
          `/api/workout-logs?dayId=${dayId}&weekKey=${weekKey}`,
          { method: "DELETE" }
        );
        setLogs((prev) => prev.filter((l) => l.dayId !== dayId));
      } else {
        const res = await fetch("/api/workout-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dayId, weekKey }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setLogs((prev) => [...prev.filter((l) => l.dayId !== dayId), data.log]);
        toast({ title: "آفرین! 💪", description: "جلسه ثبت شد — پامپ امروز مال توئه" });
      }
    } catch {
      toast({ title: "خطا", description: "ثبت جلسه ناموفق بود", variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const doneCount = logs.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 flex-wrap">
          <CalendarCheck className="w-5 h-5 text-primary" />
          جلسات این هفته
          <span className="text-xs text-muted-foreground font-normal" dir="ltr">
            {weekKey}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </>
        ) : (
          PROGRAM.map((day) => {
            const done = logs.some((l) => l.dayId === day.id);
            return (
              <button
                key={day.id}
                onClick={() => toggle(day.id)}
                disabled={busy === day.id}
                className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-right transition-all hover:border-primary/50 disabled:opacity-60 ${
                  done
                    ? "bg-primary/10 border-primary/50"
                    : "bg-secondary/40 border-border"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1">
                  <div className="font-bold text-sm">{day.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {day.weekDay} — {day.subtitle}
                  </div>
                </div>
                {done && (
                  <span className="text-xs font-bold text-primary">انجام شد ✅</span>
                )}
              </button>
            );
          })
        )}

        {doneCount === 3 && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-sm text-amber-400 font-bold">
            <Trophy className="w-5 h-5" />
            هفته کامل شد! این یعنی ثبات — همون چیزی که فرم شناگری می‌سازه 🏆
          </div>
        )}
      </CardContent>
    </Card>
  );
}
