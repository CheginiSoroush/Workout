"use client";

// ============================================================
// اشیاء مشترک نمای پروفایل: تایپ پروفایل کامل، کوئری/موتیشن PUT،
// قاب بخش (SectionCard) و ErrorRetry
//
// نکته مهم شکل کش ["profile"]: page.tsx همین کلید را با queryFn
// «پاسخ کامل { profile }» پر می‌کند. برای ناسازگار نشدن کش،
// اینجا هم پاسخ کامل ذخیره و با extractProfile خوانده می‌شود.
// ============================================================

import { useSyncExternalStore } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { LucideIcon } from "lucide-react";

// ---------- استورهای کوچک localStorage-محور (بدون setState در effect) ----------

/** فلگ بولی روی localStorage — برای Switchها */
export function createLocalFlagStore(key: string) {
  const listeners = new Set<() => void>();
  return {
    subscribe: (cb: () => void) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    get: (): boolean => {
      try {
        return localStorage.getItem(key) === "1";
      } catch {
        return false;
      }
    },
    set: (v: boolean) => {
      try {
        localStorage.setItem(key, v ? "1" : "0");
      } catch {
        /* بی‌صدا */
      }
      listeners.forEach((l) => l());
    },
  };
}

/** انتخاب رشته‌ای روی localStorage — مثل حالت تم */
export function createLocalChoiceStore<T extends string>(key: string, fallback: T) {
  const listeners = new Set<() => void>();
  return {
    subscribe: (cb: () => void) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    get: (): T => {
      try {
        const v = localStorage.getItem(key);
        return (v as T) ?? fallback;
      } catch {
        return fallback;
      }
    },
    set: (v: T) => {
      try {
        localStorage.setItem(key, v);
      } catch {
        /* بی‌صدا */
      }
      listeners.forEach((l) => l());
    },
  };
}

/** تشخیص mount — بدون setState؛ false تا hydrate کامل شود */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export interface ProfileFull {
  id: number;
  name: string | null;
  goal: string;
  experience: string;
  daysPerWeek: number;
  equipment: string;
  limitations: string | null;
  weightKg: number | null;
  heightCm: number | null;
  units: string;
  reducedMotion: boolean;
  onboardingDone: boolean;
  weekSessionsGoal: number;
}

/** شکل کش ["profile"] — پاسخ کامل API (همسان با page.tsx) */
export type ProfileCache = { profile: ProfileFull };

async function fetchProfileRaw(): Promise<ProfileCache> {
  const res = await fetch("/api/profile");
  if (!res.ok) throw new Error("profile-failed");
  return (await res.json()) as ProfileCache;
}

/** خواندن امن پروفایل از شکل کش (پاسخ کامل) */
export function extractProfile(data: unknown): ProfileFull | undefined {
  if (!data || typeof data !== "object") return undefined;
  if ("profile" in (data as Record<string, unknown>)) {
    return (data as ProfileCache).profile;
  }
  return data as ProfileFull;
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfileRaw,
    staleTime: 60_000,
    retry: 1,
  });
}

/** PUT پروفایل — خطا با توست اطلاع می‌شود؛ توست موفقیت با خود بخش است */
export function usePutProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (body: Partial<ProfileFull>) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("profile-put-failed");
      return (await res.json()) as { profile: ProfileFull };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast({
        title: "ذخیره نشد",
        description: "ارتباط برقرار نشد — یک بار دیگر تلاش کن.",
        variant: "destructive",
      });
    },
  });
}

/** قاب یکسان بخش‌های پروفایل — کارت با آیکون، سرتیتر و توضیح */
export function SectionCard({
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
      aria-labelledby={`profile-${id}`}
      className="rounded-2xl border border-border/70 bg-card/50 p-4 sm:p-5"
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/12">
          <Icon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 id={`profile-${id}`} className="text-sm font-extrabold">
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

export function ErrorRetry({
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
