"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, ChevronRight, HelpCircle, Info } from "lucide-react";
import { PROGRAM, PROFILE } from "@/lib/program";
import { faNum } from "@/lib/fa";

interface ProfileData {
  goal: string;
  experience: string;
  daysPerWeek: number;
  equipment: string;
  limitations: string | null;
  weightKg: number | null;
  heightCm: number | null;
}

interface OnboardingProps {
  profile: ProfileData;
  onComplete: () => void;
}

const GOALS = [
  { value: "muscle", label: "عضله‌سازی", emoji: "💪" },
  { value: "fatloss", label: "کاهش وزن", emoji: "🔥" },
  { value: "strength", label: "قدرت", emoji: "🏋️" },
  { value: "general", label: "تناسب عمومی", emoji: "🌿" },
];

const EXPERIENCES = [
  { value: "beginner", label: "مبتدی" },
  { value: "intermediate", label: "متوسط" },
  { value: "advanced", label: "پیشرفته" },
];

const EQUIPMENTS = [
  { value: "gym", label: "باشگاه" },
  { value: "home", label: "خانه" },
];

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-11 rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
        selected
          ? "border-primary/60 bg-primary/12 font-bold text-primary"
          : "border-border bg-secondary/40 text-foreground hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}

/** آنبوردینگ دو مرحله‌ای — همه سؤال‌ها قابل رد کردن */
export default function Onboarding({ profile, onComplete }: OnboardingProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [saving, setSaving] = useState(false);

  const [goal, setGoal] = useState(profile.goal);
  const [experience, setExperience] = useState(profile.experience);
  const [daysPerWeek, setDaysPerWeek] = useState(profile.daysPerWeek);
  const [equipment, setEquipment] = useState(profile.equipment);
  const [limitations, setLimitations] = useState(profile.limitations ?? "");

  const [weight, setWeight] = useState(
    profile.weightKg != null ? String(profile.weightKg) : String(PROFILE.startWeight)
  );
  const [height, setHeight] = useState(
    profile.heightCm != null ? String(profile.heightCm) : String(PROFILE.height)
  );

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const body = {
        goal,
        experience,
        daysPerWeek,
        equipment,
        limitations: limitations.trim() ? limitations.trim() : null,
        weightKg: weight.trim() === "" ? null : Number(weight),
        heightCm: height.trim() === "" ? null : Number(height),
        onboardingDone: true,
      };
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast({
        title: "خوش اومدی! 🎉",
        description: "پروفایل ذخیره شد — مسیر تو شروع شد.",
      });
      onComplete();
    } catch {
      toast({
        title: "ذخیره نشد",
        description: "ارتباط برقرار نشد — یک بار دیگر تلاش کن.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-background/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="تنظیمات اولیه"
    >
      <div className="mx-auto my-6 w-[calc(100%-2rem)] max-w-lg rounded-3xl border border-border bg-card p-6 shadow-xl sm:my-10">
        {/* سربرگ و نشانگر مرحله */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-black">
            {step === 1 ? "با هم تنظیمش کنیم" : "تقریباً آماده‌ای!"}
          </h2>
          <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-muted-foreground">
            مرحله {faNum(step)} از {faNum(2)}
          </span>
        </div>
        <div
          className="mb-6 h-1.5 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={2}
          aria-valuenow={step}
          aria-label="پیشرفت آنبوردینگ"
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            {/* هدف */}
            <fieldset>
              <legend className="mb-2 text-sm font-bold">هدفت چیه؟</legend>
              <div className="grid grid-cols-2 gap-2">
                {GOALS.map((g) => (
                  <OptionButton
                    key={g.value}
                    selected={goal === g.value}
                    onClick={() => setGoal(g.value)}
                  >
                    <span aria-hidden="true">{g.emoji}</span> {g.label}
                  </OptionButton>
                ))}
              </div>
            </fieldset>

            {/* سطح تجربه */}
            <fieldset>
              <legend className="mb-2 text-sm font-bold">
                سطح تجربه‌ات چیه؟
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {EXPERIENCES.map((e) => (
                  <OptionButton
                    key={e.value}
                    selected={experience === e.value}
                    onClick={() => setExperience(e.value)}
                  >
                    {e.label}
                  </OptionButton>
                ))}
              </div>
            </fieldset>

            {/* روزهای قابل اختصاص */}
            <fieldset>
              <legend className="mb-2 text-sm font-bold">
                در هفته چند روز می‌تونی تمرین کنی؟
              </legend>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={daysPerWeek === d}
                    aria-label={`${faNum(d)} روز در هفته`}
                    onClick={() => setDaysPerWeek(d)}
                    className={`h-11 w-11 rounded-xl border text-sm font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                      daysPerWeek === d
                        ? "border-primary/60 bg-primary/12 text-primary"
                        : "border-border bg-secondary/40 hover:border-primary/40"
                    }`}
                  >
                    {faNum(d)}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* تجهیزات */}
            <fieldset>
              <legend className="mb-2 text-sm font-bold">
                کجا تمرین می‌کنی؟
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {EQUIPMENTS.map((eq) => (
                  <OptionButton
                    key={eq.value}
                    selected={equipment === eq.value}
                    onClick={() => setEquipment(eq.value)}
                  >
                    {eq.label}
                  </OptionButton>
                ))}
              </div>
            </fieldset>

            {/* محدودیت */}
            <div className="space-y-2">
              <Label htmlFor="limitations" className="text-sm font-bold">
                محدودیت یا آسیب خاصی داری؟{" "}
                <span className="font-normal text-muted-foreground">
                  (اختیاری)
                </span>
              </Label>
              <Textarea
                id="limitations"
                value={limitations}
                onChange={(e) => setLimitations(e.target.value)}
                placeholder="مثلاً: کمرم گاهی اذیت می‌کنه"
                rows={2}
                maxLength={500}
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <Button
                variant="ghost"
                className="min-h-11 px-4 text-muted-foreground"
                onClick={() => setStep(2)}
              >
                رد کردن
              </Button>
              <Button
                className="min-h-11 px-6"
                onClick={() => setStep(2)}
                aria-label="ادامه به مرحله دو"
              >
                ادامه
                <ChevronRight className="h-4 w-4 rotate-180" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* وزن و قد */}
            <fieldset className="space-y-3">
              <legend className="text-sm font-bold">
                وزن و قدت؟{" "}
                <span className="font-normal text-muted-foreground">
                  (اختیاری)
                </span>
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="weight" className="text-xs">
                    وزن (کیلوگرم)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    inputMode="decimal"
                    dir="ltr"
                    min={30}
                    max={300}
                    step={0.1}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-11 text-center"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="height" className="text-xs">
                    قد (سانتی‌متر)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    inputMode="decimal"
                    dir="ltr"
                    min={80}
                    max={250}
                    step={1}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="h-11 text-center"
                  />
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="min-h-11 gap-1.5 px-3 text-xs text-muted-foreground"
                    aria-label="چرا وزن و قد می‌پرسیم؟"
                  >
                    <HelpCircle className="h-4 w-4" aria-hidden="true" />
                    چرا می‌پرسیم؟
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 text-xs leading-6" align="start">
                  <div className="flex items-start gap-2">
                    <Info
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <p>
                      فقط برای محاسبه BMI و هدف کالری داخل همین دستگاه — این
                      داده‌ها روی هیچ سروری نمی‌رود و هر وقت خواستی می‌توانی
                      پاکشان کنی.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </fieldset>

            {/* پیش‌نمایش برنامه */}
            <fieldset>
              <legend className="mb-2 text-sm font-bold">
                برنامه پیشنهادی تو:
              </legend>
              <div className="space-y-2">
                {PROGRAM.map((day) => (
                  <div
                    key={day.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 px-3.5 py-3"
                  >
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary/12 border border-primary/25 px-2 py-1 text-[11px] font-bold text-primary">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      {day.weekDay}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold">{day.title}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {day.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-2 pt-1 sm:flex-row-reverse sm:items-center sm:justify-between">
              <Button
                className="min-h-11 w-full px-6 sm:w-auto"
                onClick={save}
                disabled={saving}
              >
                {saving ? "در حال ذخیره…" : "شروع می‌کنم"}
              </Button>
              <Button
                variant="ghost"
                className="min-h-11 w-full px-4 text-muted-foreground sm:w-auto"
                onClick={save}
                disabled={saving}
              >
                فعلاً نه — بعداً تکمیل می‌کنم
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
