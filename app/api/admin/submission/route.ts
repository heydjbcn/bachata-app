import { NextResponse } from "next/server";
import { sessionFromRequest, setStatus, deleteSubmission } from "@/lib/admin";

export async function PATCH(request: Request) {
  const session = sessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: { token?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const status = body.status === "reviewed" ? "reviewed" : "new";
  const ok = await setStatus(String(body.token || ""), status, session.email);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true, status });
}

export async function DELETE(request: Request) {
  if (!sessionFromRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const ok = await deleteSubmission(String(body.token || ""));
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
