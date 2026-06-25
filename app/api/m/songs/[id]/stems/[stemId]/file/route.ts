import { NextResponse } from "next/server";
import { stat, readFile } from "node:fs/promises";
import path from "node:path";
import { verifyToken, musicianIdFromRequest } from "@/lib/musician-auth";
import { getMusician, getSong, resolveStemPath } from "@/lib/musicians";

const TYPES: Record<string, string> = {
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4",
  ".aac": "audio/aac",
  ".flac": "audio/flac",
  ".aiff": "audio/aiff",
  ".aif": "audio/aiff",
  ".ogg": "audio/ogg",
};

// Stream del propio stem del musico para reproducir en la app (just_audio).
// Acepta Bearer header o ?token= (los reproductores van por URL).
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; stemId: string }> },
) {
  const url = new URL(request.url);
  const fromQuery = url.searchParams.get("token");
  const mid = musicianIdFromRequest(request) ?? verifyToken(fromQuery || undefined)?.id ?? null;
  const acc = mid ? await getMusician(mid) : null;
  if (!acc || !acc.approved) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, stemId } = await params;
  const song = await getSong(acc.id, id);
  const stem = song?.stems.find((s) => s.id === stemId);
  if (!stem) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const filePath = resolveStemPath(acc.id, id, stem.storedName);
  if (!filePath) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  try {
    await stat(filePath);
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const buf = await readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Content-Length": String(buf.length),
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store",
    },
  });
}
