"use client";

// ============================================================
// بخش ۴ پروفایل — هدف هفته (۱ تا ۶ جلسه)
// همین عدد خط مرجع زمردیِ چارت استمراری در نمای پیشرفت است.
// ذخیره خودکار با هر تغییر — مقدار نمایشی از پروفایل یا override
// ============================================================

import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { faNum } from "@/lib/fa";
import { extractProfile, useProfile, usePutProfile } from "./profile-shared";

const MIN = 1;
const MAX = 6;

export default function GoalStepper() {
  const profileQ = useProfile();
  const put = usePutProfile();

  // override = انتخاب کاربر؛ تا وقتی پروفایل تازه بیاید همین نشان داده می‌شود
  const [override, setOverride] = useState<number | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const profile = extractProfile(profileQ.data);
  const goal = override ?? profile?.weekSessionsGoal ?? null;

  useEffect(() => {
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  const change = (delta: number) => {
    if (goal === null || put.isPending) return;
    const next = Math.min(MAX, Math.max(MIN, goal + delta));
    if (next === goal) return;
    setOverride(next);
    put.mutate(
      { weekSessionsGoal: next },
      {
        onSuccess: () => {
          setSavedFlash(true);
          if (flashTimer.current) clearTimeout(flashTimer.current);
          flashTimer.current = setTimeout(() => setSavedFlash(false), 2500);
        },
      }
    );
  };

  if (goal === null) {
    return <Skeleton className="h-16 w-full rounded-xl" aria-hidden="true" />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-4 rounded-xl border border-border/60 bg-secondary/30 p-4">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 shrink-0 rounded-xl"
          onClick={() => change(-1)}
          disabled={goal <= MIN}
          aria-label="کاهش هدف هفته"
        >
          <Minus className="h-5 w-5" aria-hidden="true" />
        </Button>
        <div
          className="min-w-24 text-center"
          role="status"
          aria-label={`هدف هفته: ${faNum(goal)} جلسه`}
        >
          <p className="text-3xl font-black leading-none text-primary">
            {faNum(goal)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            جلسه در هفته
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 shrink-0 rounded-xl"
          onClick={() => change(1)}
          disabled={goal >= MAX}
          aria-label="افزایش هدف هفته"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
      <p
        className="text-center text-[11px] leading-5 text-muted-foreground"
        aria-live="polite"
      >
        {savedFlash
          ? "ذخیره شد ✓"
          : "عددی واقع‌بین انتخاب کن که بتونی کامل‌ش کنی — همین عدد خط زمردی نمودار استمراریه."}
      </p>
    </div>
  );
}
