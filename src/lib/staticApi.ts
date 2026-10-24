// ============================================================
// لایهٔ API استاتیک — آینهٔ کامل routeهای /api سمت کلاینت
// ============================================================
// وقتی سایت روی GitHub Pages سرو می‌شود هیچ سرور Node‌ای در دسترس
// نیست. این ماژول با نصب یک شیم روی window.fetch، درخواست‌های
// /api/* را قبل از شبکه می‌گیرد و همان پاسخ‌های routeهای سرور را —
// با دادهٔ ماندگار در localStorage — بازمی‌گرداند.
//
// فعال‌سازی: فقط وقتی NEXT_PUBLIC_STATIC_EXPORT=1 (بیلد CI).
// در محیط توسعه/سندباکس هیچ تغییری در رفتار ایجاد نمی‌شود.
//
// منطق هر endpoint دقیقاً از روی route متناظر (src/app/api/**)
// و schema.prisma بازنویسی شده است:
//   GET/POST/DELETE  /api/weights
//   GET/PUT          /api/profile
//   GET/POST/DELETE  /api/workout-logs
//   GET/POST         /api/sessions
//   GET              /api/sessions/active
//   GET/PATCH/DELETE /api/sessions/[id]
//   GET/POST         /api/sessions/[id]/sets
//   DELETE           /api/sets/[id]
//   GET/POST         /api/stretch-log
//   GET              /api/progress
//   GET              /api/export
//   DELETE           /api/data
//   GET/POST         /api/bike-log
//   GET              /api  → { message: "Hello, world!" }
// ============================================================

import { getWeekKey } from "@/lib/week";
import { todayISO } from "@/lib/fa";

/** باید با basePath در next.config.ts (بیلد استاتیک) یکی باشد */
const BASE_PATH = "/Workout";

const DB_KEY = "fst7-static-db-v1";

// ---------- تایپ‌ها — آینهٔ schema.prisma ----------

interface Profile {
  id: number;
  name: string | null;
  goal: string; // muscle | fatloss | strength | general
  experience: string; // beginner | intermediate | advanced
  daysPerWeek: number;
  equipment: string; // gym | home
  limitations: string | null;
  weightKg: number | null;
  heightCm: number | null;
  units: string; // metric | imperial
  reducedMotion: boolean;
  onboardingDone: boolean;
  weekSessionsGoal: number;
  createdAt: string;
  updatedAt: string;
}

interface SetEntry {
  id: number;
  sessionId: number;
  exerciseId: string;
  exerciseOrder: number;
  weight: number | null;
  reps: number | null;
  skipped: boolean;
  createdAt: string;
}

interface Session {
  id: number;
  date: string; // YYYY-MM-DD
  dayId: string; // day1 | day2 | day3
  status: string; // active | completed | partial | abandoned
  startedAt: string;
  endedAt: string | null;
  feeling: number | null;
  note: string | null;
  reason: string | null; // fatigue | pain | time | other
  sets: SetEntry[];
}

interface WeightEntry {
  id: string; // cuid-مانند
  weight: number;
  date: string; // YYYY-MM-DD (یکتا)
  note: string | null;
  createdAt: string;
}

interface WorkoutLog {
  id: string; // cuid-مانند
  dayId: string;
  weekKey: string; // 2025-W23
  completedAt: string;
}

interface StretchLog {
  id: number;
  date: string; // YYYY-MM-DD (یکتا)
  itemsDone: number;
  minutes: number | null;
  createdAt: string;
}

interface BikeLog {
  id: number;
  date: string;
  slot: string; // warmup | liss | recovery
  minutes: number | null;
  note: string | null;
  createdAt: string;
}

interface StaticDb {
  version: 1;
  seq: { session: number; set: number; stretch: number; bike: number };
  profile: Profile | null;
  sessions: Session[];
  weightEntries: WeightEntry[];
  workoutLogs: WorkoutLog[];
  stretchLogs: StretchLog[];
  bikeLogs: BikeLog[];
}

// ---------- ابزارهای پایه ----------

function nowISO(): string {
  return new Date().toISOString();
}

function cuidLike(): string {
  return (
    "c" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10)
  );
}

