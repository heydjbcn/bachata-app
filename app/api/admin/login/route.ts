import { NextResponse } from "next/server";
import { verifyCredentials, signSession, SESSION_COOKIE, cookieMaxAge } from "@/lib/admin";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!verifyCredentials(email, password)) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
  // secure solo si la petición llega por https (en prod, CF pone
  // x-forwarded-proto: https; en local http no, para poder probar).
  const proto =
    request.headers.get("x-forwarded-proto") || new URL(request.url).protocol;
  const secure = proto.startsWith("https");

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, signSession(email), {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: cookieMaxAge,
  });
  return res;
}
