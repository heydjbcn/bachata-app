import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 días (token de la app)

function secret(): string {
  return process.env.MUSICIAN_SECRET || "dev-insecure-musician-secret-change-me";
}

function b64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

// --- Password (scrypt, puro Node, sin dependencias nativas) ---
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPassword(
  password: string,
  hash: string,
  salt: string,
): boolean {
  if (!hash || !salt) return false;
  const calc = scryptSync(password, salt, 64).toString("hex");
  return safeEqual(calc, hash);
}

// --- Token Bearer: <base64url(payload)>.<hmac> ---
function sign(data: string): string {
  return b64url(createHmac("sha256", secret()).update(data).digest());
}

export function signToken(musicianId: string): string {
  const payload = b64url(
    Buffer.from(JSON.stringify({ id: musicianId, exp: Date.now() + MAX_AGE * 1000 })),
  );
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): { id: string } | null {
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
    if (typeof data.id !== "string") return null;
    return { id: data.id };
  } catch {
    return null;
  }
}

// Lee el Bearer de la Request y devuelve el musicianId si el token es válido.
export function musicianIdFromRequest(request: Request): string | null {
  const auth = request.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  const t = verifyToken(m ? m[1].trim() : undefined);
  return t ? t.id : null;
}
