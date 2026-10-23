import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/sessions/active — جلسه فعال + ست‌ها (یا null)
export async function GET() {
  try {
    const session = await db.session.findFirst({
      where: { status: "active" },
      orderBy: { startedAt: "desc" },
      include: {
        sets: { orderBy: [{ exerciseOrder: "asc" }, { createdAt: "asc" }] },
      },
    });

    return NextResponse.json({ session: session ?? null });
  } catch (error) {
    console.error("GET /api/sessions/active error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت جلسه فعال" },
      { status: 500 }
    );
  }
}