function defaultProfile(): Profile {
  return {
    id: 1,
    name: null,
    goal: "muscle",
    experience: "beginner",
    daysPerWeek: 3,
    equipment: "gym",
    limitations: null,
    weightKg: null,
    heightCm: null,
    units: "metric",
    reducedMotion: false,
    onboardingDone: false,
    weekSessionsGoal: 2,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
}

function emptyDb(): StaticDb {
  return {
    version: 1,
    seq: { session: 0, set: 0, stretch: 0, bike: 0 },
    profile: null,
    sessions: [],
    weightEntries: [],
    workoutLogs: [],
    stretchLogs: [],
    bikeLogs: [],
  };
}

let cache: StaticDb | null = null;

function loadDb(): StaticDb {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StaticDb;
      if (parsed && parsed.version === 1) {
        cache = {
          ...emptyDb(),
          ...parsed,
          seq: { ...emptyDb().seq, ...(parsed.seq ?? {}) },
        };
        return cache;
      }
    }
  } catch {
    // دادهٔ خراب → شروع تازه (مانند دیتابیس خالی)
  }
  cache = emptyDb();
  saveDb();
  return cache;
}

function saveDb(): void {
  try {
    if (cache) localStorage.setItem(DB_KEY, JSON.stringify(cache));
  } catch {
    // حافظه پر/محدود — بی‌صدا ادامه بده (رفتار best-effort)
  }
}

// ---------- مرتب‌سازی‌ها — مطابق orderBy سرور ----------

function sortSets(sets: SetEntry[]): SetEntry[] {
  return [...sets].sort(
    (a, b) =>
      a.exerciseOrder - b.exerciseOrder ||
      a.createdAt.localeCompare(b.createdAt) ||
      a.id - b.id
  );
}

function withSortedSets(s: Session): Session {
  return { ...s, sets: sortSets(s.sets) };
}

// ---------- پاسخ‌ها ----------

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function errorJson(message: string, status: number): Response {
  return json({ error: message }, status);
}

// ============================================================
// هندلرها — آینهٔ routeهای سرور
// ============================================================

