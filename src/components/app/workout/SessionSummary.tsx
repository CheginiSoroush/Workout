"use client";

// ============================================================
// SessionSummary — خلاصه و بستن جلسه
// دو مسیر: «ثبت و پایان» (completed) یا «نیمه‌کاره ذخیره می‌کنم» (partial)
// هیچ لحن سرزنشی — استراحت هم بخشی از برنامه است.
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock3,
  ListChecks,
  Scale,
  Trophy,
} from "lucide-react";
import type { WorkoutDay } from "@/lib/program";
import { faNum } from "@/lib/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  faDuration,
  type SessionWithSets,
} from "./types";

interface SessionSummaryProps {
  session: SessionWithSets;
  day: WorkoutDay;
  /** جلسات completed قبلی همین روز — برای تشخیص رکورد */
  prevSessions: SessionWithSets[];
  onDone: () => void;
  onBack: () => void;
}

const FEELINGS: { value: number; label: string }[] = [
  { value: 5, label: "عالی" },
  { value: 4, label: "خوب" },
  { value: 3, label: "معمولی" },
  { value: 2, label: "کم‌انرژی" },
  { value: 1, label: "سخت" },
];

const REASONS: { value: "fatigue" | "pain" | "time" | "other"; label: string }[] = [
  { value: "fatigue", label: "خستگی" },
  { value: "pain", label: "درد" },
  { value: "time", label: "کمبود وقت" },
  { value: "other", label: "دیگر" },
];

