import { NextResponse } from "next/server";
import { sessionFromRequest } from "@/lib/admin";
import { setApproved, deleteMusician } from "@/lib/musicians";

export async function PATCH(request: Request) {
  const session = sessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: { id?: string; approved?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const ok = await setApproved(String(body.id || ""), !!body.approved, session.email);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true, approved: !!body.approved });
}

export async function DELETE(request: Request) {
  if (!sessionFromRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const ok = await deleteMusician(String(body.id || ""));
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
