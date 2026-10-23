import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/sets/[id] — حذف یک ست ثبت‌شده
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const setId = Number(id);
    if (!Number.isInteger(setId) || setId < 1) {
      return NextResponse.json({ error: "شناسه نامعتبر است" }, { status: 400 });
    }

    const existing = await db.setEntry.findUnique({ where: { id: setId } });
    if (!existing) {
      return NextResponse.json({ error: "ست پیدا نشد" }, { status: 404 });
    }

    await db.setEntry.delete({ where: { id: setId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/sets/[id] error:", error);
    return NextResponse.json({ error: "خطا در حذف ست" }, { status: 500 });
  }
}
