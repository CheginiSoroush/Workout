import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ باید YYYY-MM-DD باشد"),
  slot: z.enum(["warmup", "liss", "recovery"]),
  minutes: z.number().min(0).max(300).nullable().optional(),
  note: z.string().max(200).nullable().optional(),
});

// GET /api/bike-log — همه رکوردهای دوچرخه (جدیدترین اول)
export async function GET() {
  try {
    const entries = await db.bikeLog.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 200,
    });
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("GET /api/bike-log error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت لاگ دوچرخه" },
      { status: 500 }
    );
  }
}

// POST /api/bike-log — ثبت یک جایگاه دوچرخه
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

    const { date, slot } = parsed.data;
    const entry = await db.bikeLog.create({
      data: {
        date,
        slot,
        minutes: parsed.data.minutes ?? null,
        note: parsed.data.note ?? null,
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bike-log error:", error);
    return NextResponse.json({ error: "خطا در ثبت دوچرخه" }, { status: 500 });
  }
}
