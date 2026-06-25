import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { sessionFromRequest } from "@/lib/admin";
import { getMusician, getSong, resolveStemPath, safeId } from "@/lib/musicians";

export async function GET(request: Request) {
  if (!sessionFromRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const musician = safeId(url.searchParams.get("musician"));
  const songId = safeId(url.searchParams.get("song"));
  if (!musician || !songId) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const song = await getSong(musician, songId);
  if (!song || !song.stems.length) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const zip = new JSZip();
  const used = new Set<string>();
  for (const stem of song.stems) {
    const fp = resolveStemPath(musician, songId, stem.storedName);
    if (!fp) continue;
    // nombre dentro del zip: el visible, conservando extensión real
    const ext = path.extname(stem.storedName);
    let entry = stem.name.endsWith(ext) ? stem.name : stem.name + ext;
    entry = entry.replace(/[\/\\]/g, "_");
    while (used.has(entry)) entry = "_" + entry;
    used.add(entry);
    try {
      zip.file(entry, await readFile(fp));
    } catch {
      // fichero ausente: se omite
    }
  }
  const buf = await zip.generateAsync({ type: "nodebuffer", compression: "STORE" });

  const acc = await getMusician(musician);
  const base = (acc?.name || "stems").replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 40);
  const title = song.title.replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 40);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(buf.length),
      "Content-Disposition": `attachment; filename="${base}-${title}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
