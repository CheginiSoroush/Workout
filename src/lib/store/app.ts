// ============================================================
// استور سراسری اپ — Zustand
// view فعلی + جلسه فعال (با persist تا کرش، جلسه را از دست ندهد)
// ============================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AppView = "home" | "program" | "workout" | "progress" | "profile";

export interface ActiveSessionInfo {
  id: number;
  dayId: string;
  /** ISO string — قابل serialize شدن */
  startedAt: string;
}

interface AppState {
  view: AppView;
  setView: (view: AppView) => void;

  activeSession: ActiveSessionInfo | null;
  setActiveSession: (session: ActiveSessionInfo) => void;
  clearActiveSession: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      view: "home",
      setView: (view) => set({ view }),

      activeSession: null,
      setActiveSession: (activeSession) => set({ activeSession }),
      clearActiveSession: () => set({ activeSession: null }),
    }),
    {
      name: "active-session-v1",
      storage: createJSONStorage(() => localStorage),
      // فقط جلسه فعال ذخیره می‌شود — view هر بار از خانه شروع می‌کند
      partialize: (state) => ({ activeSession: state.activeSession }),
    }
  )
);
