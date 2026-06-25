import { NextResponse } from "next/server";
import { sessionFromRequest, listSubmissions } from "@/lib/admin";

export async function GET(request: Request) {
  if (!sessionFromRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const submissions = await listSubmissions();
  return NextResponse.json({ submissions });
}
