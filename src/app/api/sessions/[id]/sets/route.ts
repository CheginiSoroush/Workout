import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createSetSchema = z.object({
  exerciseId: z.string().min(1).max(80),
  exerciseOrder: z.number().int().min(0).max(50),
  weight: z.number().min(0).max(500).nullable().optional(),
  reps: z.number().int().min(0).max(200).nullable().optional(),
  skipped: z.boolean().optional(),
});

// GET /api/sessions/[id]/sets — ست‌های جلسه
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionId = Number(id);
    if (!Number.isInteger(sessionId) || sessionId < 1) {
      return NextResponse.json({ error: "شناسه نامعتبر است" }, { status: 400 });
    }

    const session = await db.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      return NextResponse.json({ error: "جلسه پیدا نشد" }, { status: 404 });
    }

    const sets = await db.setEntry.findMany({
      where: { sessionId },
      orderBy: [{ exerciseOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ sets });
  } catch (error) {
    console.error("GET /api/sessions/[id]/sets error:", error);
    return NextResponse.json({ error: "خطا در دریافت ست‌ها" }, { status: 500 });
  }
}

// POST /api/sessions/[id]/sets — ثبت یک ست
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionId = Number(id);
    if (!Number.isInteger(sessionId) || sessionId < 1) {
      return NextResponse.json({ error: "شناسه نامعتبر است" }, { status: 400 });
    }

    const session = await db.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      return NextResponse.json({ error: "جلسه پیدا نشد" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = createSetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "داده نامعتبر است", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { exerciseId, exerciseOrder, weight, reps, skipped } = parsed.data;

    const set = await db.setEntry.create({
      data: {
        sessionId,
        exerciseId,
        exerciseOrder,
        weight: weight ?? null,
        reps: reps ?? null,
        skipped: skipped ?? false,
      },
    });

    return NextResponse.json({ set }, { status: 201 });
  } catch (error) {
    console.error("POST /api/sessions/[id]/sets error:", error);
    return NextResponse.json({ error: "خطا در ثبت ست" }, { status: 500 });
  }
}
