"use client";

import { useEffect, useState } from "react";
import {
  Download,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Archive,
  Music2,
  UserCheck,
  Clock,
  Mail,
} from "lucide-react";

type Stem = { id: string; name: string; storedName: string; size: number; uploadedAt: string };
type Song = { id: string; title: string; createdAt: string; stems: Stem[] };
type Musician = {
  id: string;
  name: string;
  email: string;
  approved: boolean;
  createdAt: string;
  songs: Song[];
};

function bytes(n?: number) {
  if (!n) return "";
  const u = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return (n / 1024 ** i).toFixed(i ? 1 : 0) + " " + u[i];
}
function fmtDate(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function MusiciansPanel() {
  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/musicians");
      if (res.ok) setMusicians((await res.json()).musicians || []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function approve(m: Musician, approved: boolean) {
    setBusy(m.id);
    try {
      const res = await fetch("/api/admin/musician", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: m.id, approved }),
      });
      if (res.ok)
        setMusicians((p) =>
          p.map((x) => (x.id === m.id ? { ...x, approved } : x)),
        );
    } finally {
      setBusy(null);
    }
  }

  async function removeMusician(m: Musician) {
    if (!confirm(`Borrar al musico "${m.name}" (${m.email}) y TODAS sus canciones?`)) return;
    setBusy(m.id);
    try {
      const res = await fetch("/api/admin/musician", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: m.id }),
      });
      if (res.ok) setMusicians((p) => p.filter((x) => x.id !== m.id));
    } finally {
      setBusy(null);
    }
  }

  const fileUrl = (mid: string, sid: string, name: string, dl = false) =>
    `/api/admin/m-file?musician=${mid}&song=${sid}&name=${encodeURIComponent(name)}${dl ? "&download=1" : ""}`;

  const pending = musicians.filter((m) => !m.approved).length;

  if (loading) {
    return <p className="mt-6 text-sm text-white/45">Cargando musicos...</p>;
  }
  if (!musicians.length) {
    return (
      <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-10 text-center text-sm text-white/45">
        Aun no hay musicos registrados.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {pending > 0 && (
        <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm text-amber-200">
          {pending} {pending === 1 ? "musico pendiente" : "musicos pendientes"} de aprobar.
        </p>
      )}

      {musicians.map((m) => (
        <article
          key={m.id}
          className={`rounded-2xl border bg-[#0c0c0c] p-5 sm:p-6 ${m.approved ? "border-white/10" : "border-amber-400/40"}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-xl font-bold text-white">{m.name}</h2>
                {m.approved ? (
                  <span className="flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                    <UserCheck className="size-3" /> Aprobado
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-200">
                    <Clock className="size-3" /> Pendiente
                  </span>
                )}
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-1 text-sm text-white/55">
                <Mail className="size-3.5" />
                <a href={`mailto:${m.email}`} className="text-[#ffb98a] hover:underline">
                  {m.email}
                </a>
                <span>· alta {fmtDate(m.createdAt)}</span>
                <span>· {m.songs.length} {m.songs.length === 1 ? "cancion" : "canciones"}</span>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                onClick={() => approve(m, !m.approved)}
                disabled={busy === m.id}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium hover:scale-[1.03] disabled:opacity-50 ${
                  m.approved
                    ? "lg-glass text-white"
                    : "bg-emerald-500 text-black"
                }`}
              >
                {m.approved ? (
                  <>
                    <RotateCcw className="size-3.5" /> Revocar
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" /> Aprobar
                  </>
                )}
              </button>
              <button
                onClick={() => removeMusician(m)}
                disabled={busy === m.id}
                className="flex items-center gap-1.5 rounded-full border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
              >
                <Trash2 className="size-3.5" /> Borrar
              </button>
            </div>
          </div>

          {/* canciones */}
          {m.songs.length > 0 && (
            <div className="mt-4 space-y-3">
              {m.songs.map((song) => (
                <div key={song.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-heading text-base font-bold text-white">
                      {song.title}
                      <span className="ml-2 text-xs font-normal text-white/40">
                        {song.stems.length} stems · {fmtDate(song.createdAt)}
                      </span>
                    </h3>
                    {song.stems.length > 0 && (
                      <a
                        href={`/api/admin/m-zip?musician=${m.id}&song=${song.id}`}
                        className="lg-glass flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white hover:scale-[1.03]"
                      >
                        <Archive className="size-3.5" /> Zip
                      </a>
                    )}
                  </div>
                  <div className="mt-3 space-y-2">
                    {song.stems.map((st) => (
                      <div
                        key={st.id}
                        className="flex flex-wrap items-center gap-3 rounded-lg border border-white/8 bg-black/30 px-3 py-2"
                      >
                        <Music2 className="size-4 shrink-0 text-[#ff914d]" />
                        <span className="min-w-0 flex-1 truncate text-sm text-white">
                          {st.name}
                          {st.size ? <span className="text-white/40"> · {bytes(st.size)}</span> : null}
                        </span>
                        <audio
                          controls
                          preload="none"
                          src={fileUrl(m.id, song.id, st.storedName)}
                          className="h-9 w-full max-w-[240px] sm:w-[240px]"
                        />
                        <a
                          href={fileUrl(m.id, song.id, st.storedName, true)}
                          className="lg-glass flex size-9 shrink-0 items-center justify-center rounded-full text-white hover:scale-[1.05]"
                          aria-label="Descargar"
                        >
                          <Download className="size-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
