"use client";

// ============================================================
// نمای پروفایل و تنظیمات — حریم خصوصی جدی است:
// ۱ پروفایل (ویرایش) ۲ ظاهر و تجربه ۳ واحد نمایش ۴ هدف هفته
// ۵ یادآوری‌ها (صداقت کامل) ۶ حریم خصوصی و داده ۷ کمک و درباره
// ============================================================

import {
  Bell,
  HelpCircle,
  Palette,
  Ruler,
  ShieldCheck,
  Target,
  User,
  type LucideIcon,
} from "lucide-react";
import ProfileForm from "@/components/app/profile/ProfileForm";
import AppearanceSection from "@/components/app/profile/AppearanceSection";
import UnitSection from "@/components/app/profile/UnitSection";
import GoalStepper from "@/components/app/profile/GoalStepper";
import RemindersSection from "@/components/app/profile/RemindersSection";
import DataSection from "@/components/app/profile/DataSection";
import HelpSection from "@/components/app/profile/HelpSection";
import { SectionCard } from "@/components/app/profile/profile-shared";

export default function ProfileView() {
  return (
    <div className="space-y-5">
      {/* ---------- سرتیتر ---------- */}
      <section aria-label="معرفی پروفایل" className="pt-2">
        <h2 className="text-2xl font-black leading-snug">پروفایل و تنظیمات</h2>
        <p className="mt-1 text-sm leading-7 text-muted-foreground">
          هر چیزی که اپ باید بداند — و هر چیزی که تو باید بدانی. همه تنظیم‌ها
          همین‌جاست و همه‌چیز روی همین دستگاه می‌ماند.
        </p>
      </section>

      {/* ---------- ۱: پروفایل ---------- */}
      <SectionCard
        id="info"
        icon={User as LucideIcon}
        title="پروفایل"
        description="هدف، سطح، روزها و تجهیزات — هر وقت خواستی عوضش کن؛ برنامه هماهنگ می‌شود."
      >
        <ProfileForm />
      </SectionCard>

      {/* ---------- ۲: ظاهر و تجربه ---------- */}
      <SectionCard
        id="appearance"
        icon={Palette}
        title="ظاهر و تجربه"
        description="تم و سرعت انیمیشن — سلیقه توئه و در همین دستگاه ذخیره می‌شود."
      >
        <AppearanceSection />
      </SectionCard>

      {/* ---------- ۳: واحد نمایش ---------- */}
      <SectionCard
        id="units"
        icon={Ruler}
        title="واحد نمایش"
        description="کیلوگرم یا پوند — فقط روی نمایش اعداد اثر می‌گذارد؛ ذخیره‌سازی همیشه متریک است."
      >
        <UnitSection />
      </SectionCard>

      {/* ---------- ۴: هدف هفته ---------- */}
      <SectionCard
        id="goal"
        icon={Target}
        title="هدف هفته"
        description="چند جلسه در هفته واقعاً برایت ممکن است؟ همین عدد خط هدف نمودار استمراری می‌شود."
      >
        <GoalStepper />
      </SectionCard>

      {/* ---------- ۵: یادآوری‌ها ---------- */}
      <SectionCard
        id="reminders"
        icon={Bell}
        title="یادآوری‌ها"
        description="با صداقت کامل: هنوز اعلان سیستمی نداریم — همه‌چیز داخل خود اپ است."
      >
        <RemindersSection />
      </SectionCard>

      {/* ---------- ۶: حریم خصوصی و داده ---------- */}
      <SectionCard
        id="privacy"
        icon={ShieldCheck}
        title="حریم خصوصی و داده"
        description="خروجی بگیر یا پاک کن — داده مال توئه و فقط روی همین دستگاه است."
      >
        <DataSection />
      </SectionCard>

      {/* ---------- ۷: کمک و درباره ---------- */}
      <SectionCard
        id="help"
        icon={HelpCircle}
        title="کمک و درباره"
        description="سؤال‌های رایج، خطایابی و درباره برنامه."
      >
        <HelpSection />
      </SectionCard>
    </div>
  );
}
