import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const updateSchema = z
  .object({
    name: z.string().max(60).nullable().optional(),
    goal: z.enum(["muscle", "fatloss", "strength", "general"]).optional(),
    experience: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    daysPerWeek: z.number().int().min(1).max(7).optional(),
    equipment: z.enum(["gym", "home"]).optional(),
    limitations: z.string().max(500).nullable().optional(),
    weightKg: z.number().min(30).max(300).nullable().optional(),
    heightCm: z.number().min(80).max(250).nullable().optional(),
    units: z.enum(["metric", "imperial"]).optional(),
    reducedMotion: z.boolean().optional(),
    onboardingDone: z.boolean().optional(),
    weekSessionsGoal: z.number().int().min(1).max(7).optional(),
  })
  .strict();

// GET /api/profile — get-or-create پروفایل تک‌کاربره (id=1)
export async function GET() {
  try {
    const profile = await db.profile.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت پروفایل" },
      { status: 500 }
    );
  }
}

// PUT /api/profile — آپدیت فیلدهای ارسالی (partial)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "داده نامعتبر است", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // کلیدهای undefined را حذف کن تا روی مقدار فعلی اثری نگذارند
    const data = Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined)
    );

    const profile = await db.profile.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json({ error: "خطا در ذخیره پروفایل" }, { status: 500 });
  }
}
