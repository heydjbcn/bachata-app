import { NextResponse } from "next/server";
import { mkdir, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR, safeToken } from "@/lib/uploads";

type Body = {
  token?: string;
  fullName?: string;
  artisticName?: string;
  email?: string;
  genre?: string;
  description?: string;
  files?: { id?: string; name?: string; size?: number }[];
};

function clean(v: unknown, max = 500): string {
  return String(v ?? "").trim().slice(0, max);
}

async function notify(record: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ARTIST_NOTIFY_TO;
  const from = process.env.ARTIST_NOTIFY_FROM;
  if (!key || !to || !from) return; // email opcional: si no está configurado, se omite
  const files = (record.files as { name?: string }[]) || [];
  const html = `
    <h2>Nuevo envío de artista — BachatApp Studio</h2>
    <p><b>Nombre:</b> ${record.fullName}<br/>
    <b>Artista:</b> ${record.artisticName}<br/>
    <b>Email:</b> ${record.email}<br/>
    <b>Género:</b> ${record.genre}</p>
    <p><b>Descripción:</b><br/>${record.description}</p>
    <p><b>Stems (${files.length}):</b><br/>${files.map((f) => f.name).join("<br/>")}</p>
    <p><b>Carpeta:</b> ${record.token}</p>`;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Nuevo stem: ${record.artisticName} (${record.genre})`,
        html,
      }),
    });
  } catch {
    // no bloquea el envío
  }
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const token = safeToken(body.token);
  if (!token) {
    return NextResponse.json({ error: "invalid token" }, { status: 400 });
  }

  const fullName = clean(body.fullName, 120);
  const artisticName = clean(body.artisticName, 120);
  const email = clean(body.email, 160);
  const genre = clean(body.genre, 40);
  const description = clean(body.description, 4000);
  const files = Array.isArray(body.files)
    ? body.files
        .slice(0, 50)
        .map((f) => ({ id: clean(f.id, 120), name: clean(f.name, 200), size: Number(f.size) || 0 }))
        .filter((f) => f.id)
    : [];

  if (!fullName || !artisticName || !email || !genre || !description) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  if (!files.length) {
    return NextResponse.json({ error: "no files" }, { status: 400 });
  }

  const record = {
    token,
    fullName,
    artisticName,
    email,
    genre,
    description,
    files,
    submittedAt: new Date().toISOString(),
  };

  const dir = path.join(UPLOAD_DIR, token);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "meta.json"), JSON.stringify(record, null, 2));
  await appendFile(
    path.join(UPLOAD_DIR, "submissions.jsonl"),
    JSON.stringify(record) + "\n",
  );

  await notify(record);

  return NextResponse.json({ ok: true });
}
