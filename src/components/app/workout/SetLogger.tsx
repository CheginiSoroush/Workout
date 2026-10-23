"use client";

// ============================================================
// SetLogger — ثبت ست‌به‌ست برای حرکت جاری
// فلسفه ضد فشار: «رد کردن» همیشه مجاز؛ ورود سریع با دکمه‌های ±
// ============================================================

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronDown,
  History,
  Minus,
  PencilLine,
  Plus,
  SkipForward,
  Trash2,
} from "lucide-react";
import type { Exercise } from "@/lib/program";
import { faNum } from "@/lib/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  faClockTime,
  parseNumericInput,
  type PrevExerciseInfo,
  type SetEntryDTO,
} from "./types";

interface SetLoggerProps {
  sessionId: number;
  exercise: Exercise;
  /** ترتیب حرکت داخل روز — از ۱ */
  exerciseOrder: number;
  /** ست‌های ثبت‌شده این حرکت در جلسه فعلی */
  currentSets: SetEntryDTO[];
  /** اطلاعات جلسه قبل (اگر باشد) */
  prev: PrevExerciseInfo | null;
  /** این حرکت آخرین حرکت روز است؟ */
  isLastExercise: boolean;
  /** بعد از ثبت موفق — برای نمایش دوباره دکمه تایمر استراحت */
  onAfterLog: () => void;
  onGoNext: () => void;
  onGoSummary: () => void;
  /** بازخورد برای aria-live پلیر */
  announce: (text: string) => void;
}

