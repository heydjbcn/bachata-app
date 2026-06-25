import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR, safeToken, safeFileName } from "@/lib/uploads";

// Sube UN fichero (stem) a UPLOAD_DIR/<token>/. Devuelve el id (nombre guardado).
export async function POST(request: Request) {
  const form = await request.formData();
  const token = safeToken(form.get("token"));
  const file = form.get("file");

  if (!token) {
    return NextResponse.json({ error: "invalid token" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }

  const stored = safeFileName(file.name);
  if (!stored) {
    return NextResponse.json({ error: "unsupported type" }, { status: 415 });
  }

  const dir = path.join(UPLOAD_DIR, token);
  await mkdir(dir, { recursive: true });

  // Evita colisiones si suben dos ficheros con el mismo nombre.
  let id = stored;
  const buf = Buffer.from(await file.arrayBuffer());
  try {
    await writeFile(path.join(dir, id), buf, { flag: "wx" });
  } catch {
    const ext = path.extname(stored);
    const base = path.basename(stored, ext);
    id = `${base}-${Date.now().toString(36)}${ext}`;
    await writeFile(path.join(dir, id), buf);
  }

  return NextResponse.json({ id, size: buf.length });
}
