"use client";

// ============================================================
// بخش ۵ پروفایل — یادآوری‌ها با صداقت کامل:
// الان هیچ اعلان سیستمی وجود ندارد؛ این کلیدها فقط روی همین
// دستگاه ذخیره می‌شوند تا زیرساخت آینده آماده باشد.
// (انحراف ثبت‌شده: schema فیلد یادآوری ندارد و PUT سخت‌گیرانه است —
// پس ذخیره در localStorage است، نه جدول profile)
// ============================================================

import { useSyncExternalStore } from "react";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import { createLocalFlagStore } from "./profile-shared";

const REM_WORKOUT_KEY = "rem-workout-day";
const REM_WEEKLY_KEY = "rem-weekly-summary";

const workoutStore = createLocalFlagStore(REM_WORKOUT_KEY);
const weeklyStore = createLocalFlagStore(REM_WEEKLY_KEY);

function ReminderRow({
  id,
  title,
  description,
  checked,
  onChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    // کل ردیف با label قابل لمس است (هدف لمسی ≥44px)
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-secondary/30 p-4">
      <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
        <span className="block text-sm font-bold">{title}</span>
        <span className="mt-0.5 block text-xs leading-6 text-muted-foreground">
          {description}
        </span>
      </label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        aria-label={title}
        className="shrink-0"
      />
    </div>
  );
}

export default function RemindersSection() {
  const workout = useSyncExternalStore(
    workoutStore.subscribe,
    () => workoutStore.get(),
    () => false
  );
  const weekly = useSyncExternalStore(
    weeklyStore.subscribe,
    () => weeklyStore.get(),
    () => false
  );

  return (
    <div className="space-y-3">
      <ReminderRow
        id="rem-workout-switch"
        title="یادآوری روز تمرین"
        description="برای آینده: یادآوری ملایم صبح روزهای شنبه، دوشنبه و چهارشنبه."
        checked={workout}
        onChange={(v) => workoutStore.set(v)}
      />
      <ReminderRow
        id="rem-weekly-switch"
        title="خلاصه هفتگی"
        description="برای آینده: جمع‌بندی جلسات و حجم هفته، بدون مقایسه با هیچ‌کس."
        checked={weekly}
        onChange={(v) => weeklyStore.set(v)}
      />
      <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-muted/40 p-3.5 text-xs leading-6 text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <p>
          صداقت کامل: الان هیچ اعلان سیستمی وجود ندارد — همه‌چیز داخل خود اپ
          است. این دو کلید فقط روی همین دستگاه ذخیره می‌شوند تا وقتی یادآوری
          واقعی اضافه شد، همین‌جا آماده باشد؛ خاموش‌کردن‌شان هم همیشه یک تپ
          است.
        </p>
      </div>
    </div>
  );
}
