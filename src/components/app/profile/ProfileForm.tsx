"use client";

// ============================================================
// بخش ۱ پروفایل — نمایش/ویرایش: نام، هدف، سطح، روزها/هفته،
// تجهیزات، محدودیت‌ها، وزن/قد (اختیاری + «چرا می‌پرسیم؟»)
// ورودی وزن/قد همیشه متریک ذخیره می‌شود؛ نمایش وزن طبق واحد انتخابی
// مقادیر پایه از کش پروفایل می‌آیند و ویرایش‌ها در override نگه داشته
// می‌شوند (بدون setState در effect).
// ============================================================

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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Info, Loader2, Save } from "lucide-react";
import { faNum } from "@/lib/fa";
import { weightToDisplay, weightUnitShort, type Units } from "@/lib/units";
import {
  extractProfile,
  useProfile,
  usePutProfile,
  type ProfileFull,
} from "./profile-shared";

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

interface FormState {
  name: string;
  goal: string;
  experience: string;
  daysPerWeek: number;
  equipment: string;
  limitations: string;
  weight: string;
  height: string;
}

function fromProfile(p: ProfileFull): FormState {
  return {
    name: p.name ?? "",
    goal: p.goal,
    experience: p.experience,
    daysPerWeek: p.daysPerWeek,
    equipment: p.equipment,
    limitations: p.limitations ?? "",
    weight: p.weightKg != null ? String(p.weightKg) : "",
    height: p.heightCm != null ? String(p.heightCm) : "",
  };
}

