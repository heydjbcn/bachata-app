import { NextResponse } from "next/server";
import { findByEmail, publicMusician } from "@/lib/musicians";
import { verifyPassword, signToken } from "@/lib/musician-auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  const acc = await findByEmail(email);
  if (!acc || !verifyPassword(password, acc.passwordHash, acc.salt)) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
  if (!acc.approved) {
    return NextResponse.json({ error: "pending" }, { status: 403 });
  }
  return NextResponse.json({
    token: signToken(acc.id),
    musician: publicMusician(acc),
  });
}
