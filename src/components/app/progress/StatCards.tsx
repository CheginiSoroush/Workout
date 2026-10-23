"use client";

// ============================================================
// ۴ کارت آمار جمع‌بندی — جلسات، ست‌ها، حجم کل، کشش‌ها
// حجم کل بر اساس واحد نمایش (kg/lb) — ذخیره همیشه متریک است
// ============================================================

import { CalendarCheck2, Layers, Weight, PersonStanding, type LucideIcon } from "lucide-react";
import { faNum } from "@/lib/fa";
import { formatWeight, type Units } from "@/lib/units";

interface StatCardsProps {
  totalSessions: number;
  totalSets: number;
  totalVolume: number; // کیلوگرم (خام از API)
  stretchDays: number;
  units: Units;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/12">
        <Icon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
      </span>
      <p className="mt-3 text-xl font-black leading-none">{value}</p>
      <p className="mt-1.5 text-xs font-bold text-foreground/90">{label}</p>
      {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function StatCards({
  totalSessions,
  totalSets,
  totalVolume,
  stretchDays,
  units,
}: StatCardsProps) {
  return (
    <div
      role="group"
      aria-label="جمع‌بندی آمار تمرین"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      <StatCard
        icon={CalendarCheck2}
        label="جلسات کامل‌شده"
        value={faNum(totalSessions)}
        sub="از اولین روزت تا الان"
      />
      <StatCard
        icon={Layers}
        label="ست‌های ثبت‌شده"
        value={faNum(totalSets)}
        sub="هر ست یک قدم ساختن"
      />
      <StatCard
        icon={Weight}
        label="حجم کل تمرین"
        value={formatWeight(totalVolume, units, 0)}
        sub="مجموع وزنه × تکرار"
      />
      <StatCard
        icon={PersonStanding}
        label="کشش‌های ثبت‌شده"
        value={faNum(stretchDays)}
        sub="روزهایی که برای بدنت وقت گذاشتی"
      />
    </div>
  );
}
