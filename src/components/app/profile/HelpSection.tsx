"use client";

// ============================================================
// بخش ۷ پروفایل — کمک و درباره:
// سؤالات رایج + خطایابی + درباره برنامه (FST-7 + منابع علمی)
// ============================================================

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BookMarked, Github, RefreshCw } from "lucide-react";
import { openProgramTab } from "@/components/app/home/useTodaySession";
import { useAppStore } from "@/lib/store/app";

const FAQ = [
  {
    value: "faq-log-set",
    q: "چطور ست ثبت کنم؟",
    a: "از خانه یا برنامه «شروع تمرین» را بزن. کنار هر حرکت، وزنه و تکرار را با دکمه‌های + و − ثبت می‌شود. رد کردن یک ست هم کاملاً آزاده — هیچ‌چیز اجباری نیست.",
  },
  {
    value: "faq-partial",
    q: "جلسه نیمه‌کاره چه می‌شود؟",
    a: "هر چیزی که ثبت کرده باشی ذخیره می‌ماند. جلسه نیمه‌کاره در نمای خانه به‌صورت بنر می‌آید و هر وقت خواستی از همان‌جا ادامه می‌دهی. «نیمه‌تمام» هم حساب است — هیچ سرزنشی وجود ندارد.",
  },
  {
    value: "faq-storage",
    q: "داده‌ها کجا ذخیره می‌شوند؟",
    a: "فقط روی همین دستگاه، داخل دیتابیس محلی اپ. هیچ سرور یا حسابی در کار نیست. از بخش «حریم خصوصی و داده» می‌توانی خروجی JSON بگیری یا همه‌چیز را پاک کنی.",
  },
];

export default function HelpSection() {
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="space-y-5">
      {/* سؤالات رایج */}
      <Accordion type="single" collapsible className="rounded-xl border border-border/60 bg-secondary/20 px-4">
        {FAQ.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className="min-h-11 text-right text-sm font-bold hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-xs leading-7 text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* خطایابی */}
      <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
        <p className="text-sm font-bold">اگر چیزی خراب شد</p>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">
          پیام خطا قرمز، داخل همان بخشی نمایش داده می‌شود که مشکل دارد. اکثر
          مواقع یک رفرش صفحه حلش می‌کند — داده‌ات روی دستگاه ذخیره است و با
          رفرش چیزی از دست نمی‌رود.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 min-h-11 gap-2 px-4 text-xs"
          onClick={() => window.location.reload()}
          aria-label="رفرش صفحه"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          رفرش صفحه
        </Button>
      </div>

      {/* درباره */}
      <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
        <p className="text-sm font-bold">درباره برنامه</p>
        <p className="mt-1 text-xs leading-7 text-muted-foreground">
          این برنامه بر پایه اصول هانی رامبد (FST-7) چیده شده — همان سیستمی
          که مربی ۱۹ بار قهرمان مستر المپیا است — و هر تصمیمش با تحقیق علمی
          پشتیبانی می‌شود: از انتخاب دستگاه‌محور برای هفته‌های اول تا جایگاه
          کشش بعد از وزنه. ریشه هر اصل، با لینک مقالات، در بخش «دانش و منابع»
          آمده است.
        </p>
        <Button
          className="mt-3 min-h-11 gap-2"
          onClick={() => openProgramTab(setView, "#sources")}
          aria-label="رفتن به منابع علمی در نمای برنامه"
        >
          <BookMarked className="h-4 w-4" aria-hidden="true" />
          منابع علمی
        </Button>
      </div>

      {/* سازنده */}
      <div className="rounded-xl border border-primary/25 bg-primary/10 p-4">
        <p className="text-sm font-bold">سازنده</p>
        <p className="mt-1 text-xs leading-7 text-muted-foreground">
          طراحی، کدنویسی، برنامه‌نویسی تمرینی و محتوای علمی این داشبورد همه
          از <b className="text-foreground">سروش (Soroush)</b> است — ساخته‌شده
          برای خودش، بر پایه اصول FST-7. کد و مستندات کامل در گیت‌هاب عمومی
          است.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 min-h-11 gap-2 px-4 text-xs"
          onClick={() =>
            window.open(
              "https://github.com/CheginiSoroush",
              "_blank",
              "noopener,noreferrer"
            )
          }
          aria-label="باز کردن صفحه گیت‌هاب سازنده در تب جدید"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          GitHub — CheginiSoroush
        </Button>
      </div>
    </div>
  );
}
