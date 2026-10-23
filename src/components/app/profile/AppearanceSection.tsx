"use client";

// ============================================================
// بخش ۲ پروفایل — ظاهر و تجربه:
// • تم: تیره / روشن / سیستم (next-themes)
//   (layout با defaultTheme=dark و enableSystem=false تنظیم شده؛
//   حالت «سیستم» را خودِ این کامپوننت با matchMedia پیاده می‌کند)
// • کاهش موشن: سوییچ → html.reduce-motion + localStorage + profile.reducedMotion
// حالت‌ها با useSyncExternalStore از localStorage می‌آیند (بدون mismatch)
// ============================================================

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import {
  createLocalChoiceStore,
  createLocalFlagStore,
  extractProfile,
  useMounted,
  useProfile,
  usePutProfile,
} from "./profile-shared";

type ThemeMode = "dark" | "light" | "system";

const THEME_KEY = "theme-mode"; // انتخاب کاربر: dark | light | system
const RM_KEY = "reduce-motion"; // «1» = فعال

const themeModeStore = createLocalChoiceStore<ThemeMode>(THEME_KEY, "dark");
const rmStore = createLocalFlagStore(RM_KEY);

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: LucideIcon }[] = [
  { value: "dark", label: "تیره", icon: Moon },
  { value: "light", label: "روشن", icon: Sun },
  { value: "system", label: "سیستم", icon: Monitor },
];

export default function AppearanceSection() {
  const { setTheme } = useTheme();
  const profileQ = useProfile();
  const put = usePutProfile();
  const mounted = useMounted();

  const mode = useSyncExternalStore(
    themeModeStore.subscribe,
    () => themeModeStore.get(),
    () => "dark" as ThemeMode
  );
  const rm = useSyncExternalStore(
    rmStore.subscribe,
    () => rmStore.get(),
    () => false
  );

  const profile = extractProfile(profileQ.data);
  const rmTouched = useRef(false);

  // اعمال تم روی next-themes — همگام‌سازی با سیستم خارجی (مجاز در effect)
  useEffect(() => {
    if (mode === "system") {
      const matches = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(matches ? "dark" : "light");
    } else {
      setTheme(mode);
    }
  }, [mode, setTheme]);

  // وقتی حالت «سیستم» است، تغییر تنظیم دستگاه هم اعمال شود
  useEffect(() => {
    if (mode !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "dark" : "light");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mode, setTheme]);

  // کلاس reduce-motion روی html — با localStorage بلافاصله و پروفایل به‌عنوان مرجع
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", rm);
  }, [rm]);

  const profileRm = profile?.reducedMotion;
  useEffect(() => {
    if (profileRm === undefined || rmTouched.current) return;
    rmStore.set(profileRm);
  }, [profileRm]);

  const chooseMode = (m: ThemeMode) => {
    themeModeStore.set(m); // re-render از طریق store — setTheme در effect بالا اعمال می‌شود
  };

  const toggleReduceMotion = (on: boolean) => {
    rmTouched.current = true;
    rmStore.set(on);
    put.mutate({ reducedMotion: on });
  };

  return (
    <div className="space-y-5">
      {/* تم */}
      <fieldset>
        <legend className="mb-2 text-sm font-bold">تم</legend>
        {mounted ? (
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="انتخاب تم">
            {THEME_OPTIONS.map((opt) => {
              const OptIcon = opt.icon;
              const selected = mode === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => chooseMode(opt.value)}
                  className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                    selected
                      ? "border-primary/60 bg-primary/12 font-bold text-primary"
                      : "border-border bg-secondary/40 text-foreground hover:border-primary/40"
                  }`}
                >
                  <OptIcon className="h-4 w-4" aria-hidden="true" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        ) : (
          <Skeleton className="h-11 w-full rounded-xl" aria-hidden="true" />
        )}
        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
          «سیستم» یعنی هماهنگ با تنظیم روشن/تیره خود دستگاهت.
        </p>
      </fieldset>

      {/* کاهش موشن — کل ردیف با label قابل لمس است (هدف لمسی ≥44px) */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-secondary/30 p-4">
        <label
          htmlFor="reduce-motion-switch"
          className="min-w-0 flex-1 cursor-pointer"
        >
          <span className="block text-sm font-bold">کاهش موشن</span>
          <span className="mt-0.5 block text-xs leading-6 text-muted-foreground">
            انیمیشن‌ها و انتقال‌ها ساده می‌شوند — مناسب سردرد، سرگیجه یا
            حساسیت به حرکت.
          </span>
        </label>
        <Switch
          id="reduce-motion-switch"
          checked={rm}
          onCheckedChange={toggleReduceMotion}
          aria-label="کاهش موشن"
          className="shrink-0"
        />
      </div>
    </div>
  );
}