export default function SetLogger({
  sessionId,
  exercise,
  exerciseOrder,
  currentSets,
  prev,
  isLastExercise,
  onAfterLog,
  onGoNext,
  onGoSummary,
  announce,
}: SetLoggerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [weightOverride, setWeightOverride] = useState<{
    key: string;
    value: string;
  } | null>(null);
  const [repsOverride, setRepsOverride] = useState<{
    key: string;
    value: string;
  } | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const planned = exercise.sets;
  const loggedCount = currentSets.length;
  const allPlannedDone = loggedCount >= planned;

  // مقدار مؤثر = تایپ کاربر برای همین حرکت، یا پیش‌فرض جلسه قبل
  // (بدون effect — با عوض شدن حرکت، کلید عوض می‌شود و پیش‌فرض برمی‌گردد)
  const defaultWeightText =
    prev?.lastSet?.weight != null ? faNum(prev.lastSet.weight, 1) : "";
  const defaultRepsText =
    prev?.lastSet?.reps != null ? faNum(prev.lastSet.reps) : "";
  const weightText =
    weightOverride?.key === exercise.id ? weightOverride.value : defaultWeightText;
  const repsText =
    repsOverride?.key === exercise.id ? repsOverride.value : defaultRepsText;
  const setWeightText = (v: string) =>
    setWeightOverride({ key: exercise.id, value: v });
  const setRepsText = (v: string) => setRepsOverride({ key: exercise.id, value: v });

  const bumpWeight = (delta: number) => {
    // functional update — تپ‌های سریع پشت‌سرهم درست جمع می‌شوند
    setWeightOverride((o) => {
      const text = o && o.key === exercise.id ? o.value : defaultWeightText;
      const cur = parseNumericInput(text) ?? prev?.lastSet?.weight ?? 0;
      const next = Math.max(0, Math.min(500, cur + delta));
      return { key: exercise.id, value: faNum(next, 1) };
    });
  };

  const bumpReps = (delta: number) => {
    setRepsOverride((o) => {
      const text = o && o.key === exercise.id ? o.value : defaultRepsText;
      const cur = parseNumericInput(text) ?? prev?.lastSet?.reps ?? 0;
      const next = Math.max(0, Math.min(200, Math.round(cur + delta)));
      return { key: exercise.id, value: faNum(next) };
    });
  };

  // ---------- ثبت ست ----------
  const logMutation = useMutation({
    mutationFn: async (payload: {
      weight: number | null;
      reps: number | null;
      skipped: boolean;
    }) => {
      const res = await fetch(`/api/sessions/${sessionId}/sets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: exercise.id,
          exerciseOrder,
          weight: payload.weight,
          reps: payload.reps,
          skipped: payload.skipped,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? "خطا در ثبت ست");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      onAfterLog();
      const doneAfter = loggedCount + 1 >= planned;
      if (variables.skipped) {
        // پیام خنثی — بدون سرزنش
        toast({ title: "ثبت شد" });
        announce(`ست رد شد و ثبت شد — ست ${faNum(loggedCount + 1)} از ${faNum(planned)}`);
        if (doneAfter && !isLastExercise) {
          toast({
            title: "این حرکت بسته شد",
            description: "هر وقت آماده بودی برو حرکت بعد.",
          });
        }
      } else {
        const w = variables.weight;
        const r = variables.reps;
        toast({
          title: "ست ثبت شد",
          description: `${w != null ? `${faNum(w, 1)} کیلو × ` : ""}${r != null ? `${faNum(r)} تکرار` : ""}`,
        });
        announce(
          `ست ثبت شد — ${w != null ? `${faNum(w, 1)} کیلو، ` : ""}${r != null ? `${faNum(r)} تکرار` : ""}`
        );
        if (prev?.bestWeight != null && w != null && w > prev.bestWeight) {
          toast({
            title: "وزنه نسبت به جلسه قبل رفت بالا",
            description: "پیشرفت خوبی است.",
          });
        }
        if (doneAfter) {
          toast({
            title: isLastExercise ? "حرکت آخر هم تمام شد" : "این حرکت تمام شد",
            description: isLastExercise
              ? "می‌تونی خلاصه جلسه رو ثبت کنی."
              : "برو حرکت بعد.",
          });
        }
      }
    },
    onError: (error: Error) => {
      toast({ title: "ثبت نشد", description: error.message });
    },
  });

  // ---------- حذف ست (ویرایش) ----------
  const deleteMutation = useMutation({
    mutationFn: async (setId: number) => {
      const res = await fetch(`/api/sets/${setId}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? "خطا در حذف ست");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      toast({ title: "ست حذف شد" });
      announce("ست حذف شد");
    },
    onError: (error: Error) => {
      toast({ title: "حذف نشد", description: error.message });
    },
  });

  const handleLog = () => {
    const w = parseNumericInput(weightText);
    const r = parseNumericInput(repsText);
    const hasWeight = w != null && w > 0;
    const hasReps = r != null && r > 0;
    if (!hasWeight && !hasReps) {
      toast({
        title: "وزنه یا تکرار را وارد کن",
        description: "یا اگر ست اجرا نشد، «رد کردن ست» را بزن — بدون مشکل.",
      });
      return;
    }
    logMutation.mutate({
      weight: w,
      reps: r == null ? null : Math.round(r),
      skipped: false,
    });
  };

  const handleSkip = () => {
    logMutation.mutate({ weight: null, reps: null, skipped: true });
  };

  const stepperBtn =
    "h-12 min-h-12 w-12 shrink-0 rounded-xl border border-border bg-secondary/50 text-lg font-black hover:border-primary/50 hover:bg-secondary";
  const inputCls =
    "h-12 min-h-12 rounded-xl border-border bg-background text-center text-xl font-black";

  return (
    <Card data-testid="set-logger">
      <CardContent className="space-y-4 p-4 sm:p-5">
        {/* ---------- مرجع جلسه قبل ---------- */}
        {prev?.lastSet ? (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm">
            <History className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="leading-6">
              جلسه قبل ({prev.dateLabel}):{" "}
              <b>
                {prev.lastSet.weight != null && `${faNum(prev.lastSet.weight, 1)} کیلو × `}
                {prev.lastSet.reps != null && `${faNum(prev.lastSet.reps)} تکرار`}
                {prev.lastSet.weight == null && prev.lastSet.reps == null && "—"}
              </b>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm">
            <History className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="leading-6">
              اولین باره — <b>وزنه سبک شروع کن</b> و فرم را تمیز نگه دار.
            </span>
          </div>
        )}

        {/* ---------- ردیف ورودی ست ---------- */}
        <div className="grid grid-cols-[1fr_1fr] gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor={`weight-${exercise.id}`}
              className="text-xs font-bold text-muted-foreground"
            >
              وزنه (کیلوگرم)
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => bumpWeight(-2.5)}
                className={stepperBtn}
                aria-label="۲.۵ کیلو کمتر"
              >
                <Minus className="mx-auto h-4 w-4" aria-hidden="true" />
              </button>
              <Input
                id={`weight-${exercise.id}`}
                inputMode="decimal"
                className={inputCls}
                value={weightText}
                onChange={(e) => setWeightText(e.target.value)}
                placeholder="—"
                aria-label="وزنه به کیلوگرم"
              />
              <button
                type="button"
                onClick={() => bumpWeight(2.5)}
                className={stepperBtn}
                aria-label="۲.۵ کیلو بیشتر"
              >
                <Plus className="mx-auto h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={`reps-${exercise.id}`}
              className="text-xs font-bold text-muted-foreground"
            >
              تکرار
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => bumpReps(-1)}
                className={stepperBtn}
                aria-label="یک تکرار کمتر"
              >
                <Minus className="mx-auto h-4 w-4" aria-hidden="true" />
              </button>
              <Input
                id={`reps-${exercise.id}`}
                inputMode="numeric"
                className={inputCls}
                value={repsText}
                onChange={(e) => setRepsText(e.target.value)}
                placeholder="—"
                aria-label="تعداد تکرار"
              />
              <button
                type="button"
                onClick={() => bumpReps(1)}
                className={stepperBtn}
                aria-label="یک تکرار بیشتر"
              >
                <Plus className="mx-auto h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* ---------- دکمه اصلی: ثبت ست ---------- */}
        <Button
          className="h-14 w-full text-lg font-black"
          onClick={handleLog}
          disabled={logMutation.isPending}
          aria-label="ثبت ست"
        >
          {logMutation.isPending ? "در حال ثبت…" : "ثبت ست"}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-11 min-h-11 flex-1 text-muted-foreground"
            onClick={handleSkip}
            disabled={logMutation.isPending}
          >
            <SkipForward className="h-4 w-4" aria-hidden="true" />
            رد کردن این ست
          </Button>
          <Button
            variant="outline"
            className="h-11 min-h-11 flex-1"
            onClick={() => setEditOpen((v) => !v)}
            aria-expanded={editOpen}
          >
            <PencilLine className="h-4 w-4" aria-hidden="true" />
            ویرایش ست‌ها
            <ChevronDown
              className={`h-4 w-4 transition-transform ${editOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </Button>
        </div>
        <p className="text-center text-xs leading-5 text-muted-foreground">
          اگر ست اجرا نشد، ردش کن — بدون توضیح، بدون مشکل.
        </p>

        {/* ---------- وضعیت ست‌های این حرکت ---------- */}
        <p className="text-center text-sm font-bold">
          {allPlannedDone
            ? `همه ${faNum(planned)} ست برنامه این حرکت ثبت شد${loggedCount > planned ? ` (+${faNum(loggedCount - planned)} ست اضافه)` : ""}`
            : `ست بعدی: ${faNum(loggedCount + 1)} از ${faNum(planned)}`}
        </p>

        {/* ---------- پیشنهاد حرکت بعد ---------- */}
        {allPlannedDone && !isLastExercise && (
          <div
            data-testid="next-exercise-suggestion"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-3.5"
          >
            <p className="text-sm font-extrabold leading-6">
              برنامه این حرکت کامل شد — حرکت بعدی آماده است.
            </p>
            <Button className="h-12 min-h-12 px-5 font-black" onClick={onGoNext}>
              حرکت بعد
            </Button>
          </div>
        )}
        {allPlannedDone && isLastExercise && (
          <div
            data-testid="next-exercise-suggestion"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-3.5"
          >
            <p className="text-sm font-extrabold leading-6">
              همه حرکت‌های امروز ثبت شد — خلاصه جلسه را ببند.
            </p>
            <Button className="h-12 min-h-12 px-5 font-black" onClick={onGoSummary}>
              پایان تمرین
            </Button>
          </div>
        )}

        {/* ---------- ویرایش ست‌ها ---------- */}
        {editOpen && (
          <div className="space-y-2 rounded-2xl border border-border bg-secondary/30 p-3">
            <p className="text-xs font-bold text-muted-foreground">
              ست‌های ثبت‌شده این حرکت — حذف فقط همین ست را تغییر می‌دهد.
            </p>
            {currentSets.length === 0 ? (
              <p className="py-2 text-center text-sm text-muted-foreground">
                هنوز ستی برای این حرکت ثبت نشده.
              </p>
            ) : (
              <ul className="max-h-56 space-y-2 overflow-y-auto pl-1">
                {currentSets.map((s, i) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2"
                  >
                    <span className="flex min-w-0 items-center gap-2 text-sm">
                      {s.skipped ? (
                        <Badge
                          variant="outline"
                          className="shrink-0 border-dashed text-muted-foreground"
                        >
                          رد شده
                        </Badge>
                      ) : (
                        <CheckCircle2
                          className="h-4 w-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                      )}
                      <b className="shrink-0">ست {faNum(i + 1)}</b>
                      <span className="truncate text-muted-foreground">
                        {s.skipped
                          ? "—"
                          : s.weight != null || s.reps != null
                            ? `${s.weight != null ? `${faNum(s.weight, 1)} کیلو` : "وزن بدن"}${s.reps != null ? ` × ${faNum(s.reps)}` : ""}`
                            : "—"}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      <span className="text-xs text-muted-foreground" dir="ltr">
                        {faClockTime(s.createdAt)}
                      </span>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-destructive"
                            aria-label={`حذف ست ${faNum(i + 1)}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ست {faNum(i + 1)} حذف شود؟
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              فقط همین ست از جلسه حذف می‌شود — تاثیر دیگری ندارد.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>بی‌خیال</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(s.id)}
                              className="bg-destructive text-white hover:bg-destructive/90"
                            >
                              حذف کن
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
