// ============================================================
// انواع پاسخ /api/progress — مشترک بین کامپوننت‌های نمای پیشرفت
// ============================================================

export interface ProgressDto {
  prs: {
    exerciseId: string;
    weight: number;
    reps: number | null;
    date: string;
  }[];
  weekly: { weekKey: string; completedCount: number; volume: number }[];
  totals: {
    totalSessions: number;
    totalSets: number;
    totalVolume: number;
  };
  lastSessions: { id: number; date: string; dayId: string; status: string }[];
  stretchDays: number;
  lastWeight: { weight: number; date: string } | null;
}
