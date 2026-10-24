"use client";

// ============================================================
// نمای خانه — فهم در ۳ ثانیه:
// سلام + چیپ امروز → کارت تمرین/استراحت → کشش → هدف هفته →
// نکته روز → جلسه‌های اخیر → میان‌بُر دانش
// قانون طلایی: محتوا مقدس است — هیچ بخش علمی حذف نمی‌شود.
// ============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BookMarked,
  Check,
  CheckCircle2,
  Clock,
  Dumbbell,
  FlaskConical,
  Flame,
  History,
  Lightbulb,
  MoonStar,
  PersonStanding,
  Play,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/app/EmptyState";
import { faNum, faDate, todayISO } from "@/lib/fa";
import { getWeekKey } from "@/lib/week";
import { useAppStore } from "@/lib/store/app";
import {
  PROGRAM,
  PROGRESSION_RULES,
  NUTRITION_NOTES,
  type WorkoutDay,
} from "@/lib/program";
import { STRETCH_ROUTINE, STRETCH_RULES } from "@/lib/mobility";
import { getRestDayPlan } from "@/lib/restDays";
import {
  DAY_SHORT,
  getTodayPlan,
  openProgramTab,
  useActiveSession,
  useStartSession,
  useToday,
} from "@/components/app/home/useTodaySession";

// ---------- انواع پاسخ API ----------
interface ProfileDto {
  name: string | null;
  weekSessionsGoal: number;
}
interface StretchEntryDto {
  id: number;
  date: string;
  itemsDone: number;
  minutes: number | null;
}
interface ProgressDto {
  weekly: { weekKey: string; completedCount: number; volume: number }[];
  lastSessions: { id: number; date: string; dayId: string; status: string }[];
}

// ---------- نکته روز: از سه منبع برنامه (محتوای مقدس) ----------
interface DailyTip {
  tag: string;
  title: string;
  text: string;
}
const DAILY_TIPS: DailyTip[] = [
  ...PROGRESSION_RULES.map((r) => ({
    tag: "اصول پیشرفت",
    title: r.title,
    text: r.text,
  })),
  ...NUTRITION_NOTES.map((n) => ({
    tag: "تغذیه",
    title: n.title,
    text: n.text,
  })),
  ...STRETCH_RULES.map((text, i) => ({
    tag: "کشش",
    title: `قانون کشش ${faNum(i + 1)}`,
    text,
  })),
];

// ---------- میان‌بُر دانش ----------
const KNOW_CARDS: {
  label: string;
  hint: string;
  icon: LucideIcon;
  hash: string;
}[] = [
  { label: "کشش و انعطاف", hint: "روتین ۱۴ حرکته", icon: PersonStanding, hash: "#stretch" },
  { label: "کراتین", hint: "تحقیق و دوز", icon: FlaskConical, hash: "#creatine" },
  { label: "منابع علمی", hint: "ریشه هر اصل", icon: BookMarked, hash: "#sources" },
];

// ---------- وضعیت جلسه‌های اخیر — بدون قرمز و سرزنش ----------
const SESSION_STATUS: Record<string, { label: string; done: boolean }> = {
  completed: { label: "کامل شد", done: true },
  partial: { label: "نیمه‌تمام", done: false },
  abandoned: { label: "ذخیره شد", done: false },
  active: { label: "در جریان", done: false },
};

function ErrorRetry({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 text-xs leading-6"
    >
      <p>{message}</p>
      <Button
        variant="outline"
        size="sm"
        className="mt-2 h-9 min-h-9 px-4 text-xs"
        onClick={onRetry}
      >
        تلاش دوباره
      </Button>
    </div>
  );
}

