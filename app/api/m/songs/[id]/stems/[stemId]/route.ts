import { NextResponse } from "next/server";
import { requireApprovedMusicianId, renameStem, deleteStem } from "@/lib/musicians";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; stemId: string }> },
) {
  const mid = await requireApprovedMusicianId(request);
  if (!mid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, stemId } = await params;
  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "name" }, { status: 400 });
  const ok = await renameStem(mid, id, stemId, name);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; stemId: string }> },
) {
  const mid = await requireApprovedMusicianId(request);
  if (!mid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, stemId } = await params;
  const ok = await deleteStem(mid, id, stemId);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
