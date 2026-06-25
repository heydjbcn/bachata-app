import { NextResponse } from "next/server";
import { stat, readFile } from "node:fs/promises";
import path from "node:path";
import { sessionFromRequest, resolveFile } from "@/lib/admin";

const TYPES: Record<string, string> = {
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

export async function GET(request: Request) {
  if (!sessionFromRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const name = url.searchParams.get("name") || "";
  const download = url.searchParams.get("download") === "1";

  const filePath = resolveFile(token, name);
  if (!filePath) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  try {
    await stat(filePath);
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const buf = await readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const headers = new Headers({
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Content-Length": String(buf.length),
    "Cache-Control": "private, no-store",
  });
  if (download) {
    headers.set("Content-Disposition", `attachment; filename="${path.basename(filePath)}"`);
  }
  return new NextResponse(new Uint8Array(buf), { headers });
}
