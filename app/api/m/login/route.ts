import { NextResponse } from "next/server";
import { findByEmail, publicMusician, findOrCreateApproved } from "@/lib/musicians";
import { verifyPassword, signToken } from "@/lib/musician-auth";
import { verifyCredentials } from "@/lib/admin";

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
  if (acc && verifyPassword(password, acc.passwordHash, acc.salt)) {
    if (!acc.approved) {
      return NextResponse.json({ error: "pending" }, { status: 403 });
    }
    return NextResponse.json({
      token: signToken(acc.id),
      musician: publicMusician(acc),
    });
  }

  // Las cuentas de admin también entran en la app (con su propio espacio).
  if (verifyCredentials(email, password)) {
    const name = email.includes("@") ? email.split("@")[0] : email;
    const m = await findOrCreateApproved(email, name, password);
    return NextResponse.json({
      token: signToken(m.id),
      musician: publicMusician(m),
    });
  }

  return NextResponse.json({ error: "invalid" }, { status: 401 });
}
