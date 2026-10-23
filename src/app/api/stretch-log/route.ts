import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ باید YYYY-MM-DD باشد");

const createSchema = z.object({
  date: dateSchema,
  itemsDone: z.number().int().min(0).max(30),
  minutes: z.number().min(0).max(180).nullable().optional(),
});

// GET /api/stretch-log?date=YYYY-MM-DD — یک روز یا همه
export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date");
    if (date) {
      const parsedDate = dateSchema.safeParse(date);
      if (!parsedDate.success) {
        return NextResponse.json(
          { error: "فرمت تاریخ نامعتبر است" },
          { status: 400 }
        );
      }
      const entry = await db.stretchLog.findUnique({ where: { date } });
      return NextResponse.json({ entry: entry ?? null });
    }

    const entries = await db.stretchLog.findMany({
      orderBy: { date: "desc" },
      take: 365,
    });
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("GET /api/stretch-log error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت لاگ کشش" },
      { status: 500 }
    );
  }
}

// POST /api/stretch-log — ثبت/به‌روزرسانی کشش یک روز (upsert بر اساس date)
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

    const { date, itemsDone } = parsed.data;
    const minutes = parsed.data.minutes ?? null;

    const entry = await db.stretchLog.upsert({
      where: { date },
      update: { itemsDone, minutes },
      create: { date, itemsDone, minutes },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/stretch-log error:", error);
    return NextResponse.json({ error: "خطا در ثبت کشش" }, { status: 500 });
  }
}
