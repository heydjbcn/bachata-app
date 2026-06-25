import { mkdir, readdir, readFile, writeFile, rm } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/uploads";
import { hashPassword, musicianIdFromRequest } from "@/lib/musician-auth";

export const MUSICIANS_DIR = path.join(UPLOAD_DIR, "musicians");

// Extensiones de audio admitidas para stems (más amplio que el form web).
const AUDIO_EXT = [".wav", ".mp3", ".m4a", ".aac", ".flac", ".aiff", ".aif", ".ogg"];

export type Account = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  approved: boolean;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
};

export type Stem = {
  id: string;
  name: string; // nombre visible (custom o el del fichero)
  storedName: string; // nombre real en disco
  size: number;
  uploadedAt: string;
};

export type Song = {
  id: string;
  title: string;
  createdAt: string;
  stems: Stem[];
};

export type PublicMusician = {
  id: string;
  name: string;
  email: string;
  approved: boolean;
  createdAt: string;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function safeId(id: unknown): string | null {
  return typeof id === "string" && UUID_RE.test(id) ? id : null;
}

export function isAudio(name: string): boolean {
  return AUDIO_EXT.includes(path.extname(name).toLowerCase());
}

export function publicMusician(a: Account): PublicMusician {
  return {
    id: a.id,
    name: a.name,
    email: a.email,
    approved: a.approved,
    createdAt: a.createdAt,
  };
}

function accountPath(id: string) {
  return path.join(MUSICIANS_DIR, id, "account.json");
}

async function readAccount(id: string): Promise<Account | null> {
  try {
    return JSON.parse(await readFile(accountPath(id), "utf8"));
  } catch {
    return null;
  }
}

async function writeAccount(a: Account): Promise<void> {
  await mkdir(path.join(MUSICIANS_DIR, a.id), { recursive: true });
  await writeFile(accountPath(a.id), JSON.stringify(a, null, 2));
}

export async function getMusician(id: string | null): Promise<Account | null> {
  const sid = safeId(id);
  return sid ? readAccount(sid) : null;
}

// Auth de la app: devuelve el id del músico aprobado o null (401/403).
export async function requireApprovedMusicianId(
  request: Request,
): Promise<string | null> {
  const id = musicianIdFromRequest(request);
  const acc = id ? await readAccount(id) : null;
  return acc && acc.approved ? acc.id : null;
}

export async function findByEmail(email: string): Promise<Account | null> {
  const norm = email.trim().toLowerCase();
  let dirs: string[];
  try {
    dirs = await readdir(MUSICIANS_DIR);
  } catch {
    return null;
  }
  for (const d of dirs) {
    if (!safeId(d)) continue;
    const a = await readAccount(d);
    if (a && a.email === norm) return a;
  }
  return null;
}

export async function createMusician(
  name: string,
  email: string,
  password: string,
): Promise<{ ok: true; musician: Account } | { ok: false; error: string }> {
  const norm = email.trim().toLowerCase();
  if (await findByEmail(norm)) {
    return { ok: false, error: "email-taken" };
  }
  const { hash, salt } = hashPassword(password);
  const a: Account = {
    id: randomUUID(),
    name: name.trim().slice(0, 120),
    email: norm,
    passwordHash: hash,
    salt,
    approved: false,
    createdAt: new Date().toISOString(),
  };
  await writeAccount(a);
  return { ok: true, musician: a };
}

export async function setApproved(
  id: string,
  approved: boolean,
  by: string,
): Promise<boolean> {
  const a = await getMusician(id);
  if (!a) return false;
  a.approved = approved;
  if (approved) {
    a.approvedAt = new Date().toISOString();
    a.approvedBy = by;
  } else {
    delete a.approvedAt;
    delete a.approvedBy;
  }
  await writeAccount(a);
  return true;
}

export async function deleteMusician(id: string): Promise<boolean> {
  const sid = safeId(id);
  if (!sid) return false;
  try {
    await rm(path.join(MUSICIANS_DIR, sid), { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}

// ---------------- Songs ----------------
function songsDir(musicianId: string) {
  return path.join(MUSICIANS_DIR, musicianId, "songs");
}
function songPath(musicianId: string, songId: string) {
  return path.join(songsDir(musicianId), songId, "song.json");
}

async function readSong(musicianId: string, songId: string): Promise<Song | null> {
  try {
    return JSON.parse(await readFile(songPath(musicianId, songId), "utf8"));
  } catch {
    return null;
  }
}

async function writeSong(musicianId: string, song: Song): Promise<void> {
  await mkdir(path.join(songsDir(musicianId), song.id), { recursive: true });
  await writeFile(songPath(musicianId, song.id), JSON.stringify(song, null, 2));
}

export async function listSongs(musicianId: string): Promise<Song[]> {
  let dirs: string[];
  try {
    dirs = await readdir(songsDir(musicianId));
  } catch {
    return [];
  }
  const out: Song[] = [];
  for (const d of dirs) {
    if (!safeId(d)) continue;
    const s = await readSong(musicianId, d);
    if (s) out.push(s);
  }
  out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return out;
}

export async function createSong(musicianId: string, title: string): Promise<Song> {
  const song: Song = {
    id: randomUUID(),
    title: title.trim().slice(0, 160) || "Cancion",
    createdAt: new Date().toISOString(),
    stems: [],
  };
  await writeSong(musicianId, song);
  return song;
}

export async function getSong(musicianId: string, songId: string): Promise<Song | null> {
  const sid = safeId(songId);
  return sid ? readSong(musicianId, sid) : null;
}

export async function deleteSong(musicianId: string, songId: string): Promise<boolean> {
  const sid = safeId(songId);
  if (!sid) return false;
  try {
    await rm(path.join(songsDir(musicianId), sid), { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}

// ---------------- Stems ----------------
export async function addStem(
  musicianId: string,
  songId: string,
  file: File,
  displayName?: string,
): Promise<{ ok: true; stem: Stem } | { ok: false; error: string }> {
  const song = await getSong(musicianId, songId);
  if (!song) return { ok: false, error: "song-not-found" };
  if (!isAudio(file.name)) return { ok: false, error: "unsupported-type" };

  const safe = safeFileNameAudio(file.name);
  if (!safe) return { ok: false, error: "unsupported-type" };

  const dir = path.join(songsDir(musicianId), songId);
  await mkdir(dir, { recursive: true });

  // evita colisiones de nombre en disco
  let storedName = safe;
  const buf = Buffer.from(await file.arrayBuffer());
  try {
    await writeFile(path.join(dir, storedName), buf, { flag: "wx" });
  } catch {
    const ext = path.extname(safe);
    storedName = `${path.basename(safe, ext)}-${Date.now().toString(36)}${ext}`;
    await writeFile(path.join(dir, storedName), buf);
  }

  const stem: Stem = {
    id: randomUUID(),
    name: (displayName || "").trim().slice(0, 160) || file.name,
    storedName,
    size: buf.length,
    uploadedAt: new Date().toISOString(),
  };
  song.stems.push(stem);
  await writeSong(musicianId, song);
  return { ok: true, stem };
}

export async function renameStem(
  musicianId: string,
  songId: string,
  stemId: string,
  name: string,
): Promise<boolean> {
  const song = await getSong(musicianId, songId);
  if (!song) return false;
  const stem = song.stems.find((s) => s.id === stemId);
  if (!stem) return false;
  stem.name = name.trim().slice(0, 160) || stem.name;
  await writeSong(musicianId, song);
  return true;
}

export async function deleteStem(
  musicianId: string,
  songId: string,
  stemId: string,
): Promise<boolean> {
  const song = await getSong(musicianId, songId);
  if (!song) return false;
  const stem = song.stems.find((s) => s.id === stemId);
  if (!stem) return false;
  try {
    await rm(path.join(songsDir(musicianId), songId, stem.storedName), { force: true });
  } catch {
    // si el fichero ya no está, seguimos limpiando el registro
  }
  song.stems = song.stems.filter((s) => s.id !== stemId);
  await writeSong(musicianId, song);
  return true;
}

// Ruta absoluta de un stem en disco (admin: descarga/zip). Valida segmentos.
export function resolveStemPath(
  musicianId: string,
  songId: string,
  storedName: string,
): string | null {
  const mid = safeId(musicianId);
  const sid = safeId(songId);
  if (!mid || !sid) return null;
  const base = path.basename(storedName);
  if (!base || base !== storedName || base.includes("..")) return null;
  if (base === "song.json") return null;
  return path.join(songsDir(mid), sid, base);
}

// safeFileName de uploads solo admite wav/mp3; aquí ampliamos a audio.
function safeFileNameAudio(name: string): string | null {
  const ext = path.extname(name).toLowerCase();
  if (!AUDIO_EXT.includes(ext)) return null;
  const base =
    path.basename(name, ext).replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 80) || "stem";
  return base + ext;
}

// Para el panel admin: lista de músicos con sus canciones/stems.
export async function listMusiciansWithSongs(): Promise<
  (PublicMusician & { songs: Song[] })[]
> {
  let dirs: string[];
  try {
    dirs = await readdir(MUSICIANS_DIR);
  } catch {
    return [];
  }
  const out: (PublicMusician & { songs: Song[] })[] = [];
  for (const d of dirs) {
    if (!safeId(d)) continue;
    const a = await readAccount(d);
    if (!a) continue;
    out.push({ ...publicMusician(a), songs: await listSongs(d) });
  }
  out.sort((a, b) => {
    if (a.approved !== b.approved) return a.approved ? 1 : -1; // pendientes arriba
    return a.createdAt < b.createdAt ? 1 : -1;
  });
  return out;
}
