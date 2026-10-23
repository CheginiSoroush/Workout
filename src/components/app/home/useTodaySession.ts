"use client";

// ============================================================
// هوک‌های مشترک «امروز» بین HomeView و ProgramView
// — الگوی useSyncExternalStore از research/backup-page-v1.tsx
//   (SSR = -1 تا hydration mismatch رخ ندهد)
// — مپینگ روز هفته: شنبه(6)=day1، دوشنبه(1)=day2، چهارشنبه(3)=day3
// ============================================================

import { useSyncExternalStore } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppStore, type AppView } from "@/lib/store/app";
import { PROGRAM, type WorkoutDay } from "@/lib/program";

const emptySubscribe = () => () => {};

/** تاریخ/ساعت سمت کلاینت — تا hydrate نشده، -1 برمی‌گردد */
export function useToday() {
  const jsDay = useSyncExternalStore(
    emptySubscribe,
    () => new Date().getDay(),
    () => -1
  );
  const hour = useSyncExternalStore(
    emptySubscribe,
    () => new Date().getHours(),
    () => -1
  );
  const dayOfMonth = useSyncExternalStore(
    emptySubscribe,
    () => new Date().getDate(),
    () => -1
  );
  return { jsDay, hour, dayOfMonth, hydrated: jsDay !== -1 };
}

// شنبه = 6 در JS — همان مپینگ داشبورد قبلی
const JS_DAY_TO_DAY: Record<number, string> = { 6: "day1", 1: "day2", 3: "day3" };

/** برنامه امروز — اگر روز تمرین باشد WorkoutDay، وگرنه undefined */
export function getTodayPlan(jsDay: number): WorkoutDay | undefined {
  const dayId = JS_DAY_TO_DAY[jsDay];
  return dayId ? PROGRAM.find((d) => d.id === dayId) : undefined;
}

/** نام کوتاه و صمیمی روزها برای چیپ خانه */
export const DAY_SHORT: Record<string, string> = {
  day1: "پُش",
  day2: "پول",
  day3: "پا و شکم",
};

export interface SessionDto {
  id: number;
  date: string;
  dayId: string;
  status: string;
  startedAt: string;
  sets: unknown[];
}

/** جلسه فعال از سرور — منبع حقیقت (null یعنی جلسه‌ای در جریان نیست) */
export function useActiveSession() {
  return useQuery({
    queryKey: ["sessions", "active"],
    queryFn: async (): Promise<SessionDto | null> => {
      const res = await fetch("/api/sessions/active");
      if (!res.ok) throw new Error("active-session-failed");
      const json = (await res.json()) as { session: SessionDto | null };
      return json.session;
    },
    staleTime: 15_000,
    retry: 1,
  });
}

/** شروع جلسه: POST /api/sessions → استور → نمای تمرین */
export function useStartSession() {
  const queryClient = useQueryClient();
  const setActiveSession = useAppStore((s) => s.setActiveSession);
  const setView = useAppStore((s) => s.setView);

  return useMutation({
    mutationFn: async (dayId: string) => {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayId }),
      });
      if (!res.ok) throw new Error("session-start-failed");
      return (await res.json()) as { session: SessionDto; created: boolean };
    },
    onSuccess: (data) => {
      setActiveSession({
        id: data.session.id,
        dayId: data.session.dayId,
        startedAt: data.session.startedAt,
      });
      queryClient.invalidateQueries({ queryKey: ["sessions", "active"] });
      setView("workout");
    },
    onError: () => {
      toast.error("شروع جلسه ممکن نشد — یک بار دیگه امتحان کن.");
    },
  });
}

/** رفتن به نمای برنامه با تب هدف از طریق hash (بدون دست زدن به استورِ view) */
export function openProgramTab(setView: (v: AppView) => void, hash: string) {
  if (typeof window !== "undefined" && window.location.hash !== hash) {
    window.location.hash = hash;
  }
  setView("program");
}
