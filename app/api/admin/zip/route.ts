import { NextResponse } from "next/server";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { sessionFromRequest, resolveFile } from "@/lib/admin";
import { UPLOAD_DIR, safeToken } from "@/lib/uploads";

export async function GET(request: Request) {
  if (!sessionFromRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const token = safeToken(url.searchParams.get("token"));
  if (!token) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  let names: string[];
  try {
    names = (await readdir(path.join(UPLOAD_DIR, token))).filter(
      (n) => n !== "meta.json",
    );
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!names.length) {
    return NextResponse.json({ error: "empty" }, { status: 404 });
  }

  const zip = new JSZip();
  for (const name of names) {
    const fp = resolveFile(token, name);
    if (fp) zip.file(name, await readFile(fp));
  }
  // Audio ya comprimido: STORE (sin compresión) para ir rápido.
  const buf = await zip.generateAsync({ type: "nodebuffer", compression: "STORE" });

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(buf.length),
      "Content-Disposition": `attachment; filename="stems-${token.slice(0, 8)}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
