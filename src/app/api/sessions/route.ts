import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { todayISO } from "@/lib/fa";

const SESSION_STATUSES = ["active", "completed", "partial", "abandoned"] as const;
const DAY_IDS = ["day1", "day2", "day3"] as const;

const querySchema = z.object({
  status: z.enum(SESSION_STATUSES).optional(),
  dayId: z.enum(DAY_IDS).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const createSchema = z.object({
  dayId: z.enum(DAY_IDS),
});

// GET /api/sessions?status=completed&dayId=day1&limit=10
// لیست جلسات (جدیدترین اول) به‌همراه ست‌ها
export async function GET(request: NextRequest) {
  try {
    const parsed = querySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams)
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "پارامترهای جستجو نامعتبر است", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const sessions = await db.session.findMany({
      where: {
        status: parsed.data.status,
        dayId: parsed.data.dayId,
      },
      include: { sets: { orderBy: [{ exerciseOrder: "asc" }, { createdAt: "asc" }] } },
      orderBy: { startedAt: "desc" },
      take: parsed.data.limit ?? 30,
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("GET /api/sessions error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت جلسات" },
      { status: 500 }
    );
  }
}

// POST /api/sessions { dayId } — شروع جلسه
// اگر جلسه active موجود باشد همان برگردانده می‌شود (بدون دوباره‌سازی)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "داده نامعتبر است", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.session.findFirst({
      where: { status: "active" },
      orderBy: { startedAt: "desc" },
      include: { sets: true },
    });
    if (existing) {
      return NextResponse.json({ session: existing, created: false });
    }

    const session = await db.session.create({
      data: {
        date: todayISO(),
        dayId: parsed.data.dayId,
        status: "active",
      },
      include: { sets: true },
    });

    return NextResponse.json({ session, created: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/sessions error:", error);
    return NextResponse.json({ error: "خطا در شروع جلسه" }, { status: 500 });
  }
}
