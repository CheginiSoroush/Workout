"use client";

// ============================================================
// WorkoutView — پلیر تمرین تمام‌صفحه (فاز ۳)
// جلسه فعال از استور؛ داده از API؛ هر ثبت ست فوراً در DB ذخیره می‌شود
// فلسفه ضد فشار: رد کردن مجاز، خروج = ذخیره، تایمر اختیاری، بدون سرزنش
// ============================================================

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Cog,
  Dumbbell,
  Check,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Flag,
  Flame,
  Home,
  Lightbulb,
  LogOut,
  Target,
  XCircle,
} from "lucide-react";
import type { Exercise, ExerciseMode, ExerciseVariant } from "@/lib/program";
import { PROGRAM } from "@/lib/program";
import { faNum } from "@/lib/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EmptyState from "@/components/app/EmptyState";
import SetLogger from "@/components/app/workout/SetLogger";
import RestTimer from "@/components/app/workout/RestTimer";
import SessionSummary from "@/components/app/workout/SessionSummary";
import {
  parseRestSec,
  faShortDate,
  type PrevExerciseInfo,
  type SessionWithSets,
} from "@/components/app/workout/types";
import { useAppStore } from "@/lib/store/app";
import { useToast } from "@/hooks/use-toast";

async function fetchSession(id: number): Promise<SessionWithSets> {
  const res = await fetch(`/api/sessions/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("not_found");
    throw new Error("خطا در دریافت جلسه");
  }
  const j = await res.json();
  return j.session as SessionWithSets;
}

async function fetchCompletedSessions(
  dayId: string
): Promise<SessionWithSets[]> {
  const res = await fetch(
    `/api/sessions?dayId=${dayId}&status=completed&limit=30`
  );
  if (!res.ok) throw new Error("خطا در دریافت جلسات قبلی");
  const j = await res.json();
  return j.sessions as SessionWithSets[];
}

/** کارت حرکت جاری — سوییچ نسخه فقط نمایشی است و ثبت ست را عوض نمی‌کند */
function CurrentExerciseCard({ exercise }: { exercise: Exercise }) {
  const baseMode: ExerciseMode = exercise.baseMode ?? "machine";
  const startMode: ExerciseMode = exercise.startMode ?? baseMode;
  const [mode, setMode] = useState<ExerciseMode>(startMode);

  const machineVersion: ExerciseVariant | null =
    baseMode === "machine"
      ? { faName: exercise.faName, hevyName: exercise.hevyName, note: "" }
      : exercise.machineAlt ?? null;
  const freeVersion: ExerciseVariant | null =
    baseMode === "free"
      ? { faName: exercise.faName, hevyName: exercise.hevyName, note: "" }
      : exercise.freeAlt ?? null;

  const hasToggle = !!(exercise.machineAlt || exercise.freeAlt);
  const current = mode === "machine" ? machineVersion : freeVersion;
  const displayName = current?.faName ?? exercise.faName;

  const [showAllTips, setShowAllTips] = useState(false);
  const [showAllMistakes, setShowAllMistakes] = useState(false);

  const optionClass = (active: boolean) =>
    `inline-flex h-11 min-h-11 items-center gap-1.5 px-3.5 text-xs font-bold transition-all ${
      active
        ? "rounded-lg bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <Card className="overflow-hidden" data-testid="current-exercise-card">
      <CardContent className="space-y-4 p-4 sm:p-5">
        {/* عنوان و نشان‌ها */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black leading-snug">{displayName}</h2>
            <Badge
              variant="secondary"
              className="gap-1 border border-border"
              aria-label={mode === "machine" ? "نسخه دستگاه" : "نسخه وزنه آزاد"}
            >
              {mode === "machine" ? (
                <>
                  <Cog className="h-3.5 w-3.5" aria-hidden="true" /> دستگاه / کابل
                </>
              ) : (
                <>
                  <Dumbbell className="h-3.5 w-3.5" aria-hidden="true" /> وزنه آزاد
                </>
              )}
            </Badge>
            {exercise.fst7 && (
              <Badge className="gap-1 bg-amber-500 text-amber-950 hover:bg-amber-500">
                <Flame className="h-3.5 w-3.5" aria-hidden="true" /> FST-7
              </Badge>
            )}
          </div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Target className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            {exercise.muscles}
          </p>
        </div>

        {/* مشخصات ست */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-lg bg-secondary/60 px-2.5 py-1.5 font-bold">
            {faNum(exercise.sets)} ست
          </span>
          <span className="rounded-lg bg-secondary/60 px-2.5 py-1.5 font-bold">
            تکرار: {exercise.reps}
          </span>
          <span className="rounded-lg bg-secondary/60 px-2.5 py-1.5 font-bold">
            استراحت: {exercise.rest}
          </span>
          <span className="rounded-lg bg-secondary/60 px-2.5 py-1.5 font-bold">
            RPE: {exercise.rpe}
          </span>
        </div>

        {/* عکس حرکت */}
        <img
          src={exercise.image}
          alt={`نحوه اجرای ${displayName}`}
          className="h-44 w-full rounded-xl object-cover sm:h-52"
          loading="lazy"
        />

        {/* سوییچ نسخه — فقط نمایشی (توضیح نسخه جایگزین) */}
        {hasToggle && (
          <div className="space-y-2">
            <div className="inline-flex rounded-xl border border-border bg-secondary/40 p-0.5">
              {machineVersion && (
                <button
                  type="button"
                  onClick={() => setMode("machine")}
                  aria-pressed={mode === "machine"}
                  className={optionClass(mode === "machine")}
                >
                  <Cog className="h-3.5 w-3.5" aria-hidden="true" />
                  دستگاه / کابل
                </button>
              )}
              {freeVersion && (
                <button
                  type="button"
                  onClick={() => setMode("free")}
                  aria-pressed={mode === "free"}
                  className={optionClass(mode === "free")}
                >
                  <Dumbbell className="h-3.5 w-3.5" aria-hidden="true" />
                  وزنه آزاد
                </button>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              نسخه شروع پیشنهادی تو:{" "}
              <b className="text-foreground">
                {startMode === "machine" ? "دستگاه" : "وزنه آزاد"}
              </b>
            </p>
            {mode !== baseMode && current?.note && (
              <div className="flex items-start gap-2 rounded-lg border border-primary/25 bg-primary/10 px-3 py-2.5">
                <Lightbulb
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <p className="text-sm leading-6">{current.note}</p>
              </div>
            )}
          </div>
        )}

        {/* نکات فرم و خطاهای رایج — نمایش کوتاه با امکان کامل‌شدن */}
        <Accordion type="single" collapsible className="rounded-xl border border-border bg-secondary/30 px-3">
          <AccordionItem value="form-notes" className="border-b-0">
            <AccordionTrigger className="py-3.5 text-sm font-extrabold hover:no-underline">
              نکات فرم و خطاهای رایج
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="space-y-1.5">
                {(showAllTips ? exercise.tips : exercise.tips.slice(0, 3)).map(
                  (tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="leading-6">{tip}</span>
                    </div>
                  )
                )}
                {exercise.tips.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllTips((v) => !v)}
                    className="text-xs font-bold text-primary underline-offset-4 hover:underline"
                  >
                    {showAllTips
                      ? "نمایش کمتر"
                      : `نمایش ${faNum(exercise.tips.length - 3)} نکته دیگر`}
                  </button>
                )}
              </div>
              <div className="space-y-1.5 border-t border-border/60 pt-3">
                {(showAllMistakes
                  ? exercise.mistakes
                  : exercise.mistakes.slice(0, 2)
                ).map((m, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <XCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
                      aria-hidden="true"
                    />
                    <span className="leading-6 text-muted-foreground">{m}</span>
                  </div>
                ))}
                {exercise.mistakes.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setShowAllMistakes((v) => !v)}
                    className="text-xs font-bold text-primary underline-offset-4 hover:underline"
                  >
                    {showAllMistakes
                      ? "نمایش کمتر"
                      : `نمایش ${faNum(exercise.mistakes.length - 2)} خطای دیگر`}
                  </button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default function WorkoutView() {
  const activeSession = useAppStore((s) => s.activeSession);
  const setView = useAppStore((s) => s.setView);
  const clearActiveSession = useAppStore((s) => s.clearActiveSession);
  const { toast } = useToast();

  // null = انتخاب خودکار (اولین حرکت ناتمام)؛ با هر ناوبری عدد صریح می‌شود
  const [explicitIndex, setExplicitIndex] = useState<number | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  // تایمر استراحت برای کدام حرکت بسته شده؟ (با تعویض حرکت خودش false می‌شود)
  const [restDismissedFor, setRestDismissedFor] = useState<string | null>(null);
  const [live, setLive] = useState({ text: "", n: 0 });

  const announce = (text: string) => setLive((l) => ({ text, n: l.n + 1 }));

  const day = PROGRAM.find((d) => d.id === activeSession?.dayId);
  const sessionId = activeSession?.id ?? null;

  // ---------- داده جلسه فعلی ----------
  const sessionQuery = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSession(sessionId as number),
    enabled: sessionId != null,
    retry: 1,
  });

  // ---------- جلسات completed قبلی (مرجع جلسه قبل و رکورد) ----------
  const completedQuery = useQuery({
    queryKey: ["completed-sessions", activeSession?.dayId],
    queryFn: () => fetchCompletedSessions(activeSession!.dayId),
    enabled: !!activeSession?.dayId,
    staleTime: 30_000,
  });

  const session = sessionQuery.data;
  const sets = session?.sets ?? [];

  // اگر جلسه در DB نیست یا دیگر active نیست — نمای خالی با دکمه برگشت
  // (پاک‌سازی استور فقط با کنش کاربر — بدون side effect در رندر)
  const notFound =
    sessionQuery.isError && (sessionQuery.error as Error).message === "not_found";
  const sessionStale = !!session && session.status !== "active";

  // ---------- شاخص حرکت: انتخاب صریح کاربر یا اولین حرکت ناتمام ----------
  const autoIndex = day
    ? Math.max(
        0,
        day.exercises.findIndex(
          (e) => sets.filter((s) => s.exerciseId === e.id).length < e.sets
        )
      )
    : 0;
  const exIndex = explicitIndex ?? autoIndex;

  // ---------- مشتق‌ها ----------
  const exercise =
    day?.exercises[Math.min(exIndex, (day?.exercises.length ?? 1) - 1)];
  const currentSets = exercise
    ? sets.filter((s) => s.exerciseId === exercise.id)
    : [];
  const totalPlanned = day?.exercises.reduce((acc, e) => acc + e.sets, 0) ?? 0;
  const loggedCount = sets.filter((s) => !s.skipped).length;
  const loggedPct =
    totalPlanned > 0
      ? Math.min(100, Math.round((loggedCount / totalPlanned) * 100))
      : 0;
  const restDismissed = exercise ? restDismissedFor === exercise.id : false;

  // جلسه قبل برای حرکت جاری: آخرین جلسه completed که برای این حرکت ست دارد
  let prevInfo: PrevExerciseInfo | null = null;
  if (completedQuery.data && exercise) {
    for (const ps of completedQuery.data) {
      const exSets = ps.sets.filter(
        (s) =>
          s.exerciseId === exercise.id &&
          !s.skipped &&
          (s.weight != null || s.reps != null)
      );
      if (exSets.length === 0) continue;
      const last = exSets[exSets.length - 1];
      const weights = exSets
        .map((s) => s.weight)
        .filter((w): w is number => w != null);
      prevInfo = {
        dateLabel: faShortDate(ps.date),
        lastSet: { weight: last.weight, reps: last.reps },
        bestWeight: weights.length > 0 ? Math.max(...weights) : null,
      };
      break;
    }
  }

  // ---------- کنش‌ها ----------
  const handleExit = () => {
    toast({
      title: "ذخیره شد",
      description: "هر وقت خواستی ادامه بده — جلسه فعال می‌ماند.",
    });
    setView("home");
  };

  const handleDone = () => {
    clearActiveSession();
    setView("home");
  };

  const handleLeaveStale = () => {
    clearActiveSession();
    setView("home");
  };

  // ---------- حالت‌های ورودی ----------

  // (قبل از hydration استور هم همین خوانده می‌شود)
  if (!activeSession || !day) {
    return (
      <div className="space-y-6 pt-2">
        <EmptyState
          icon={Home}
          title="جلسه فعالی نداری"
          description="از خانه یک جلسه جدید شروع کن — هر وقت آماده بودی."
        >
          <Button
            className="h-12 min-h-12 px-6 font-bold"
            onClick={() => setView("home")}
            aria-label="بازگشت به خانه"
          >
            بازگشت به خانه
          </Button>
        </EmptyState>
      </div>
    );
  }

  if (sessionQuery.isPending) {
    return (
      <div className="space-y-4 pt-2" aria-busy="true">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
        <div className="sr-only" role="status" aria-live="polite">
          در حال دریافت جلسه
        </div>
      </div>
    );
  }

  if (!session || !exercise || sessionStale) {
    return (
      <div className="space-y-6 pt-2">
        <EmptyState
          icon={Home}
          title="جلسه فعالی نداری"
          description={
            sessionStale
              ? "این جلسه قبلاً بسته شده — ست‌هایش ذخیره شده‌اند. هر وقت خواستی از خانه جلسه جدید شروع کن."
              : notFound
                ? "جلسه‌ای با این مشخصات پیدا نشد — احتمالاً قبلاً ثبت و بسته شده."
                : "از خانه یک جلسه جدید شروع کن — هر وقت آماده بودی."
          }
        >
          <Button
            className="h-12 min-h-12 px-6 font-bold"
            onClick={handleLeaveStale}
            aria-label="بازگشت به خانه"
          >
            بازگشت به خانه
          </Button>
        </EmptyState>
      </div>
    );
  }

  const exercisesCount = day.exercises.length;
  const isLastExercise = exIndex === exercisesCount - 1;
  const restSec = parseRestSec(exercise.rest);

  return (
    <div className="space-y-5">
      {/* ---------- بازخورد برای صفحه‌خوان ---------- */}
      <div role="status" aria-live="polite" className="sr-only">
        {live.text}
      </div>

      {/* ---------- هدر چسبان ---------- */}
      <header className="sticky top-14 z-30 -mx-4 border-b border-border/60 bg-background/90 px-4 py-2.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-black sm:text-base">
              {summaryOpen ? "جمع‌بندی جلسه" : day.title}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {summaryOpen
                ? day.title
                : `حرکت ${faNum(exIndex + 1)} از ${faNum(exercisesCount)}`}
            </p>
          </div>
          {summaryOpen ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-11 min-h-11 shrink-0 px-4"
              onClick={() => setSummaryOpen(false)}
            >
              بازگشت به تمرین
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-11 min-h-11 shrink-0 px-4 text-muted-foreground"
              onClick={handleExit}
              aria-label="خروج — جلسه ذخیره می‌ماند"
              data-testid="exit-session"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              خروج
            </Button>
          )}
        </div>
      </header>

      {summaryOpen ? (
        /* ---------- خلاصه جلسه ---------- */
        <SessionSummary
          session={session}
          day={day}
          prevSessions={completedQuery.data ?? []}
          onDone={handleDone}
          onBack={() => setSummaryOpen(false)}
        />
      ) : (
        <>
          {/* ---------- نوار پیشرفت جلسه ---------- */}
          <section aria-label="پیشرفت جلسه" className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold">پیشرفت جلسه</span>
              <span className="text-muted-foreground">
                {faNum(loggedCount)} از {faNum(totalPlanned)} ست ثبت شد
              </span>
            </div>
            <Progress value={loggedPct} aria-label="پیشرفت ثبت ست‌های جلسه" />
          </section>

          {/* ---------- کارت حرکت جاری ---------- */}
          <CurrentExerciseCard key={exercise.id} exercise={exercise} />

          {/* ---------- ثبت ست ---------- */}
          <SetLogger
            sessionId={session.id}
            exercise={exercise}
            exerciseOrder={exIndex + 1}
            currentSets={currentSets}
            prev={prevInfo}
            isLastExercise={isLastExercise}
            onAfterLog={() => setRestDismissedFor(null)}
            onGoNext={() =>
              setExplicitIndex(Math.min(exercisesCount - 1, exIndex + 1))
            }
            onGoSummary={() => setSummaryOpen(true)}
            announce={announce}
          />

          {/* ---------- تایمر استراحت (اختیاری) ---------- */}
          {currentSets.length > 0 && !restDismissed && (
            <RestTimer
              key={`rest-${exercise.id}`}
              seconds={restSec}
              onClose={() => setRestDismissedFor(exercise.id)}
              announce={announce}
            />
          )}

          {/* ---------- ناوبری حرکات ---------- */}
          <nav aria-label="ناوبری حرکات" className="space-y-3 pt-1">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                className="h-12 min-h-12 flex-1 font-bold"
                onClick={() => setExplicitIndex(Math.max(0, exIndex - 1))}
                disabled={exIndex === 0}
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                حرکت قبلی
              </Button>
              <Button
                variant="outline"
                className="h-12 min-h-12 flex-1 font-bold"
                onClick={() =>
                  setExplicitIndex(Math.min(exercisesCount - 1, exIndex + 1))
                }
                disabled={isLastExercise}
              >
                حرکت بعد
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {day.exercises.map((e, i) => {
                const hasLogged = sets.some(
                  (s) => s.exerciseId === e.id && !s.skipped
                );
                const isCurrent = i === exIndex;
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setExplicitIndex(i)}
                    aria-label={`حرکت ${faNum(i + 1)}: ${e.faName}`}
                    aria-current={isCurrent ? "true" : undefined}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-black transition-all ${
                      isCurrent
                        ? "border-primary bg-primary text-primary-foreground"
                        : hasLogged
                          ? "border-primary/60 bg-primary/15 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {hasLogged && !isCurrent ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      faNum(i + 1)
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* ---------- پایان جلسه ---------- */}
          <div className="pt-1">
            <Button
              variant="secondary"
              className="h-14 w-full text-lg font-black"
              onClick={() => setSummaryOpen(true)}
              data-testid="open-summary"
            >
              <Flag className="h-5 w-5" aria-hidden="true" />
              پایان تمرین
            </Button>
            <p className="mt-2 text-center text-xs leading-5 text-muted-foreground">
              ست‌ها همین الان ذخیره شده‌اند — هر زمان بخوای می‌تونی تمامش کنی.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
