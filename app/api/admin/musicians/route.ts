import { NextResponse } from "next/server";
import { sessionFromRequest } from "@/lib/admin";
import { listMusiciansWithSongs } from "@/lib/musicians";

export async function GET(request: Request) {
  if (!sessionFromRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ musicians: await listMusiciansWithSongs() });
}
