import { NextResponse } from "next/server";
import { createMusician } from "@/lib/musicians";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (name.length < 2) {
    return NextResponse.json({ error: "name" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "email" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "password" }, { status: 400 });
  }

  const res = await createMusician(name, email, password);
  if (!res.ok) {
    const status = res.error === "email-taken" ? 409 : 400;
    return NextResponse.json({ error: res.error }, { status });
  }
  // No devolvemos token: queda pendiente de aprobación.
  return NextResponse.json({ ok: true, pending: true });
}
