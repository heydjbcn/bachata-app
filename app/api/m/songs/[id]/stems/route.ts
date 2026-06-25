import { NextResponse } from "next/server";
import { requireApprovedMusicianId, addStem } from "@/lib/musicians";

// Sube UN stem (audio) a la canción. multipart: file + name? (nombre visible).
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const mid = await requireApprovedMusicianId(request);
  if (!mid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;

  const form = await request.formData();
  const file = form.get("file");
  const name = form.get("name");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }
  const res = await addStem(mid, id, file, typeof name === "string" ? name : undefined);
  if (!res.ok) {
    const status = res.error === "song-not-found" ? 404 : 415;
    return NextResponse.json({ error: res.error }, { status });
  }
  return NextResponse.json({ stem: res.stem });
}
