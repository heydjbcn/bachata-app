import { createHmac, timingSafeEqual } from "node:crypto";
import { readdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR, safeToken } from "@/lib/uploads";

export const SESSION_COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 días

function secret(): string {
  return process.env.ADMIN_SECRET || "dev-insecure-secret-change-me";
}

// --- Cuentas (allowlist en env ADMIN_USERS="email:pass,email:pass") ---
function accounts(): Map<string, string> {
  const raw = process.env.ADMIN_USERS || "";
  const map = new Map<string, string>();
  for (const pair of raw.split(",")) {
    const i = pair.indexOf(":");
    if (i <= 0) continue;
    const email = pair.slice(0, i).trim().toLowerCase();
    const pass = pair.slice(i + 1);
    if (email && pass) map.set(email, pass);
  }
  return map;
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function verifyCredentials(email: string, password: string): boolean {
  const stored = accounts().get(String(email).trim().toLowerCase());
  if (!stored) return false;
  return safeEqual(stored, String(password));
}

// --- Sesión: <base64url(payload)>.<hmac> ---
function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function sign(data: string): string {
  return b64url(createHmac("sha256", secret()).update(data).digest());
}

export function signSession(email: string): string {
  const payload = b64url(
    Buffer.from(JSON.stringify({ email, exp: Date.now() + MAX_AGE * 1000 })),
  );
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token: string | undefined): { email: string } | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!safeEqual(sig, sign(payload))) return null;
  try {
    const data = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(),
    );
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    if (typeof data.email !== "string") return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

// Lee la cookie de sesión de una Request y la valida.
export function sessionFromRequest(request: Request): { email: string } | null {
  const cookie = request.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return verifySession(m ? decodeURIComponent(m[1]) : undefined);
}

export const cookieMaxAge = MAX_AGE;

// ---------------- Submissions (sobre UPLOAD_DIR) ----------------
export type Submission = {
  token: string;
  fullName: string;
  artisticName: string;
  email: string;
  genre: string;
  description: string;
  files: { id?: string; name?: string; size?: number }[];
  submittedAt: string;
  status: "new" | "reviewed";
  reviewedAt?: string;
  reviewedBy?: string;
};

export async function listSubmissions(): Promise<Submission[]> {
  let entries: import("node:fs").Dirent[];
  try {
    entries = await readdir(UPLOAD_DIR, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: Submission[] = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const token = safeToken(e.name);
    if (!token) continue;
    try {
      const raw = await readFile(path.join(UPLOAD_DIR, e.name, "meta.json"), "utf8");
      const m = JSON.parse(raw);
      out.push({
        token,
        fullName: m.fullName || "",
        artisticName: m.artisticName || "",
        email: m.email || "",
        genre: m.genre || "",
        description: m.description || "",
        files: Array.isArray(m.files) ? m.files : [],
        submittedAt: m.submittedAt || "",
        status: m.status === "reviewed" ? "reviewed" : "new",
        reviewedAt: m.reviewedAt,
        reviewedBy: m.reviewedBy,
      });
    } catch {
      // carpeta sin meta.json válido: se ignora
    }
  }
  out.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
  return out;
}

export async function setStatus(
  token: string,
  status: "new" | "reviewed",
  by: string,
): Promise<boolean> {
  const t = safeToken(token);
  if (!t) return false;
  const metaPath = path.join(UPLOAD_DIR, t, "meta.json");
  try {
    const m = JSON.parse(await readFile(metaPath, "utf8"));
    m.status = status;
    if (status === "reviewed") {
      m.reviewedAt = new Date().toISOString();
      m.reviewedBy = by;
    } else {
      delete m.reviewedAt;
      delete m.reviewedBy;
    }
    await writeFile(metaPath, JSON.stringify(m, null, 2));
    return true;
  } catch {
    return false;
  }
}

export async function deleteSubmission(token: string): Promise<boolean> {
  const t = safeToken(token);
  if (!t) return false;
  try {
    await rm(path.join(UPLOAD_DIR, t), { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}

// Ruta absoluta de un fichero del envío, validando token + nombre (anti-traversal).
export function resolveFile(token: string, name: string): string | null {
  const t = safeToken(token);
  if (!t) return null;
  const base = path.basename(name);
  if (!base || base !== name || base.includes("..")) return null;
  if (base === "meta.json") return null;
  return path.join(UPLOAD_DIR, t, base);
}
