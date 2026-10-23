import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  weight: z.number().min(30).max(300),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ باید YYYY-MM-DD باشد")
    .optional(),
  note: z.string().max(200).optional().nullable(),
});

// GET /api/weights — آخرین ۱۲۰ رکورد
export async function GET() {
  try {
    const entries = await db.weightEntry.findMany({
      orderBy: { date: "desc" },
      take: 120,
    });
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("GET /api/weights error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت داده‌های وزن" },
      { status: 500 }
    );
  }
}

// POST /api/weights — ثبت یا به‌روزرسانی وزن یک روز
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

    const { weight, note } = parsed.data;
    const date =
      parsed.data.date ?? new Date().toISOString().slice(0, 10);

    const entry = await db.weightEntry.upsert({
      where: { date },
      update: { weight, note: note ?? null },
      create: { weight, date, note: note ?? null },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/weights error:", error);
    return NextResponse.json(
      { error: "خطا در ثبت وزن" },
      { status: 500 }
    );
  }
}

// DELETE /api/weights?id=... — حذف یک رکورد
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "شناسه رکورد الزامی است" },
        { status: 400 }
      );
    }
    await db.weightEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/weights error:", error);
    return NextResponse.json(
      { error: "خطا در حذف رکورد" },
      { status: 500 }
    );
  }
}
