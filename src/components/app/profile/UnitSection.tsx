"use client";

// ============================================================
// بخش ۳ پروفایل — واحد نمایش کیلوگرم/پوند
// فقط روی نمایش‌های نمای پیشرفت (کارت‌های آمار، چارت‌ها، PRs)
// اعمال می‌شود؛ WeightTracker عمداً کیلوگرم می‌ماند و ورودی
// وزن/قد هم همیشه متریک ذخیره می‌شود.
// ============================================================

import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { extractProfile, useProfile, usePutProfile } from "./profile-shared";
import type { Units } from "@/lib/units";

const UNIT_OPTIONS: {
  value: Units;
  label: string;
  hint: string;
}[] = [
  { value: "metric", label: "کیلوگرم (kg)", hint: "پیش‌فرض" },
  { value: "imperial", label: "پوند (lb)", hint: "۲٫۲۰ پوند = ۱ کیلوگرم" },
];

export default function UnitSection() {
  const { toast } = useToast();
  const profileQ = useProfile();
  const put = usePutProfile();

  const profile = extractProfile(profileQ.data);
  const units: Units = profile?.units === "imperial" ? "imperial" : "metric";

  const choose = (u: Units) => {
    if (u === units || put.isPending) return;
    put.mutate(
      { units: u },
      {
        onSuccess: () => {
          toast({
            title: "واحد نمایش عوض شد ✅",
            description:
              u === "imperial"
                ? "آمار پیشرفت و رکوردها حالا پوند نشان می‌دهند."
                : "آمار پیشرفت و رکوردها حالا کیلوگرم نشان می‌دهند.",
          });
        },
      }
    );
  };

  if (!profile) {
    return <Skeleton className="h-16 w-full rounded-xl" aria-hidden="true" />;
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="واحد نمایش وزن">
        {UNIT_OPTIONS.map((opt) => {
          const selected = units === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selected}
              onClick={() => choose(opt.value)}
              className={`min-h-11 rounded-xl border px-3 py-2.5 text-center text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                selected
                  ? "border-primary/60 bg-primary/12 font-bold text-primary"
                  : "border-border bg-secondary/40 text-foreground hover:border-primary/40"
              }`}
            >
              {opt.label}
              <span className="mt-0.5 block text-[10px] font-normal text-muted-foreground">
                {opt.hint}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] leading-5 text-muted-foreground">
        این سوییچ فقط روی نمایشِ پیشرفت و رکوردها اثر می‌گذارد. بخش «وزن بدن»
        همیشه کیلوگرم است (خودش جدا و خصوصیه) و ورودی وزن/قد هم همیشه متریک
        ذخیره می‌شود.
      </p>
    </div>
  );
}
