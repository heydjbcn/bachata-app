import path from "node:path";

// Directorio persistente para los envíos de artistas. Fuera de /opt/bachata
// (que se borra en cada deploy). Configurable por env; fallback local para dev.
export const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), ".artist-uploads");

const ALLOWED_EXT = [".wav", ".mp3"];

// Token sólo alfanumérico/guiones (lo genera el cliente con randomUUID).
export function safeToken(token: unknown): string | null {
  if (typeof token !== "string") return null;
  const clean = token.trim();
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(clean)) return null;
  return clean;
}

// Nombre de fichero seguro conservando la extensión permitida.
export function safeFileName(name: string): string | null {
  const ext = path.extname(name).toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) return null;
  const base = path
    .basename(name, ext)
    .replace(/[^A-Za-z0-9._-]+/g, "_")
    .slice(0, 80) || "stem";
  return base + ext;
}