export default function HomeView() {
  const setView = useAppStore((s) => s.setView);
  const storeActiveSession = useAppStore((s) => s.activeSession);
  const setActiveSession = useAppStore((s) => s.setActiveSession);
  const queryClient = useQueryClient();

  const { jsDay, hour, dayOfMonth, hydrated } = useToday();
  const todayPlan = hydrated ? getTodayPlan(jsDay) : undefined;
  const todayRest = hydrated ? getRestDayPlan(jsDay) : undefined;

  // ---------- کوئری‌ها ----------
  // ⚠️ شکل کش ["profile"] باید همه‌جا یکسان باشد (پاسخ کامل { profile }) —
  // page.tsx و profile-shared همین شکل را می‌سازند؛ اگر این queryFn
  // مستقیم profile برگرداند، با آن‌ها رِیس می‌شود و گیت آنبوردینگ
  // بسته به برندهٔ رِیس، بی‌ثبات می‌شود.
  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<{ profile: ProfileDto }> => {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("profile-failed");
      return (await res.json()) as { profile: ProfileDto };
    },
    staleTime: 60_000,
    retry: 1,
  });

  const activeQuery = useActiveSession();
  const activeFromServer = activeQuery.data ?? null;
  // سرور منبع حقیقت است؛ استور persist شده فقط پشتیبان
  const activeSession = activeFromServer ?? storeActiveSession;
  const activeDay = activeSession
    ? PROGRAM.find((d) => d.id === activeSession.dayId)
    : undefined;

  const start = useStartSession();

  const todayISOStr = todayISO();
  const stretchQuery = useQuery({
    queryKey: ["stretch-log", todayISOStr],
    queryFn: async (): Promise<StretchEntryDto | null> => {
      const res = await fetch(`/api/stretch-log?date=${todayISOStr}`);
      if (!res.ok) throw new Error("stretch-failed");
      const json = (await res.json()) as { entry: StretchEntryDto | null };
      return json.entry;
    },
    staleTime: 60_000,
    retry: 1,
  });

  const logStretch = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/stretch-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayISOStr,
          itemsDone: STRETCH_ROUTINE.length,
          minutes: 10,
        }),
      });
      if (!res.ok) throw new Error("stretch-log-failed");
      return (await res.json()) as { entry: StretchEntryDto };
    },
    onSuccess: () => {
      toast.success("کشش امروز ثبت شد — دستت درد نکنه!", {
        description: `${faNum(STRETCH_ROUTINE.length)} حرکت • ۱۰ دقیقه`,
      });
      queryClient.invalidateQueries({ queryKey: ["stretch-log"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
    onError: () => {
      toast.error("ثبت کشش ممکن نشد — یک بار دیگه امتحان کن.");
    },
  });

  const progressQuery = useQuery({
    queryKey: ["progress"],
    queryFn: async (): Promise<ProgressDto> => {
      const res = await fetch("/api/progress");
      if (!res.ok) throw new Error("progress-failed");
      return (await res.json()) as ProgressDto;
    },
    staleTime: 30_000,
    retry: 1,
  });

  // ---------- مشتق‌ها ----------
  const name = profileData?.profile?.name?.trim();
  const greeting =
    hour < 0
      ? "سلام!"
      : `${hour < 12 ? "صبح بخیر" : hour < 17 ? "ظهر بخیر" : "شب بخیر"}${name ? `، ${name}` : ""}!`;

  const weekly = progressQuery.data?.weekly ?? [];
  const weekGoal = profileData?.profile?.weekSessionsGoal ?? 2;
  const currentWeek = weekly.find((w) => w.weekKey === getWeekKey());
  const weekDone = currentWeek?.completedCount ?? 0;
  const weekRemaining = Math.max(0, weekGoal - weekDone);

  const tip =
    dayOfMonth > 0 && DAILY_TIPS.length > 0
      ? DAILY_TIPS[dayOfMonth % DAILY_TIPS.length]
      : undefined;

  const recentSessions = (progressQuery.data?.lastSessions ?? []).slice(0, 3);
  const stretchEntry = stretchQuery.data ?? null;

  // ادامه جلسه — استور با داده تازه سرور همگام می‌شود (بدون سرزنش)
  const continueSession = () => {
    if (activeFromServer) {
      setActiveSession({
        id: activeFromServer.id,
        dayId: activeFromServer.dayId,
        startedAt: activeFromServer.startedAt,
      });
    }
    setView("workout");
  };

  return (
    <div className="space-y-5">
      {/* ---------- ۱ و ۲: سلام + چیپ امروز ---------- */}
      <section aria-label="سلام و وضعیت امروز" className="pt-2">
        <h2 className="text-2xl font-black leading-snug" suppressHydrationWarning>
          {greeting}
        </h2>
        <p
          className="mt-1 text-sm text-muted-foreground"
          suppressHydrationWarning
        >
          امروز {faDate(todayISOStr)}
        </p>

        <div className="mt-3" aria-live="polite">
          {!hydrated ? (
            <Skeleton className="h-9 w-44 rounded-full" />
          ) : todayPlan ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/12 px-3.5 py-2 text-xs font-bold text-primary">
              <Flame className="h-4 w-4" aria-hidden="true" />
              امروز تمرین {DAY_SHORT[todayPlan.id] ?? todayPlan.weekDay} است
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3.5 py-2 text-xs font-bold text-muted-foreground">
              <MoonStar className="h-4 w-4" aria-hidden="true" />
              امروز استراحت است
            </span>
          )}
        </div>
      </section>

      {/* ---------- ۳ و ۴: کارت تمرین امروز / کارت استراحت ---------- */}
      {!hydrated || activeQuery.isPending ? (
        <Skeleton className="h-44 w-full rounded-2xl" />
      ) : activeSession ? (
        /* جلسه نیمه‌کاره — بدون هیچ سرزنش */
        <section
          aria-label="جلسه نیمه‌کاره"
          className="rounded-2xl border border-primary/40 bg-primary/10 p-5 glow-emerald"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
              <Play className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold">
                جلسه نیمه‌کاره داری — ادامه می‌دی؟
              </h3>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                {activeDay ? activeDay.title : "جلسه تمرین"} — هر وقت آماده بودی
                از همون‌جا ادامه بده؛ بدون فشار.
              </p>
            </div>
          </div>
          <Button
            className="mt-4 h-12 w-full rounded-xl text-sm font-extrabold"
            onClick={continueSession}
            aria-label="ادامه جلسه نیمه‌کاره"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            ادامه جلسه
          </Button>
        </section>
      ) : todayPlan ? (
        /* روز تمرین — کارت شروع تمرین */
        <section
          aria-label="تمرین امروز"
          className="rounded-2xl border border-border bg-card/60 p-5"
        >
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/12 px-2 py-1 text-[11px] font-bold text-primary">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {todayPlan.weekDay}
          </span>
          <h3 className="mt-2.5 text-lg font-black">{todayPlan.title}</h3>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            {todayPlan.subtitle}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              مدت تقریبی {todayPlan.duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Dumbbell className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {faNum(todayPlan.exercises.length)} حرکت
            </span>
          </div>
          <Button
            className="mt-4 h-14 w-full rounded-2xl text-base font-black"
            onClick={() => start.mutate(todayPlan.id)}
            disabled={start.isPending}
            aria-label={`شروع تمرین ${todayPlan.title}`}
          >
            <Play className="h-5 w-5" aria-hidden="true" />
            {start.isPending ? "در حال آماده‌سازی…" : "شروع تمرین"}
          </Button>
          <p className="mt-2.5 text-center text-[11px] leading-5 text-muted-foreground">
            هر تعداد ست که تونستی ثبت کن — نصفه هم حسابه و ارزشمنده.
          </p>
        </section>
      ) : (
        /* روز استراحت — برنامهٔ زندهٔ امروز، متصل به تمرین دیروز */
        <section
          aria-label="روز استراحت"
          className="rounded-2xl border border-border bg-card/60 p-5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
              <MoonStar className="h-6 w-6 text-primary" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold">
                امروز استراحت است — {todayRest?.typeLabel ?? "ریکاوری"}
              </h3>
              <p className="mt-0.5 text-xs leading-6 text-muted-foreground">
                {todayRest?.why ??
                  "عضله در استراحت ساخته می‌شود — امروز بدنت را خوب غذا بده، آب بنوش و بخواب."}
              </p>
            </div>
          </div>

          {todayRest && (
            <div className="mt-3.5 space-y-2">
              <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-secondary/30 p-3">
                <todayRest.icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-xs font-extrabold">
                    {todayRest.activity}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
                    {todayRest.activityHint}
                  </p>
                </div>
              </div>
              {todayRest.prevWorkout && (
                <p className="flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/10 p-3 text-[11px] font-bold leading-5 text-primary">
                  <Dumbbell
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  دیروز {todayRest.prevWorkout} زدی — کشش‌های امروز همان ناحیه
                  را باز می‌کنند
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {todayRest.stretches.slice(0, 3).map((s) => {
                  const move = STRETCH_ROUTINE.find((m) => m.id === s.id);
                  return move ? (
                    <span
                      key={s.id}
                      className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[11px] font-bold"
                    >
                      {move.faName}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Button
              variant="secondary"
              className="h-11 min-h-11 rounded-xl text-xs font-bold"
              onClick={() => openProgramTab(setView, "#stretch")}
              aria-label="رفتن به بخش کشش"
            >
              <PersonStanding className="h-4 w-4" aria-hidden="true" />
              کشش امروز
            </Button>
            <Button
              variant="secondary"
              className="h-11 min-h-11 rounded-xl text-xs font-bold"
              onClick={() => openProgramTab(setView, "#restday")}
              aria-label="برنامهٔ کامل روز استراحت"
            >
              <MoonStar className="h-4 w-4" aria-hidden="true" />
              برنامهٔ کامل روز
            </Button>
          </div>
        </section>
      )}

      {/* ---------- ۵: کارت کشش روزانه ---------- */}
      <section aria-label="کشش روزانه" className="rounded-2xl border border-border bg-card/60 p-4">
        {stretchQuery.isPending ? (
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ) : stretchQuery.isError ? (
          <ErrorRetry
            message="وضعیت کشش امروز لود نشد."
            onRetry={() => stretchQuery.refetch()}
          />
        ) : stretchEntry ? (
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="mt-0.5 h-6 w-6 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-primary">
                کشش امروز انجام شد
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {faNum(stretchEntry.itemsDone)} حرکت
                {stretchEntry.minutes != null
                  ? ` • ${faNum(stretchEntry.minutes)} دقیقه`
                  : ""}
                {" "}— بدنت ممنون توست.
              </p>
              <button
                type="button"
                className="mt-1.5 min-h-11 py-1 text-[11px] font-bold text-muted-foreground underline decoration-border underline-offset-4 transition hover:text-primary focus-visible:outline-2 focus-visible:outline-ring focus-visible:rounded"
                onClick={() => openProgramTab(setView, "#stretch")}
                aria-label="دیدن حرکات کشش"
              >
                دیدن حرکات کشش
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
              <PersonStanding className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold">
                کشش روزانه — {faNum(10)} دقیقه
              </p>
              <p className="mt-0.5 text-xs leading-6 text-muted-foreground">
                {faNum(STRETCH_ROUTINE.length)} حرکت کل بدن؛ بعد تمرین یا هر
                وقت بدنت گرمه.
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <Button
                  size="sm"
                  className="h-11 min-h-11 px-5 text-xs font-bold"
                  onClick={() => logStretch.mutate()}
                  disabled={logStretch.isPending}
                  aria-label="ثبت انجام کشش امروز"
                >
                  {logStretch.isPending ? "در حال ثبت…" : "انجامش دادم"}
                </Button>
                <button
                  type="button"
                  className="min-h-11 py-1 text-[11px] font-bold text-muted-foreground underline decoration-border underline-offset-4 transition hover:text-primary focus-visible:outline-2 focus-visible:outline-ring focus-visible:rounded"
                  onClick={() => openProgramTab(setView, "#stretch")}
                  aria-label="دیدن حرکات کشش"
                >
                  دیدن حرکات کشش
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ---------- ۶: هدف هفته ---------- */}
      <section aria-label="هدف هفته" className="rounded-2xl border border-border bg-card/60 p-4">
        <h3 className="flex items-center gap-2 text-sm font-extrabold">
          <Target className="h-4 w-4 text-primary" aria-hidden="true" />
          هدف این هفته
        </h3>
        {progressQuery.isPending ? (
          <div className="mt-3 space-y-2.5">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>
        ) : progressQuery.isError ? (
          <div className="mt-3">
            <ErrorRetry
              message="آمار این هفته لود نشد."
              onRetry={() => progressQuery.refetch()}
            />
          </div>
        ) : (
          <>
            <p className="mt-2.5 text-sm font-extrabold" suppressHydrationWarning>
              این هفته {faNum(weekDone)} از {faNum(weekGoal)} جلسه کامل شد
            </p>
            <Progress
              value={Math.min(100, (weekDone / Math.max(1, weekGoal)) * 100)}
              className="mt-2.5 h-2.5"
              aria-label={`پیشرفت هدف هفته: ${faNum(weekDone)} از ${faNum(weekGoal)} جلسه`}
            />
            <p
              className="mt-2 text-xs leading-6 text-muted-foreground"
              suppressHydrationWarning
            >
              {weekRemaining > 0
                ? `امروز می‌تونی تمرین کنی یا استراحت — هر دو اوکیه. (${faNum(weekRemaining)} جلسه دیگه تا هدف)`
                : "هدف این هفته کامل شد — افتخار! حالا استراحتت را جدی بگیر."}
            </p>
          </>
        )}
      </section>

      {/* ---------- ۷: نکته کوچک روز ---------- */}
      <section aria-label="نکته امروز" className="rounded-2xl border border-primary/25 bg-primary/10 p-4">
        {!tip ? (
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <>
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-primary">
              <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
              نکته امروز • {tip.tag}
            </p>
            <h3 className="mt-1.5 text-sm font-extrabold">{tip.title}</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              {tip.text}
            </p>
          </>
        )}
      </section>

      {/* ---------- ۸: جلسه‌های اخیر ---------- */}
      <section aria-label="جلسه‌های اخیر">
        <h3 className="mb-2.5 flex items-center gap-2 text-sm font-extrabold">
          <History className="h-4 w-4 text-primary" aria-hidden="true" />
          جلسه‌های اخیر
        </h3>
        {progressQuery.isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : progressQuery.isError ? (
          <ErrorRetry
            message="تاریخچه جلسات لود نشد."
            onRetry={() => progressQuery.refetch()}
          />
        ) : recentSessions.length === 0 ? (
          <EmptyState
            icon={Play}
            title="اولین جلسه‌ات منتظره"
            description="هر وقت آماده بودی از کارت بالای صفحه شروع کن — حتی چند ست کوتاه حسابه و در همین‌جا ثبت می‌شود."
          />
        ) : (
          <ul className="space-y-2">
            {recentSessions.map((s) => {
              const day = PROGRAM.find((d) => d.id === s.dayId);
              const status = SESSION_STATUS[s.status] ?? {
                label: s.status,
                done: false,
              };
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">
                      {day ? day.title : s.dayId}
                    </p>
                    <p
                      className="mt-0.5 text-[11px] text-muted-foreground"
                      suppressHydrationWarning
                    >
                      {faDate(s.date)}
                    </p>
                  </div>
                  {status.done ? (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      {status.label}
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {status.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ---------- ۹: میان‌بُر دانش — همیشه در دسترس ---------- */}
      <section aria-label="میان‌بُر دانش">
        <h3 className="mb-2.5 flex items-center gap-2 text-sm font-extrabold">
          <BookMarked className="h-4 w-4 text-primary" aria-hidden="true" />
          میان‌بُر دانش
        </h3>
        <div className="grid grid-cols-3 gap-2.5">
          {KNOW_CARDS.map((card) => (
            <button
              key={card.hash}
              type="button"
              onClick={() => openProgramTab(setView, card.hash)}
              className="flex min-h-[44px] flex-col items-center gap-2 rounded-2xl border border-border bg-card/60 px-2 py-3.5 text-center transition hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
              aria-label={`${card.label} — ${card.hint}`}
            >
              <card.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="text-[11px] font-bold leading-4">
                {card.label}
              </span>
              <span className="text-[10px] leading-3 text-muted-foreground">
                {card.hint}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
