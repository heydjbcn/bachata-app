"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Archive,
  LogOut,
  Music2,
  Search,
  Globe,
  Users,
} from "lucide-react";
import { MusiciansPanel } from "@/components/admin/MusiciansPanel";

type FileMeta = { id?: string; name?: string; size?: number };
type Submission = {
  token: string;
  fullName: string;
  artisticName: string;
  email: string;
  genre: string;
  description: string;
  files: FileMeta[];
  submittedAt: string;
  status: "new" | "reviewed";
  reviewedAt?: string;
  reviewedBy?: string;
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

export function AdminDashboard({
  initial,
  email,
}: {
  initial: Submission[];
  email: string;
}) {
  const router = useRouter();
  const [view, setView] = useState<"web" | "musicians">("musicians");
  const [subs, setSubs] = useState<Submission[]>(initial);
  const [filter, setFilter] = useState<"all" | "new" | "reviewed">("all");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return subs.filter((s) => {
      if (filter !== "all" && s.status !== filter) return false;
      if (!needle) return true;
      return (
        s.artisticName.toLowerCase().includes(needle) ||
        s.fullName.toLowerCase().includes(needle) ||
        s.email.toLowerCase().includes(needle) ||
        s.genre.toLowerCase().includes(needle)
      );
    });
  }, [subs, filter, q]);

  const counts = useMemo(
    () => ({
      all: subs.length,
      new: subs.filter((s) => s.status === "new").length,
      reviewed: subs.filter((s) => s.status === "reviewed").length,
    }),
    [subs],
  );

  async function toggleReviewed(s: Submission) {
    const next = s.status === "reviewed" ? "new" : "reviewed";
    setBusy(s.token);
    try {
      const res = await fetch("/api/admin/submission", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: s.token, status: next }),
      });
      if (res.ok)
        setSubs((p) =>
          p.map((x) => (x.token === s.token ? { ...x, status: next } : x)),
        );
    } finally {
      setBusy(null);
    }
  }

  async function remove(s: Submission) {
    if (!confirm(`Borrar el envio de "${s.artisticName}" y sus stems?`)) return;
    setBusy(s.token);
    try {
      const res = await fetch("/api/admin/submission", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: s.token }),
      });
      if (res.ok) setSubs((p) => p.filter((x) => x.token !== s.token));
    } finally {
      setBusy(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const fileUrl = (token: string, name: string, download = false) =>
    `/api/admin/file?token=${encodeURIComponent(token)}&name=${encodeURIComponent(name)}${download ? "&download=1" : ""}`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">
            Stems recibidos
          </h1>
          <p className="mt-1 text-sm text-white/55">{email}</p>
        </div>
        <button
          onClick={logout}
          className="lg-glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white hover:scale-[1.03]"
        >
          <LogOut className="size-4" />
          Salir
        </button>
      </div>

      {/* conmutador Músicos (app) / Web (formulario) */}
      <div className="mt-6 flex gap-1.5">
        <button
          onClick={() => setView("musicians")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            view === "musicians"
              ? "bg-[#ff914d] text-black"
              : "border border-white/12 text-white/70 hover:text-white"
          }`}
        >
          <Users className="size-4" /> Musicos (app)
        </button>
        <button
          onClick={() => setView("web")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            view === "web"
              ? "bg-[#ff914d] text-black"
              : "border border-white/12 text-white/70 hover:text-white"
          }`}
        >
          <Globe className="size-4" /> Web (formulario)
        </button>
      </div>

      {view === "musicians" && <MusiciansPanel />}

      {view === "web" && (
        <>
      {/* filtros + buscador */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {(["all", "new", "reviewed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-[#ff914d] text-black"
                  : "border border-white/12 text-white/70 hover:text-white"
              }`}
            >
              {f === "all" ? "Todos" : f === "new" ? "Nuevos" : "Revisados"} (
              {counts[f]})
            </button>
          ))}
        </div>
        <div className="relative ml-auto min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar artista, email, genero..."
            className="w-full rounded-full border border-white/12 bg-white/[0.04] py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#ff914d]/60"
          />
        </div>
      </div>

      {/* lista */}
      <div className="mt-6 space-y-4">
        {visible.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-10 text-center text-sm text-white/45">
            No hay envios.
          </p>
        )}

        {visible.map((s) => (
          <article
            key={s.token}
            className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-xl font-bold text-white">
                    {s.artisticName || "(sin nombre)"}
                  </h2>
                  <span className="rounded-full border border-[#ff914d]/30 bg-[#ff914d]/10 px-2.5 py-0.5 text-xs font-medium text-[#ffb98a]">
                    {s.genre}
                  </span>
                  {s.status === "reviewed" && (
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                      Revisado
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-white/55">
                  {s.fullName} ·{" "}
                  <a
                    href={`mailto:${s.email}`}
                    className="text-[#ffb98a] hover:underline"
                  >
                    {s.email}
                  </a>{" "}
                  · {fmtDate(s.submittedAt)}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <a
                  href={`/api/admin/zip?token=${encodeURIComponent(s.token)}`}
                  className="lg-glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white hover:scale-[1.03]"
                >
                  <Archive className="size-3.5" />
                  Zip
                </a>
                <button
                  onClick={() => toggleReviewed(s)}
                  disabled={busy === s.token}
                  className="lg-glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white hover:scale-[1.03] disabled:opacity-50"
                >
                  {s.status === "reviewed" ? (
                    <>
                      <RotateCcw className="size-3.5" />
                      Marcar nuevo
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-3.5" />
                      Revisado
                    </>
                  )}
                </button>
                <button
                  onClick={() => remove(s)}
                  disabled={busy === s.token}
                  className="flex items-center gap-1.5 rounded-full border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 className="size-3.5" />
                  Borrar
                </button>
              </div>
            </div>

            {s.description && (
              <p className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm leading-relaxed text-white/65">
                {s.description}
              </p>
            )}

            {/* stems */}
            <div className="mt-4 space-y-2.5">
              {s.files.map((f, i) => {
                const name = f.name || f.id || `stem-${i + 1}`;
                const fname = f.id || f.name || "";
                return (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5"
                  >
                    <Music2 className="size-4 shrink-0 text-[#ff914d]" />
                    <span className="min-w-0 flex-1 truncate text-sm text-white">
                      {name}
                      {f.size ? (
                        <span className="text-white/40"> · {bytes(f.size)}</span>
                      ) : null}
                    </span>
                    <audio
                      controls
                      preload="none"
                      src={fileUrl(s.token, fname)}
                      className="h-9 w-full max-w-[260px] sm:w-[260px]"
                    />
                    <a
                      href={fileUrl(s.token, fname, true)}
                      className="lg-glass flex size-9 shrink-0 items-center justify-center rounded-full text-white hover:scale-[1.05]"
                      aria-label="Descargar"
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
        </>
      )}
    </main>
  );
}
