import { NextResponse } from "next/server";
import { musicianIdFromRequest } from "@/lib/musician-auth";
import { getMusician, publicMusician } from "@/lib/musicians";

export async function GET(request: Request) {
  const id = musicianIdFromRequest(request);
  const acc = id ? await getMusician(id) : null;
  if (!acc) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ musician: publicMusician(acc) });
}