export default function ProfileForm() {
  const { toast } = useToast();
  const profileQ = useProfile();
  const put = usePutProfile();

  // ویرایش‌های کاربر — روی مقادیر پروفایل overlay می‌شوند
  const [edits, setEdits] = useState<Partial<FormState>>({});

  const profile = extractProfile(profileQ.data);
  const form: FormState | null = profile
    ? { ...fromProfile(profile), ...edits }
    : null;

  const units: Units = profile?.units === "imperial" ? "imperial" : "metric";

  const patch = (p: Partial<FormState>) => {
    setEdits((e) => ({ ...e, ...p }));
  };

  const save = () => {
    if (!form || put.isPending) return;
    const w = form.weight.trim() === "" ? null : Number(form.weight);
    const h = form.height.trim() === "" ? null : Number(form.height);
    if (w != null && (Number.isNaN(w) || w < 30 || w > 300)) {
      toast({
        title: "وزن نامعتبر",
        description: "عدد بین ۳۰ تا ۳۰۰ کیلوگرم وارد کن (متریک ذخیره می‌شود).",
        variant: "destructive",
      });
      return;
    }
    if (h != null && (Number.isNaN(h) || h < 80 || h > 250)) {
      toast({
        title: "قد نامعتبر",
        description: "عدد بین ۸۰ تا ۲۵۰ سانتی‌متر وارد کن.",
        variant: "destructive",
      });
      return;
    }
    put.mutate(
      {
        name: form.name.trim() ? form.name.trim() : null,
        goal: form.goal,
        experience: form.experience,
        daysPerWeek: form.daysPerWeek,
        equipment: form.equipment,
        limitations: form.limitations.trim() ? form.limitations.trim() : null,
        weightKg: w,
        heightCm: h,
      },
      {
        onSuccess: () => {
          setEdits({}); // کش پروفایل تازه شد — ویرایش‌ها همان مقادیرند
          toast({ title: "ذخیره شد ✅", description: "پروفایل به‌روز شد." });
        },
      }
    );
  };

  if (!form) {
    return (
      <div className="space-y-3" aria-hidden="true">
        <Skeleton className="h-11 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-12 w-32 rounded-xl" />
      </div>
    );
  }

  const weightDisplayHint =
    units === "imperial" &&
    form.weight.trim() !== "" &&
    !Number.isNaN(Number(form.weight))
      ? `≈ ${faNum(weightToDisplay(Number(form.weight), units), 1)} ${weightUnitShort(units)}`
      : null;

  return (
    <div className="space-y-5">
      {/* نام */}
      <div className="space-y-1.5">
        <Label htmlFor="profile-name" className="text-sm font-bold">
          اسمت چیست؟{" "}
          <span className="font-normal text-muted-foreground">(اختیاری)</span>
        </Label>
        <Input
          id="profile-name"
          value={form.name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="مثلاً: علی"
          maxLength={60}
          className="h-11"
        />
      </div>

      {/* هدف */}
      <fieldset>
        <legend className="mb-2 text-sm font-bold">هدفت چیه؟</legend>
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map((g) => (
            <OptionButton
              key={g.value}
              selected={form.goal === g.value}
              onClick={() => patch({ goal: g.value })}
            >
              <span aria-hidden="true">{g.emoji}</span> {g.label}
            </OptionButton>
          ))}
        </div>
      </fieldset>

      {/* سطح */}
      <fieldset>
        <legend className="mb-2 text-sm font-bold">سطح تجربه‌ات چیه؟</legend>
        <div className="grid grid-cols-3 gap-2">
          {EXPERIENCES.map((e) => (
            <OptionButton
              key={e.value}
              selected={form.experience === e.value}
              onClick={() => patch({ experience: e.value })}
            >
              {e.label}
            </OptionButton>
          ))}
        </div>
      </fieldset>

      {/* روزها */}
      <fieldset>
        <legend className="mb-2 text-sm font-bold">
          در هفته چند روز می‌تونی تمرین کنی؟
        </legend>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={form.daysPerWeek === d}
              aria-label={`${faNum(d)} روز در هفته`}
              onClick={() => patch({ daysPerWeek: d })}
              className={`h-11 w-11 rounded-xl border text-sm font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                form.daysPerWeek === d
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
        <legend className="mb-2 text-sm font-bold">کجا تمرین می‌کنی؟</legend>
        <div className="grid grid-cols-2 gap-2">
          {EQUIPMENTS.map((eq) => (
            <OptionButton
              key={eq.value}
              selected={form.equipment === eq.value}
              onClick={() => patch({ equipment: eq.value })}
            >
              {eq.label}
            </OptionButton>
          ))}
        </div>
      </fieldset>

      {/* محدودیت‌ها */}
      <div className="space-y-1.5">
        <Label htmlFor="profile-limitations" className="text-sm font-bold">
          محدودیت یا آسیب خاصی داری؟{" "}
          <span className="font-normal text-muted-foreground">(اختیاری)</span>
        </Label>
        <Textarea
          id="profile-limitations"
          value={form.limitations}
          onChange={(e) => patch({ limitations: e.target.value })}
          placeholder="مثلاً: کمرم گاهی اذیت می‌کنه"
          rows={2}
          maxLength={500}
        />
      </div>

      {/* وزن و قد — همیشه متریک */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-bold">
          وزن و قد{" "}
          <span className="font-normal text-muted-foreground">(اختیاری)</span>
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="profile-weight" className="text-xs">
              وزن (کیلوگرم)
            </Label>
            <Input
              id="profile-weight"
              type="number"
              inputMode="decimal"
              dir="ltr"
              min={30}
              max={300}
              step={0.1}
              value={form.weight}
              onChange={(e) => patch({ weight: e.target.value })}
              className="h-11 text-center"
            />
            {weightDisplayHint && (
              <p className="text-[11px] text-muted-foreground" dir="ltr">
                {weightDisplayHint}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-height" className="text-xs">
              قد (سانتی‌متر)
            </Label>
            <Input
              id="profile-height"
              type="number"
              inputMode="decimal"
              dir="ltr"
              min={80}
              max={250}
              step={1}
              value={form.height}
              onChange={(e) => patch({ height: e.target.value })}
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
                فقط برای محاسبه BMI و هدف کالری داخل همین دستگاه — این داده‌ها
                هیچ‌جا ارسال نمی‌شود، روی هیچ سروری نمی‌رود و هر وقت خواستی از
                بخش «حریم خصوصی و داده» پاکشان کنی.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </fieldset>

      {/* ذخیره */}
      <Button
        className="min-h-11 w-full gap-2 sm:w-40"
        onClick={save}
        disabled={put.isPending}
        aria-label="ذخیره پروفایل"
      >
        {put.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="h-4 w-4" aria-hidden="true" />
        )}
        ذخیره
      </Button>
    </div>
  );
}
