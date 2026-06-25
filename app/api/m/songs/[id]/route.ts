import { NextResponse } from "next/server";
import { requireApprovedMusicianId, deleteSong } from "@/lib/musicians";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const mid = await requireApprovedMusicianId(request);
  if (!mid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const ok = await deleteSong(mid, id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