async function handleApi(
  method: string,
  pathname: string,
  params: URLSearchParams,
  body: unknown
): Promise<Response> {
  const db = loadDb();
  const seg = pathname
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean);
  // seg[0] === "api"
  const p = seg.slice(1);
  const asRecord = (body ?? {}) as Record<string, unknown>;

  // GET /api — سلام دنیا (آینهٔ src/app/api/route.ts)
  if (p.length === 0) {
    return json({ message: "Hello, world!" });
  }

  // ---------- /api/weights ----------
  if (p[0] === "weights" && p.length === 1) {
    if (method === "GET") {
      const entries = [...db.weightEntries]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 120);
      return json({ entries });
    }
    if (method === "POST") {
      const weight = Number(asRecord.weight);
      if (!Number.isFinite(weight) || weight < 30 || weight > 300) {
        return errorJson("داده نامعتبر است", 400);
      }
      const note =
        asRecord.note === undefined
          ? undefined
          : (asRecord.note as string | null);
      const date =
        typeof asRecord.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(asRecord.date)
          ? asRecord.date
          : new Date().toISOString().slice(0, 10);

      const existing = db.weightEntries.find((e) => e.date === date);
      if (existing) {
        existing.weight = weight;
        existing.note = note === undefined ? existing.note : (note ?? null);
        const entry = { ...existing };
        saveDb();
        return json({ entry }, 201);
      }
      const entry: WeightEntry = {
        id: cuidLike(),
        weight,
        date,
        note: note ?? null,
        createdAt: nowISO(),
      };
      db.weightEntries.push(entry);
      saveDb();
      return json({ entry }, 201);
    }
    if (method === "DELETE") {
      const id = params.get("id");
      if (!id) return errorJson("شناسه رکورد الزامی است", 400);
      db.weightEntries = db.weightEntries.filter((e) => e.id !== id);
      saveDb();
      return json({ success: true });
    }
  }

  // ---------- /api/profile ----------
  if (p[0] === "profile" && p.length === 1) {
    if (method === "GET") {
      if (!db.profile) {
        db.profile = defaultProfile();
        saveDb();
      }
      return json({ profile: db.profile });
    }
    if (method === "PUT") {
      if (!db.profile) {
        db.profile = defaultProfile();
      }
      const allowed: (keyof Profile)[] = [
        "name",
        "goal",
        "experience",
        "daysPerWeek",
        "equipment",
        "limitations",
        "weightKg",
        "heightCm",
        "units",
        "reducedMotion",
        "onboardingDone",
        "weekSessionsGoal",
      ];
      for (const key of allowed) {
        if (asRecord[key] !== undefined) {
          (db.profile as unknown as Record<string, unknown>)[key] =
            asRecord[key];
        }
      }
      db.profile.updatedAt = nowISO();
      saveDb();
      return json({ profile: db.profile });
    }
  }

  // ---------- /api/workout-logs ----------
  if (p[0] === "workout-logs" && p.length === 1) {
    if (method === "GET") {
      const weekKey = params.get("weekKey");
      const logs = db.workoutLogs
        .filter((l) => (weekKey ? l.weekKey === weekKey : true))
        .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
      return json({ logs });
    }
    if (method === "POST") {
      const dayId = asRecord.dayId as string;
      const weekKey = asRecord.weekKey as string;
      if (
        !["day1", "day2", "day3"].includes(dayId) ||
        !/^\d{4}-W\d{2}$/.test(weekKey ?? "")
      ) {
        return errorJson("داده نامعتبر است", 400);
      }
      const existing = db.workoutLogs.find(
        (l) => l.dayId === dayId && l.weekKey === weekKey
      );
      if (existing) {
        existing.completedAt = nowISO();
        const log = { ...existing };
        saveDb();
        return json({ log }, 201);
      }
      const log: WorkoutLog = {
        id: cuidLike(),
        dayId,
        weekKey,
        completedAt: nowISO(),
      };
      db.workoutLogs.push(log);
      saveDb();
      return json({ log }, 201);
    }
    if (method === "DELETE") {
      const dayId = params.get("dayId");
      const weekKey = params.get("weekKey");
      if (!dayId || !weekKey) {
        return errorJson("dayId و weekKey الزامی هستند", 400);
      }
      db.workoutLogs = db.workoutLogs.filter(
        (l) => !(l.dayId === dayId && l.weekKey === weekKey)
      );
      saveDb();
      return json({ success: true });
    }
  }

  // ---------- /api/sessions ----------
  if (p[0] === "sessions" && p.length === 1) {
    if (method === "GET") {
      const status = params.get("status");
      const dayId = params.get("dayId");
      const limit = Number(params.get("limit") ?? 30) || 30;
      const sessions = db.sessions
        .filter(
          (s) =>
            (status ? s.status === status : true) &&
            (dayId ? s.dayId === dayId : true)
        )
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
        .slice(0, Math.min(Math.max(limit, 1), 100))
        .map(withSortedSets);
      return json({ sessions });
    }
    if (method === "POST") {
      const dayId = asRecord.dayId as string;
      if (!["day1", "day2", "day3"].includes(dayId)) {
        return errorJson("داده نامعتبر است", 400);
      }
      const existing = db.sessions
        .filter((s) => s.status === "active")
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
      if (existing) {
        return json({ session: withSortedSets(existing), created: false });
      }
      db.seq.session += 1;
      const session: Session = {
        id: db.seq.session,
        date: todayISO(),
        dayId,
        status: "active",
        startedAt: nowISO(),
        endedAt: null,
        feeling: null,
        note: null,
        reason: null,
        sets: [],
      };
      db.sessions.push(session);
      saveDb();
      return json({ session, created: true }, 201);
    }
  }

  // ---------- /api/sessions/active ----------
  if (p[0] === "sessions" && p[1] === "active" && p.length === 2) {
    if (method === "GET") {
      const session = db.sessions
        .filter((s) => s.status === "active")
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
      return json({ session: session ? withSortedSets(session) : null });
    }
  }

  // ---------- /api/sessions/[id] ----------
  if (p[0] === "sessions" && p.length === 2) {
    const sessionId = Number(p[1]);
    if (!Number.isInteger(sessionId) || sessionId < 1) {
      return errorJson("شناسه نامعتبر است", 400);
    }
    const current = db.sessions.find((s) => s.id === sessionId);
    if (method === "GET") {
      if (!current) return errorJson("جلسه پیدا نشد", 404);
      return json({ session: withSortedSets(current) });
    }
    if (method === "PATCH") {
      if (!current) return errorJson("جلسه پیدا نشد", 404);
      const status = asRecord.status as string;
      if (!["active", "completed", "partial", "abandoned"].includes(status)) {
        return errorJson("داده نامعتبر است", 400);
      }
      const feeling =
        asRecord.feeling === undefined
          ? undefined
          : (asRecord.feeling as number | null);
      const note =
        asRecord.note === undefined ? undefined : (asRecord.note as string | null);
      const reason =
        asRecord.reason === undefined
          ? undefined
          : (asRecord.reason as string | null);

      // wasCompleted «قبل از» تغییر وضعیت ارزیابی می‌شود — آینهٔ سرور
      const wasCompleted = current.status === "completed";

      const leavingActive = status !== "active";
      current.status = status;
      if (feeling !== undefined) current.feeling = feeling;
      if (note !== undefined) current.note = note;
      if (reason !== undefined) current.reason = reason;
      if (leavingActive && !current.endedAt) current.endedAt = nowISO();

      // همگام‌سازی چک‌لیست هفتگی — آینهٔ منطق PATCH سرور
      const weekKey = getWeekKey(current.date);
      if (status === "completed" && !wasCompleted) {
        const log = db.workoutLogs.find(
          (l) => l.dayId === current.dayId && l.weekKey === weekKey
        );
        if (log) {
          log.completedAt = nowISO();
        } else {
          db.workoutLogs.push({
            id: cuidLike(),
            dayId: current.dayId,
            weekKey,
            completedAt: nowISO(),
          });
        }
      } else if (wasCompleted && status !== "completed") {
        // اگر جلسه تکمیل‌شده به حالت دیگر برگشت، تیک چک‌لیست هم برداشته شود
        db.workoutLogs = db.workoutLogs.filter(
          (l) => !(l.dayId === current.dayId && l.weekKey === weekKey)
        );
      }
      saveDb();
      return json({ session: withSortedSets(current) });
    }
    if (method === "DELETE") {
      if (!current) return errorJson("جلسه پیدا نشد", 404);
      if (current.status === "completed") {
        const weekKey = getWeekKey(current.date);
        db.workoutLogs = db.workoutLogs.filter(
          (l) => !(l.dayId === current.dayId && l.weekKey === weekKey)
        );
      }
      db.sessions = db.sessions.filter((s) => s.id !== sessionId);
      saveDb();
      return json({ success: true });
    }
  }

  // ---------- /api/sessions/[id]/sets ----------
  if (p[0] === "sessions" && p[2] === "sets" && p.length === 3) {
    const sessionId = Number(p[1]);
    if (!Number.isInteger(sessionId) || sessionId < 1) {
      return errorJson("شناسه نامعتبر است", 400);
    }
    const session = db.sessions.find((s) => s.id === sessionId);
    if (!session) return errorJson("جلسه پیدا نشد", 404);

    if (method === "GET") {
      return json({ sets: sortSets(session.sets) });
    }
    if (method === "POST") {
      const exerciseId = asRecord.exerciseId as string;
      const exerciseOrder = Number(asRecord.exerciseOrder);
      if (!exerciseId || !Number.isInteger(exerciseOrder)) {
        return errorJson("داده نامعتبر است", 400);
      }
      db.seq.set += 1;
      const set: SetEntry = {
        id: db.seq.set,
        sessionId,
        exerciseId,
        exerciseOrder,
        weight:
          asRecord.weight === undefined || asRecord.weight === null
            ? null
            : Number(asRecord.weight),
        reps:
          asRecord.reps === undefined || asRecord.reps === null
            ? null
            : Number(asRecord.reps),
        skipped: Boolean(asRecord.skipped ?? false),
        createdAt: nowISO(),
      };
      session.sets.push(set);
      saveDb();
      return json({ set }, 201);
    }
  }

  // ---------- /api/sets/[id] ----------
  if (p[0] === "sets" && p.length === 2) {
    if (method === "DELETE") {
      const setId = Number(p[1]);
      if (!Number.isInteger(setId) || setId < 1) {
        return errorJson("شناسه نامعتبر است", 400);
      }
      let found = false;
      for (const s of db.sessions) {
        const before = s.sets.length;
        s.sets = s.sets.filter((st) => st.id !== setId);
        if (s.sets.length !== before) {
          found = true;
          break;
        }
      }
      if (!found) return errorJson("ست پیدا نشد", 404);
      saveDb();
      return json({ success: true });
    }
  }

  // ---------- /api/stretch-log ----------
  if (p[0] === "stretch-log" && p.length === 1) {
    if (method === "GET") {
      const date = params.get("date");
      if (date) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return errorJson("فرمت تاریخ نامعتبر است", 400);
        }
        const entry = db.stretchLogs.find((e) => e.date === date) ?? null;
        return json({ entry });
      }
      const entries = [...db.stretchLogs]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 365);
      return json({ entries });
    }
    if (method === "POST") {
      const date = asRecord.date as string;
      const itemsDone = Number(asRecord.itemsDone);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "") || !Number.isInteger(itemsDone)) {
        return errorJson("داده نامعتبر است", 400);
      }
      const minutes =
        asRecord.minutes === undefined || asRecord.minutes === null
          ? null
          : Number(asRecord.minutes);
      const existing = db.stretchLogs.find((e) => e.date === date);
      if (existing) {
        existing.itemsDone = itemsDone;
        existing.minutes = minutes;
        const entry = { ...existing };
        saveDb();
        return json({ entry }, 201);
      }
      db.seq.stretch += 1;
      const entry: StretchLog = {
        id: db.seq.stretch,
        date,
        itemsDone,
        minutes,
        createdAt: nowISO(),
      };
      db.stretchLogs.push(entry);
      saveDb();
      return json({ entry }, 201);
    }
  }

  // ---------- /api/progress ----------
  if (p[0] === "progress" && p.length === 1 && method === "GET") {
    // جلسات تکمیل‌شده با ست‌ها — پایهٔ PRها، حجم و روند هفتگی
    const completed = db.sessions
      .filter((s) => s.status === "completed")
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
      .slice(0, 400);

    const lastSessions = db.sessions
      .slice()
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
      .slice(0, 5)
      .map((s) => ({ id: s.id, date: s.date, dayId: s.dayId, status: s.status }));

    const stretchDays = db.stretchLogs.length;
    const lastWeightEntry = [...db.weightEntries].sort((a, b) =>
      b.date.localeCompare(a.date)
    )[0];

    // PRها: برای هر حرکت، بیشترین وزنه (با reps و تاریخ همان رکورد)
    const prMap = new Map<
      string,
      { exerciseId: string; weight: number; reps: number | null; date: string }
    >();
    for (const s of completed) {
      for (const set of s.sets) {
        if (set.skipped || set.weight == null) continue;
        const prev = prMap.get(set.exerciseId);
        const better =
          !prev ||
          set.weight > prev.weight ||
          (set.weight === prev.weight && (set.reps ?? 0) > (prev.reps ?? 0));
        if (better) {
          prMap.set(set.exerciseId, {
            exerciseId: set.exerciseId,
            weight: set.weight,
            reps: set.reps,
            date: s.date,
          });
        }
      }
    }
    const prs = Array.from(prMap.values()).sort((a, b) => b.weight - a.weight);

    // ۸ هفته اخیر: تعداد جلسات + حجم (وزنه × تکرار)
    const weeklyMap = new Map<string, { completedCount: number; volume: number }>();
    const today = todayISO();
    const [ty, tm, td] = today.split("-").map(Number);
    for (let i = 0; i < 8; i++) {
      const d = new Date(Date.UTC(ty, tm - 1, td) - i * 7 * 86400000);
      const key = getWeekKey(
        `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`
      );
      weeklyMap.set(key, { completedCount: 0, volume: 0 });
    }
    for (const s of completed) {
      const bucket = weeklyMap.get(getWeekKey(s.date));
      if (!bucket) continue;
      bucket.completedCount += 1;
      for (const set of s.sets) {
        if (set.skipped || set.weight == null || set.reps == null) continue;
        bucket.volume += set.weight * set.reps;
      }
    }
    const weekly = Array.from(weeklyMap.entries())
      .reverse()
      .map(([weekKey, v]) => ({ weekKey, ...v }));

    // جمع کل
    let totalSets = 0;
    let totalVolume = 0;
    for (const s of completed) {
      for (const set of s.sets) {
        if (set.skipped) continue;
        totalSets += 1;
        if (set.weight != null && set.reps != null) {
          totalVolume += set.weight * set.reps;
        }
      }
    }

    return json({
      prs,
      weekly,
      totals: {
        totalSessions: completed.length,
        totalSets,
        totalVolume,
      },
      lastSessions,
      stretchDays,
      lastWeight: lastWeightEntry
        ? { weight: lastWeightEntry.weight, date: lastWeightEntry.date }
        : null,
    });
  }

  // ---------- /api/export ----------
  if (p[0] === "export" && p.length === 1 && method === "GET") {
    return json({
      app: "fitness-dashboard",
      version: 1,
      exportedAt: nowISO(),
      data: {
        profile: db.profile ? [db.profile] : [],
        sessions: db.sessions
          .slice()
          .sort((a, b) => a.id - b.id)
          .map((s) => ({
            ...s,
            sets: [...s.sets].sort((a, b) => a.id - b.id),
          })),
        weightEntries: [...db.weightEntries].sort((a, b) =>
          a.date.localeCompare(b.date)
        ),
        workoutLogs: [...db.workoutLogs].sort((a, b) =>
          a.completedAt.localeCompare(b.completedAt)
        ),
        stretchLogs: [...db.stretchLogs].sort((a, b) =>
          a.date.localeCompare(b.date)
        ),
        bikeLogs: [...db.bikeLogs].sort((a, b) => a.date.localeCompare(b.date)),
      },
    });
  }

  // ---------- /api/data ----------
  if (p[0] === "data" && p.length === 1 && method === "DELETE") {
    const mode = params.get("mode") ?? "logs";
    if (mode !== "logs" && mode !== "all") {
      return errorJson("حالت نامعتبر — فقط logs یا all", 400);
    }
    const totalSetsCount = db.sessions.reduce((n, s) => n + s.sets.length, 0);
    const deleted = {
      sessions: db.sessions.length,
      sets: totalSetsCount,
      workoutLogs: db.workoutLogs.length,
      stretchLogs: db.stretchLogs.length,
      bikeLogs: db.bikeLogs.length,
      weightEntries: mode === "all" ? db.weightEntries.length : 0,
      profile: mode === "all" && db.profile ? 1 : 0,
    };
    db.sessions = [];
    db.workoutLogs = [];
    db.stretchLogs = [];
    db.bikeLogs = [];
    if (mode === "all") {
      db.weightEntries = [];
      db.profile = null;
    }
    saveDb();
    return json({ ok: true, mode, deleted });
  }

  // ---------- /api/bike-log ----------
  if (p[0] === "bike-log" && p.length === 1) {
    if (method === "GET") {
      const entries = [...db.bikeLogs]
        .sort(
          (a, b) =>
            b.date.localeCompare(a.date) ||
            b.createdAt.localeCompare(a.createdAt)
        )
        .slice(0, 200);
      return json({ entries });
    }
    if (method === "POST") {
      const date = asRecord.date as string;
      const slot = asRecord.slot as string;
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "") ||
        !["warmup", "liss", "recovery"].includes(slot)
      ) {
        return errorJson("داده نامعتبر است", 400);
      }
      db.seq.bike += 1;
      const entry: BikeLog = {
        id: db.seq.bike,
        date,
        slot,
        minutes:
          asRecord.minutes === undefined || asRecord.minutes === null
            ? null
            : Number(asRecord.minutes),
        note:
          asRecord.note === undefined || asRecord.note === null
            ? null
            : (asRecord.note as string),
        createdAt: nowISO(),
      };
      db.bikeLogs.push(entry);
      saveDb();
      return json({ entry }, 201);
    }
  }

  return errorJson("مسیر پیدا نشد", 404);
}

