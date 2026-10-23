"use client";

import { useSyncExternalStore } from "react";
import { PROGRAM, PROFILE, totalExercises } from "@/lib/program";
import ScheduleStrip from "@/components/dashboard/ScheduleStrip";
import ProgramTabs from "@/components/dashboard/ProgramTabs";
import WeightTracker from "@/components/dashboard/WeightTracker";
import WorkoutChecklist from "@/components/dashboard/WorkoutChecklist";
import NutritionPanel from "@/components/dashboard/NutritionPanel";
import MedicalNotes from "@/components/dashboard/MedicalNotes";
import CreatineResearch from "@/components/dashboard/CreatineResearch";
import HevyGuide from "@/components/dashboard/HevyGuide";
import SourcesSection from "@/components/dashboard/SourcesSection";
import ProgressionCard from "@/components/dashboard/ProgressionCard";
import MobilitySection from "@/components/dashboard/MobilitySection";
import CardioSection from "@/components/dashboard/CardioSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Dumbbell, Activity, Droplets, ChevronDown } from "lucide-react";

function fa(n: number, digits = 0) {
  return n.toLocaleString("fa-IR", { maximumFractionDigits: digits });
}

// مقدار امن برای SSR (سمت سرور -1، سمت کلاینت روز واقعی)
const emptySubscribe = () => () => {};

export default function Dashboard() {
  const today = useSyncExternalStore(
    emptySubscribe,
    () => new Date().getDay(),
    () => -1
  );

  // محاسبات تغذیه (Mifflin-St Jeor)
  const bmr =
    10 * PROFILE.startWeight + 6.25 * PROFILE.height - 5 * PROFILE.age + 5;
  const tdee = Math.round(bmr * PROFILE.activityFactor);
  const targetKcal = tdee - PROFILE.calorieDeficit;
  const protein = Math.round(PROFILE.targetWeight * PROFILE.proteinPerTargetKg);
  const bmi = PROFILE.startWeight / Math.pow(PROFILE.height / 100, 2);

  // امروز چه تمرینی؟ (شنبه = 6 در JS)
  const todayPlan = PROGRAM.find((d) =>
    [
      { dayId: "day1", jsDay: 6 },
      { dayId: "day2", jsDay: 1 },
      { dayId: "day3", jsDay: 3 },
    ].some((m) => m.dayId === d.id && m.jsDay === today)
  );

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen flex flex-col">
      {/* ---------- هدر ---------- */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base">
                داشبورد فیتنس من
              </div>
              <div className="text-[11px] text-muted-foreground">
                برنامه شناگر • اصول FST-7
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => scrollTo("program")}>
              برنامه
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollTo("weight")}>
              وزن
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollTo("mobility")}>
              کشش
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollTo("health")}>
              سلامت
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollTo("sources")}>
              منابع
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ---------- هیرو ---------- */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/hero.png"
              alt="باشگاه تاریک با نورپردازی سینمایی"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16">
            <Badge className="mb-4 gap-1.5 h-auto py-1.5 px-3">
              <Flame className="w-3.5 h-3.5" />
              نسخه شخصی‌سازی‌شده — ۲۵ ساله • ۱۸۰ سانت • ۹۶ کیلو
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight max-w-2xl">
              مسیر تو به{" "}
              <span className="text-primary">فرم شناگری</span> شروع شد 🏊‍♂️
            </h1>
            <p className="mt-4 text-muted-foreground leading-8 max-w-2xl">
              برنامه ۳ روزه بر پایه اصول هانی رامبد (FST-7) با هدف V-Taper و
              کاهش چربی. هر حرکت با عکس، نکات فرم، نسخه دستگاه و وزنه آزاد،
              خطاهای رایج و لینک ویدیو آموزشی. وزنت رو ثبت کن و با ثبات جلو برو.
            </p>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
              <div className="rounded-2xl bg-card/80 backdrop-blur border border-border p-4">
                <Activity className="w-4 h-4 text-primary mb-2" />
                <div className="text-2xl font-extrabold">{fa(bmi, 1)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  شاخص توده بدنی (BMI)
                </div>
              </div>
              <div className="rounded-2xl bg-card/80 backdrop-blur border border-border p-4">
                <Activity className="w-4 h-4 text-primary mb-2" />
                <div className="text-2xl font-extrabold">{fa(targetKcal)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  کالری هدف روزانه
                </div>
              </div>
              <div className="rounded-2xl bg-card/80 backdrop-blur border border-border p-4">
                <Droplets className="w-4 h-4 text-primary mb-2" />
                <div className="text-2xl font-extrabold">{fa(protein)} گرم</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  پروتئین روزانه
                </div>
              </div>
              <div className="rounded-2xl bg-card/80 backdrop-blur border border-border p-4">
                <Dumbbell className="w-4 h-4 text-primary mb-2" />
                <div className="text-2xl font-extrabold">
                  {fa(totalExercises())} حرکت
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  در ۳ جلسه هفتگی
                </div>
              </div>
            </div>

            {today >= 0 && todayPlan && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary/15 border border-primary/40 px-5 py-3 glow-emerald">
                <Flame className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold">
                  امروز {todayPlan.weekDay}ه — وقت {todayPlan.title} است! بزن بریم 💪
                </span>
              </div>
            )}

            <div className="mt-8">
              <Button
                onClick={() => scrollTo("program")}
                className="gap-2 h-11 px-6"
              >
                برو به برنامه تمرینی
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* ---------- بدنه ---------- */}
        <div className="max-w-6xl mx-auto px-4 space-y-10 pb-16">
          <ScheduleStrip />

          <section id="program" className="scroll-mt-20">
            <ProgramTabs />
          </section>

          <section id="weight" className="scroll-mt-20 grid lg:grid-cols-2 gap-6 items-start">
            <WeightTracker />
            <WorkoutChecklist />
          </section>

          <ProgressionCard />
          <NutritionPanel />

          <section id="mobility" className="scroll-mt-20 grid lg:grid-cols-2 gap-6 items-start">
            <MobilitySection />
            <CardioSection />
          </section>

          <section id="health" className="scroll-mt-20">
            <MedicalNotes />
          </section>

          <section id="creatine" className="scroll-mt-20">
            <CreatineResearch />
          </section>

          <section id="hevy" className="scroll-mt-20">
            <HevyGuide />
          </section>

          <section id="sources" className="scroll-mt-20">
            <SourcesSection />
          </section>
        </div>
      </main>

      {/* ---------- فوتر چسبان ---------- */}
      <footer className="mt-auto border-t border-border/60 bg-card/60">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-primary" />
            داشبورد فیتنس — ساخته‌شده برای مسیر فرم شناگری تو
          </div>
          <div className="text-center sm:text-left leading-5">
            این برنامه توصیه عمومی است و جایگزین نظر پزشک نیست • ثبات = نتیجه
          </div>
        </div>
      </footer>
    </div>
  );
}
