"use client";

import { CalendarDays, Home, Play, TrendingUp, User } from "lucide-react";
import { useAppStore, type AppView } from "@/lib/store/app";

interface NavItem {
  view: AppView;
  label: string;
  icon: typeof Home;
  center?: boolean;
}

const ITEMS: NavItem[] = [
  { view: "home", label: "خانه", icon: Home },
  { view: "program", label: "برنامه", icon: CalendarDays },
  { view: "workout", label: "شروع تمرین", icon: Play, center: true },
  { view: "progress", label: "پیشرفت", icon: TrendingUp },
  { view: "profile", label: "پروفایل", icon: User },
];

/**
 * ناوبری پایین ثابت — ۵ مقصد، آیتم وسط «شروع تمرین» بزرگ‌تر و دایره‌ای.
 * در نمای workout مخفی می‌شود (پلیر تمام‌صفحه است).
 */
export default function BottomNavigation() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const hasActiveSession = useAppStore((s) => s.activeSession !== null);

  if (view === "workout") return null;

  return (
    <nav
      aria-label="ناوبری اصلی"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto grid h-[4.25rem] max-w-md grid-cols-5 items-end px-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = view === item.view;

          if (item.center) {
            return (
              <div key={item.view} className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setView(item.view)}
                  aria-label="شروع تمرین"
                  aria-current={active ? "page" : undefined}
                  className={`relative -mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg glow-emerald transition-transform outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:scale-105 active:scale-95 motion-safe:transition-transform ${
                    active ? "ring-2 ring-primary/60 ring-offset-4 ring-offset-background" : ""
                  }`}
                >
                  <Icon className="h-7 w-7" aria-hidden="true" />
                  {hasActiveSession && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-950 border-2 border-primary-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
                    </span>
                  )}
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.view}
              type="button"
              onClick={() => setView(item.view)}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`flex h-14 min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span
                className={`text-[11px] leading-none ${active ? "font-bold" : "font-medium"}`}
              >
                {item.label}
              </span>
              <span
                aria-hidden="true"
                className={`h-1 w-1 rounded-full bg-primary transition-opacity ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
