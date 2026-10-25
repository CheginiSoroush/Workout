"use client";

// ============================================================
// نمای برنامه — قلب محتوا: ۵ تب، همه سکشن‌های علمی قبلی
// بدون هیچ تغییری همین‌جا render می‌شوند (محتوا مقدس است).
// hash routing محلی: #stretch / #bike / #creatine / #hevy / #sources
// ============================================================

import { useEffect, useState } from "react";
import {
  Bike,
  BookOpen,
  CalendarDays,
  MoonStar,
  PersonStanding,
  Play,
  Salad,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ScheduleStrip from "@/components/dashboard/ScheduleStrip";
import RestDaySection from "@/components/dashboard/RestDaySection";
import ProgramTabs from "@/components/dashboard/ProgramTabs";
import ProgressionCard from "@/components/dashboard/ProgressionCard";
import MobilitySection from "@/components/dashboard/MobilitySection";
import CardioSection from "@/components/dashboard/CardioSection";
import NutritionPanel from "@/components/dashboard/NutritionPanel";
import ProgramScience from "@/components/dashboard/ProgramScience";
import GlossarySection from "@/components/dashboard/GlossarySection";
import CreatineResearch from "@/components/dashboard/CreatineResearch";
import HevyGuide from "@/components/dashboard/HevyGuide";
import LiftosaurGuide from "@/components/dashboard/LiftosaurGuide";
import AppExports from "@/components/dashboard/AppExports";
import SourcesSection from "@/components/dashboard/SourcesSection";
import { useAppStore } from "@/lib/store/app";
import { PROGRAM } from "@/lib/program";
import {
  getTodayPlan,
  useActiveSession,
  useStartSession,
  useToday,
} from "@/components/app/home/useTodaySession";

// ---------- hash → تب ----------
const HASH_TO_TAB: Record<string, string> = {
  "#stretch": "stretch",
  "#bike": "bike",
  "#restday": "weekly",
  "#creatine": "knowledge",
  "#glossary": "knowledge",
  "#hevy": "knowledge",
  "#science": "knowledge",
  "#sources": "knowledge",
};

const TABS = [
  { value: "weekly", label: "برنامه هفتگی", short: "برنامه", icon: CalendarDays },
  { value: "stretch", label: "کشش", short: "کشش", icon: PersonStanding },
  { value: "bike", label: "دوچرخه", short: "دوچرخه", icon: Bike },
  { value: "health", label: "تغذیه و سلامت", short: "تغذیه", icon: Salad },
  { value: "knowledge", label: "دانش و منابع", short: "دانش", icon: BookOpen },
];

export default function ProgramView() {
  const [tab, setTab] = useState<string>("weekly");

  const setView = useAppStore((s) => s.setView);
  const setActiveSession = useAppStore((s) => s.setActiveSession);
  const storeActiveSession = useAppStore((s) => s.activeSession);

  const { jsDay, hydrated } = useToday();
  const todayPlan = hydrated ? getTodayPlan(jsDay) : undefined;

  const activeQuery = useActiveSession();
  const activeSession = activeQuery.data ?? storeActiveSession;
  const start = useStartSession();

  // ---------- hash routing محلی ----------
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.toLowerCase();
      const mapped = HASH_TO_TAB[hash];
      if (mapped) {
        setTab(mapped);
        // اگر لنگر داخلی (مثل #creatine) موجود بود، بعد از رندر تب به آن اسکرول کن
        window.setTimeout(() => {
          const anchor = document.getElementById(hash.slice(1));
          if (anchor) {
            anchor.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 120);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // سوییچ دستی تب → هش پاک می‌شود (بدون رویداد hashchange)
  const handleTabChange = (value: string) => {
    setTab(value);
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  };

  // ---------- دکمه شروع/ادامه تمرین ----------
  const continueSession = () => {
    if (activeQuery.data) {
      setActiveSession({
        id: activeQuery.data.id,
        dayId: activeQuery.data.dayId,
        startedAt: activeQuery.data.startedAt,
      });
    }
    setView("workout");
  };

  return (
    <div className="space-y-4">
      <section aria-label="معرفی برنامه" className="pt-2">
        <h2 className="text-2xl font-black leading-snug">برنامه</h2>
        <p className="mt-1 text-sm leading-7 text-muted-foreground">
          همه‌چیز یک‌جا: تمرین FST-7، کشش، دوچرخه، تغذیه و کتابخانه دانش.
        </p>
      </section>

      <Tabs value={tab} onValueChange={handleTabChange} className="gap-0">
        <TabsList className="h-12 w-full rounded-2xl p-1.5" aria-label="بخش‌های برنامه">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="min-h-11 rounded-xl px-1.5 text-[11px] font-bold sm:px-2 sm:text-xs"
              aria-label={t.label}
            >
              <t.icon className="h-4 w-4" aria-hidden="true" />
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ---------- تب ۱: برنامه هفتگی ---------- */}
        <TabsContent value="weekly" className="mt-5 space-y-6" aria-label="برنامه هفتگی">
          {/* شروع تمرین امروز — فقط روز تمرین */}
          {!hydrated || activeQuery.isPending ? (
            <Skeleton className="h-20 w-full rounded-2xl" />
          ) : todayPlan ? (
            <section
              aria-label="شروع تمرین امروز"
              className="rounded-2xl border border-primary/40 bg-primary/10 p-4 glow-emerald"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold">
                    {activeSession
                      ? "جلسه در جریان داری — ادامه می‌دی؟"
                      : `امروز ${todayPlan.weekDay} است — وقت تمرینه!`}
                  </p>
                  <p className="mt-0.5 text-xs leading-6 text-muted-foreground">
                    {activeSession
                      ? (PROGRAM.find((d) => d.id === activeSession.dayId)?.title ??
                        "جلسه تمرین")
                      : `${todayPlan.title} • ${todayPlan.duration}`}
                  </p>
                </div>
                {activeSession ? (
                  <Button
                    className="h-12 w-full shrink-0 rounded-xl text-sm font-extrabold sm:w-auto sm:px-6"
                    onClick={continueSession}
                    aria-label="ادامه جلسه در جریان"
                  >
                    <Play className="h-4 w-4" aria-hidden="true" />
                    ادامه جلسه
                  </Button>
                ) : (
                  <Button
                    className="h-12 w-full shrink-0 rounded-xl text-sm font-extrabold sm:w-auto sm:px-6"
                    onClick={() => start.mutate(todayPlan.id)}
                    disabled={start.isPending}
                    aria-label={`شروع تمرین ${todayPlan.title}`}
                  >
                    <Play className="h-4 w-4" aria-hidden="true" />
                    {start.isPending ? "در حال آماده‌سازی…" : "شروع تمرین امروز"}
                  </Button>
                )}
              </div>
            </section>
          ) : (
            <section
              aria-label="یادآوری روز استراحت"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
                <MoonStar className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-6 text-muted-foreground">
                  امروز استراحت است — عضله در استراحت ساخته می‌شود. برنامهٔ
                  کامل این روز (فعالیت + کشش‌های مرتبط با تمرین دیروز) منتظرته.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2 h-9 min-h-9 rounded-lg px-3 text-[11px] font-bold"
                  onClick={() => {
                    window.location.hash = "#restday";
                  }}
                  aria-label="دیدن برنامهٔ کامل روز استراحت"
                >
                  <MoonStar className="h-3.5 w-3.5" aria-hidden="true" />
                  برنامهٔ کامل روز استراحت
                </Button>
              </div>
            </section>
          )}

          {/* محتوای اصلی داشبورد — دست‌نخورده */}
          <ScheduleStrip />
          <div id="restday">
            <RestDaySection />
          </div>
          <ProgramTabs />
          <ProgressionCard />
        </TabsContent>

        {/* ---------- تب ۲: کشش ---------- */}
        <TabsContent value="stretch" className="mt-5" aria-label="کشش و انعطاف">
          <MobilitySection />
        </TabsContent>

        {/* ---------- تب ۳: دوچرخه ---------- */}
        <TabsContent value="bike" className="mt-5" aria-label="دوچرخه ثابت">
          <CardioSection />
        </TabsContent>

        {/* ---------- تب ۴: تغذیه و سلامت ---------- */}
        <TabsContent value="health" className="mt-5 space-y-6" aria-label="تغذیه و سلامت">
          <NutritionPanel />
        </TabsContent>

        {/* ---------- تب ۵: دانش و منابع ---------- */}
        <TabsContent value="knowledge" className="mt-5 space-y-6" aria-label="دانش و منابع">
          <section
            aria-label="سرتیتر کتابخانه دانش"
            className="rounded-2xl border border-border bg-card/60 p-4"
          >
            <h3 className="text-base font-black">
              کتابخانه دانش — همه‌چیز با منبع علمی
            </h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              هر ادعایی که اینجا می‌بینی به یک منبع یا پژوهش وصله — خودت می‌توانی
              چکش کنی.
            </p>
          </section>
          <div id="glossary">
            <GlossarySection />
          </div>
          <div id="science">
            <ProgramScience />
          </div>
          <div id="creatine">
            <CreatineResearch />
          </div>
          <div id="hevy">
            <HevyGuide />
          </div>
          <div id="liftosaur">
            <LiftosaurGuide />
          </div>
          <div id="app-exports">
            <AppExports />
          </div>
          <div id="sources">
            <SourcesSection />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
