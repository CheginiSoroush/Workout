"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Dumbbell } from "lucide-react";
import HomeView from "@/components/app/HomeView";
import ProgramView from "@/components/app/ProgramView";
import WorkoutView from "@/components/app/WorkoutView";
import ProgressView from "@/components/app/ProgressView";
import ProfileView from "@/components/app/ProfileView";
import BottomNavigation from "@/components/app/BottomNavigation";
import Onboarding from "@/components/app/Onboarding";
import { useAppStore } from "@/lib/store/app";

interface ProfileResponse {
  profile: {
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
  };
}

async function fetchProfile(): Promise<ProfileResponse> {
  const res = await fetch("/api/profile");
  if (!res.ok) throw new Error("خطا در دریافت پروفایل");
  return res.json();
}

function AppShell() {
  const view = useAppStore((s) => s.view);
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 60_000,
    retry: 1,
  });

  const profile = data?.profile;
  const showOnboarding =
    !!profile && !profile.onboardingDone && view === "home";

  return (
    <div className="flex min-h-screen flex-col">
      {/* ---------- هدر باریک ---------- */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2.5 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
            <Dumbbell className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold leading-tight sm:text-base">
              داشبورد فیتنس من
            </p>
            <p className="truncate text-[11px] leading-tight text-muted-foreground">
              برنامه شناگر • اصول FST-7
            </p>
          </div>
        </div>
      </header>

      {/* ---------- بدنه — نمای فعال ---------- */}
      <main
        className={`mx-auto w-full max-w-3xl flex-1 px-4 ${
          view === "workout" ? "pb-10" : "pb-28"
        }`}
      >
        {isError ? (
          <div
            role="alert"
            className="mt-10 rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-center text-sm"
          >
            ارتباط با سرور برقرار نشد — صفحه را یک بار رفرش کن.
          </div>
        ) : view === "home" ? (
          <HomeView />
        ) : view === "program" ? (
          <ProgramView />
        ) : view === "workout" ? (
          <WorkoutView />
        ) : view === "progress" ? (
          <ProgressView />
        ) : (
          <ProfileView />
        )}

        {/* اسکلت ملایم تا وقتی پروفایل نرسیده (فقط جلوی پرش آنبوردینگ) */}
        {isPending && view === "home" && (
          <div className="sr-only" aria-live="polite">
            در حال بارگذاری
          </div>
        )}
      </main>

      {/* ---------- ناوبری پایین ---------- */}
      <BottomNavigation />

      {/* ---------- آنبوردینگ ---------- */}
      {showOnboarding && (
        <Onboarding
          profile={profile}
          onComplete={() =>
            queryClient.invalidateQueries({ queryKey: ["profile"] })
          }
        />
      )}
    </div>
  );
}

export default function Page() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: 1 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}