// ============================================================
// نصب شیم روی window.fetch
// ============================================================

let installed = false;

export function installStaticApi(): void {
  if (installed || typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== "1") return;
  installed = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    try {
      const rawUrl =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      const url = new URL(rawUrl, window.location.origin);
      let pathname = url.pathname;
      if (pathname.startsWith(BASE_PATH + "/")) {
        pathname = pathname.slice(BASE_PATH.length);
      }
      if (pathname === "/api" || pathname.startsWith("/api/")) {
        const method = (
          init?.method ??
          (typeof input === "object" && !(input instanceof URL)
            ? input.method
            : "GET") ??
          "GET"
        ).toUpperCase();

        let body: unknown = undefined;
        if (init?.body != null) {
          try {
            body =
              typeof init.body === "string"
                ? JSON.parse(init.body)
                : JSON.parse(await new Response(init.body).text());
          } catch {
            body = {};
          }
        }

        return await handleApi(method, pathname, url.searchParams, body);
      }
    } catch (err) {
      // خطای غیرمنتظره در شیم — پاسخ 500 مثل سرور
      console.error("staticApi error:", err);
      try {
        return errorJson("خطا در پردازش درخواست", 500);
      } catch {
        // ignore
      }
    }
    return originalFetch(input as RequestInfo, init);
  };
}
