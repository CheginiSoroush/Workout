"use client";

// ============================================================
// نمای پیشرفت — پیشرفت فقط وزن بدن نیست!
// جمع‌بندی آمار ← استمراری هفتگی ← روند حجم ← رکوردهای شخصی ←
// جلسات اخیر ← چک‌لیست هفتگی ← وزن بدن (اختیاری و خصوصی)
// همه چارت‌ها خلاصه متنی دارند؛ داده خام با toggle در دسترس است.
// ============================================================

import { useQuery } from "@tanstack/react-query";
import { BarChart3, Target, Trophy, History, LineChart as LineChartIcon, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import WorkoutChecklist from "@/components/dashboard/WorkoutChecklist";
import WeightTracker from "@/components/dashboard/WeightTracker";
import StatCards from "@/components/app/progress/StatCards";
import ConsistencyChart from "@/components/app/progress/ConsistencyChart";
import VolumeChart from "@/components/app/progress/VolumeChart";
import PrsCards from "@/components/app/progress/PrsCards";
import LastSessionsList from "@/components/app/progress/LastSessionsList";
import type { ProgressDto } from "@/components/app/progress/types";
import type { Units } from "@/lib/units";

// ---------- کوئری‌ها — همان شکل کش ["profile"] با page.tsx ----------
async function fetchProgress(): Promise<ProgressDto> {
  const res = await fetch("/api/progress");
  if (!res.ok) throw new Error("progress-failed");
  return (await res.json()) as ProgressDto;
}

async function fetchProfileRaw(): Promise<{ profile: { units: string; weekSessionsGoal: number } }> {
  const res = await fetch("/api/profile");
  if (!res.ok) throw new Error("profile-failed");
  return (await res.json()) as {
    profile: { units: string; weekSessionsGoal: number };
  };
}

// ---------- قاب هر بخش — سرتیتر + متن توضیحی (دسترس‌پذیری) ----------
function ProgressSection({
  id,
  icon: Icon,
  title,
  description,
  children,
}: {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`progress-${id}`}
      className="rounded-2xl border border-border/70 bg-card/50 p-4 sm:p-5"
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/12">
          <Icon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 id={`progress-${id}`} className="text-sm font-extrabold">
            {title}
          </h3>
          <p className="mt-0.5 text-xs leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

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

export default function ProgressView() {
  const progressQ = useQuery({
    queryKey: ["progress"],
    queryFn: fetchProgress,
    staleTime: 30_000,
    retry: 1,
  });

  const profileQ = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfileRaw,
    staleTime: 60_000,
    retry: 1,
  });

  // شکل کش ["profile"] بسته به اینکه کدام queryFn اول اجرا شود می‌تواند
  // «پاسخ کامل { profile }» یا «پروفایل مستقیم» باشد — هر دو را پوشش بده
  const profileRaw = profileQ.data as
    | { profile: { units: string; weekSessionsGoal: number } }
    | { units: string; weekSessionsGoal: number }
    | undefined;
  const profileInfo =
    profileRaw && "profile" in profileRaw ? profileRaw.profile : profileRaw;
  const units: Units = profileInfo?.units === "imperial" ? "imperial" : "metric";
  const goal = profileInfo?.weekSessionsGoal ?? 2;

  const p = progressQ.data;

  return (
    <div className="space-y-5">
      {/* ---------- ۱: سرتیتر ---------- */}
      <section aria-label="معرفی پیشرفت" className="pt-2">
        <h2 className="text-2xl font-black leading-snug">پیشرفت</h2>
        <p className="mt-1 text-sm leading-7 text-muted-foreground">
          پیشرفت فقط وزن بدن نیست — استمراری، وزنه‌ها و حجم تمرین. همه‌چیز از
          جلسه‌های خودت ساخته می‌شه و فقط با خودت مقایسه می‌شه.
        </p>
      </section>

      {/* ---------- لودینگ / خطا / محتوا ---------- */}
      {progressQ.isPending ? (
        <div className="space-y-5" aria-hidden="true">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      ) : progressQ.isError || !p ? (
        <ErrorRetry
          message="آمار پیشرفت بارگیری نشد — اتصالت رو چک کن و دوباره تلاش کن."
          onRetry={() => progressQ.refetch()}
        />
      ) : (
        <>
          {/* ---------- ۲: جمع‌بندی ---------- */}
          <ProgressSection
            id="summary"
            icon={Target}
            title="جمع‌بندی"
            description="چهار عدد که کار واقعی‌ات را نشان می‌دهند — بدون اغراق."
          >
            <StatCards
              totalSessions={p.totals.totalSessions}
              totalSets={p.totals.totalSets}
              totalVolume={p.totals.totalVolume}
              stretchDays={p.stretchDays}
              units={units}
            />
          </ProgressSection>

          {/* ---------- ۳: استمراری هفتگی ---------- */}
          <ProgressSection
            id="consistency"
            icon={BarChart3}
            title="استمراری هفتگی"
            description="جلسه‌های کامل‌شده در ۸ هفته اخیر — خط چین زمردی، هدف هفته‌ات است (از پروفایل قابل تغییره)."
          >
            <ConsistencyChart weekly={p.weekly} goal={goal} units={units} />
          </ProgressSection>

          {/* ---------- ۴: روند حجم تمرین ---------- */}
          <ProgressSection
            id="volume"
            icon={LineChartIcon}
            title="روند حجم تمرین"
            description="حجم یعنی مجموع وزنه × تکرار هر هفته — شاخص کار واقعی عضله."
          >
            <VolumeChart weekly={p.weekly} units={units} />
          </ProgressSection>

          {/* ---------- ۵: رکوردهای شخصی ---------- */}
          <ProgressSection
            id="prs"
            icon={Trophy}
            title="رکوردهای شخصی"
            description="سنگین‌ترین ست ثبت‌شده‌ات برای هر حرکت — رکورد تو، با خودت."
          >
            <PrsCards prs={p.prs} units={units} />
          </ProgressSection>

          {/* ---------- ۶: جلسات اخیر ---------- */}
          <ProgressSection
            id="sessions"
            icon={History}
            title="جلسات اخیر"
            description="نیمه‌تمام هم حساب است — هیچ‌جا سرزنشی وجود ندارد."
          >
            <LastSessionsList sessions={p.lastSessions} />
          </ProgressSection>

          {/* ---------- ۷: چک‌لیست هفتگی (کامپوننت موجود) ---------- */}
          <WorkoutChecklist />

          {/* ---------- ۸: وزن بدن — اختیاری و خصوصی ---------- */}
          <section aria-labelledby="progress-weight">
            <h3
              id="progress-weight"
              className="mb-1.5 px-1 text-sm font-extrabold"
            >
              وزن بدن — اختیاری، خصوصی
            </h3>
            <p className="mb-3 px-1 text-xs leading-6 text-muted-foreground">
              این بخش جدا از آمار تمرینه؛ فقط وقتی وزن‌کشی کنی که خودت بخوای.
            </p>
            <WeightTracker />
          </section>
        </>
      )}
    </div>
  );
}
