import { NextResponse } from "next/server";
import { requireApprovedMusicianId, listSongs, createSong } from "@/lib/musicians";

export async function GET(request: Request) {
  const id = await requireApprovedMusicianId(request);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ songs: await listSongs(id) });
}

export async function POST(request: Request) {
  const id = await requireApprovedMusicianId(request);
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: { title?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "title" }, { status: 400 });
  const song = await createSong(id, title);
  return NextResponse.json({ song });
}