export default function SessionSummary({
  session,
  day,
  prevSessions,
  onDone,
  onBack,
}: SessionSummaryProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [feeling, setFeeling] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [partialOpen, setPartialOpen] = useState(false);
  const [reason, setReason] = useState<"fatigue" | "pain" | "time" | "other" | null>(null);
  const [reasonNote, setReasonNote] = useState("");

  // مدت جلسه — زنده تا لحظه ثبت (شروع از رندر اول؛ به‌روزرسانی با تایمر)
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const loggedSets = useMemo(
    () => session.sets.filter((s) => !s.skipped),
    [session.sets]
  );
  const totalVolume = useMemo(
    () =>
      loggedSets.reduce((acc, s) => acc + (s.weight ?? 0) * (s.reps ?? 0), 0),
    [loggedSets]
  );

  // رکوردها: وزنه هر حرکت اگر از بهترین جلسه قبل بیشتر باشد
  const records = useMemo(() => {
    return day.exercises
      .map((ex) => {
        const cur = session.sets.filter(
          (s) =>
            s.exerciseId === ex.id && !s.skipped && s.weight != null
        );
        if (cur.length === 0) return null;
        const maxCur = Math.max(...cur.map((s) => s.weight as number));
        const prevWeights = prevSessions.flatMap((ps) =>
          ps.sets
            .filter(
              (st) =>
                st.exerciseId === ex.id && !st.skipped && st.weight != null
            )
            .map((st) => st.weight as number)
        );
        if (prevWeights.length === 0) return null; // «بهترین جلسه قبل» وجود ندارد
        const prevBest = Math.max(...prevWeights);
        if (maxCur > prevBest) {
          return { exId: ex.id, name: ex.faName, weight: maxCur };
        }
        return null;
      })
      .filter((r): r is { exId: string; name: string; weight: number } => r !== null);
  }, [day.exercises, session.sets, prevSessions]);

  const durationMs = Math.max(0, now - new Date(session.startedAt).getTime());

  // ---------- ثبت نهایی ----------
  const finishMutation = useMutation({
    mutationFn: async (payload: {
      status: "completed" | "partial";
      feeling?: number;
      note?: string;
      reason?: "fatigue" | "pain" | "time" | "other" | null;
    }) => {
      const body: Record<string, unknown> = { status: payload.status };
      if (payload.feeling != null) body.feeling = payload.feeling;
      if (payload.note) body.note = payload.note;
      if (payload.reason !== undefined) body.reason = payload.reason;
      const res = await fetch(`/api/sessions/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? "ثبت جلسه ناموفق بود");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries();
      if (variables.status === "completed") {
        toast({ title: "جلسه کامل شد", description: "خوب بود." });
      } else {
        toast({
          title: "ثبت شد",
          description: "استراحت هم بخشی از برنامه است.",
        });
      }
      onDone();
    },
    onError: (error: Error) => {
      toast({ title: "ثبت نشد", description: error.message });
    },
  });

  const submitComplete = () => {
    finishMutation.mutate({
      status: "completed",
      feeling: feeling ?? undefined,
      note: note.trim() || undefined,
    });
  };

  const submitPartial = () => {
    finishMutation.mutate({
      status: "partial",
      reason: reason,
      note: reasonNote.trim() || undefined,
    });
  };

  const statCard =
    "rounded-2xl border border-border bg-secondary/40 px-3 py-3 text-center space-y-1";

  return (
    <Card data-testid="session-summary">
      <CardContent className="space-y-5 p-4 sm:p-6">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-black">جمع‌بندی جلسه</h2>
          <p className="text-sm text-muted-foreground">
            {day.title} — {day.weekDay}
          </p>
        </div>

        {/* ---------- آمار جلسه ---------- */}
        <div className="grid grid-cols-3 gap-2" aria-label="آمار جلسه">
          <div className={statCard}>
            <Clock3 className="mx-auto h-4 w-4 text-primary" aria-hidden="true" />
            <p className="text-[11px] font-bold text-muted-foreground">مدت</p>
            <p className="text-sm font-black leading-6" suppressHydrationWarning>
              {faDuration(durationMs)}
            </p>
          </div>
          <div className={statCard}>
            <ListChecks className="mx-auto h-4 w-4 text-primary" aria-hidden="true" />
            <p className="text-[11px] font-bold text-muted-foreground">ست ثبت‌شده</p>
            <p className="text-sm font-black leading-6">
              {faNum(loggedSets.length)} ست
            </p>
          </div>
          <div className={statCard}>
            <Scale className="mx-auto h-4 w-4 text-primary" aria-hidden="true" />
            <p className="text-[11px] font-bold text-muted-foreground">حجم کل</p>
            <p className="text-sm font-black leading-6">
              {faNum(Math.round(totalVolume))}
              <span className="text-[11px] font-bold text-muted-foreground"> کیلو</span>
            </p>
          </div>
        </div>

        {/* ---------- رکوردهای جدید ---------- */}
        {records.length > 0 && (
          <div className="space-y-2" aria-label="رکوردهای جدید">
            {records.map((r) => (
              <div
                key={r.exId}
                className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-sm font-extrabold text-amber-600 dark:text-amber-400"
              >
                <Trophy className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  رکورد جدید: {r.name} — {faNum(r.weight, 1)} کیلو
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ---------- حس جلسه (اختیاری) ---------- */}
        <div className="space-y-2">
          <p className="text-sm font-extrabold">
            حس جلسه چطور بود؟{" "}
            <span className="font-medium text-muted-foreground">(اختیاری)</span>
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {FEELINGS.map((f) => {
              const active = feeling === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFeeling(active ? null : f.value)}
                  aria-pressed={active}
                  className={`h-12 min-h-12 rounded-xl border text-sm font-bold transition-all ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary/40 hover:border-primary/50"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- یادداشت (اختیاری) ---------- */}
        <div className="space-y-2">
          <label htmlFor="session-note" className="text-sm font-extrabold">
            یادداشت{" "}
            <span className="font-medium text-muted-foreground">(اختیاری)</span>
          </label>
          <Textarea
            id="session-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            rows={2}
            placeholder="هر چیزی درباره امروز — مثلاً خواب، انرژی، وزنه‌ها…"
            className="min-h-12 resize-none"
          />
        </div>

        {/* ---------- دکمه‌های پایان ---------- */}
        <div className="space-y-2 border-t border-border/60 pt-4">
          <Button
            className="h-14 w-full text-lg font-black"
            onClick={submitComplete}
            disabled={finishMutation.isPending}
          >
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            {finishMutation.isPending && finishMutation.variables?.status === "completed"
              ? "در حال ثبت…"
              : "ثبت و پایان"}
          </Button>

          {!partialOpen ? (
            <Button
              variant="ghost"
              className="h-12 w-full min-h-12 text-muted-foreground"
              onClick={() => setPartialOpen(true)}
            >
              نیمه‌کاره ذخیره می‌کنم
            </Button>
          ) : (
            <div
              className="space-y-3 rounded-2xl border border-border bg-secondary/30 p-4"
              data-testid="partial-panel"
            >
              <p className="text-sm font-extrabold leading-6">
                دلیلش را اگر دوست داشتی بزن — اختیاری است.
              </p>
              <div className="flex flex-wrap gap-2">
                {REASONS.map((r) => {
                  const active = reason === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setReason(active ? null : r.value)}
                      aria-pressed={active}
                      className={`h-11 min-h-11 rounded-full border px-4 text-sm font-bold transition-all ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
              <Input
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value)}
                maxLength={200}
                placeholder="چیزی اضافه داری؟ (اختیاری)"
                aria-label="توضیح اختیاری برای جلسه نیمه‌کاره"
                className="h-11 min-h-11"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  className="h-12 min-h-12"
                  onClick={() => setPartialOpen(false)}
                >
                  برگردم به تمرین
                </Button>
                <Button
                  variant="secondary"
                  className="h-12 min-h-12 font-black"
                  onClick={submitPartial}
                  disabled={finishMutation.isPending}
                >
                  {finishMutation.isPending && finishMutation.variables?.status === "partial"
                    ? "در حال ثبت…"
                    : "ذخیره نیمه‌کاره"}
                </Button>
              </div>
            </div>
          )}

          <p className="text-center text-xs leading-5 text-muted-foreground">
            ست‌ها همین حالا ذخیره شده‌اند — هیچ‌چیز از دست نمی‌رود.
          </p>
        </div>

        {/* ---------- بازگشت بدون هیچ قید و شرطی ---------- */}
        <Button
          variant="outline"
          className="h-12 w-full min-h-12"
          onClick={onBack}
        >
          برگردم به تمرین
        </Button>
      </CardContent>
    </Card>
  );
}
