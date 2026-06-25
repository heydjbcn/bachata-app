"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Music2, UploadCloud, X, CheckCircle2 } from "lucide-react";
import { ARTIST_GENRES } from "@/lib/content";

type FileItem = {
  key: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "done" | "error";
  id?: string;
};

const ACCEPT = [".wav", ".mp3"];
const BIG = 100 * 1024 * 1024; // ~100MB: aviso (límite de CF)

function bytes(n: number) {
  if (!n) return "0 B";
  const u = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return (n / 1024 ** i).toFixed(i ? 1 : 0) + " " + u[i];
}

function allowed(name: string) {
  return ACCEPT.some((x) => name.toLowerCase().endsWith(x));
}

export function ArtistForm() {
  const t = useTranslations("artists.form");
  const [token] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now()) + Math.round(Math.random() * 1e9),
  );

  const [files, setFiles] = useState<FileItem[]>([]);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function uploadOne(file: File, key: string) {
    const fd = new FormData();
    fd.append("token", token);
    fd.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/artist-upload");
    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const p = Math.round((e.loaded / e.total) * 100);
      setFiles((prev) =>
        prev.map((f) => (f.key === key ? { ...f, progress: p } : f)),
      );
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let id = "";
        try {
          id = JSON.parse(xhr.responseText).id;
        } catch {}
        setFiles((prev) =>
          prev.map((f) =>
            f.key === key ? { ...f, progress: 100, status: "done", id } : f,
          ),
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.key === key ? { ...f, status: "error" } : f)),
        );
        setError(t("errUpload"));
      }
    };
    xhr.onerror = () => {
      setFiles((prev) =>
        prev.map((f) => (f.key === key ? { ...f, status: "error" } : f)),
      );
      setError(t("errUpload"));
    };
    xhr.send(fd);
  }

  function handleFiles(list: FileList | null) {
    if (!list) return;
    setError("");
    Array.from(list).forEach((file) => {
      if (!allowed(file.name)) {
        setError(t("errType"));
        return;
      }
      if (file.size > BIG) setError(t("errBig"));
      const key = `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`;
      setFiles((prev) => [
        ...prev,
        { key, name: file.name, size: file.size, progress: 0, status: "uploading" },
      ]);
      uploadOne(file, key);
    });
  }

  function removeFile(key: string) {
    setFiles((prev) => prev.filter((f) => f.key !== key));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const form = formRef.current!;
    const data = new FormData(form);
    const fullName = String(data.get("fullName") || "").trim();
    const artisticName = String(data.get("artisticName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const genre = String(data.get("genre") || "");
    const description = String(data.get("description") || "").trim();
    const agree = data.get("agree") === "on";

    if (!fullName) return setError(t("errFullName"));
    if (!artisticName) return setError(t("errArtisticName"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError(t("errEmail"));
    if (!genre) return setError(t("errGenre"));
    if (!description) return setError(t("errDescription"));
    const done = files.filter((f) => f.status === "done" && f.id);
    if (!done.length) return setError(t("errFiles"));
    if (!agree) return setError(t("errAgree"));

    setSubmitting(true);
    try {
      const res = await fetch("/api/artist-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          fullName,
          artisticName,
          email,
          genre,
          description,
          files: done.map((f) => ({ id: f.id, name: f.name, size: f.size })),
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      setSuccess(true);
      form.reset();
      setFiles([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(t("errUpload"));
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    "w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-[#ff914d]/60 focus:bg-white/[0.06]";
  const label = "mb-1.5 block text-sm font-medium text-white/80";

  if (success) {
    return (
      <div className="lg-card mx-auto max-w-2xl rounded-3xl p-10 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-[#ff914d]/40 bg-[#ff914d]/10 text-[#ff914d]">
          <CheckCircle2 className="size-7" />
        </span>
        <p className="mt-5 text-base leading-relaxed text-white/85">
          {t("success")}
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="lg-panel mx-auto max-w-3xl rounded-3xl p-6 sm:p-9"
    >
      <h3 className="font-heading text-2xl font-bold text-white">
        {t("cardTitle")}
      </h3>
      <p className="mt-1.5 text-sm text-white/55">{t("cardSubtitle")}</p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={label}>
            {t("fullName")}
          </label>
          <input id="fullName" name="fullName" className={field} placeholder={t("fullNamePlaceholder")} />
        </div>
        <div>
          <label htmlFor="artisticName" className={label}>
            {t("artisticName")}
          </label>
          <input id="artisticName" name="artisticName" className={field} placeholder={t("artisticNamePlaceholder")} />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            {t("email")}
          </label>
          <input id="email" name="email" type="email" className={field} placeholder={t("emailPlaceholder")} />
        </div>
        <div>
          <label htmlFor="genre" className={label}>
            {t("genre")}
          </label>
          <select id="genre" name="genre" defaultValue="" className={`${field} appearance-none`}>
            <option value="" disabled>
              {t("genrePlaceholder")}
            </option>
            {ARTIST_GENRES.map((g) => (
              <option key={g} value={g} className="bg-[#1a1208] text-white">
                {t(`genres.${g}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="description" className={label}>
          {t("description")}
        </label>
        <textarea id="description" name="description" rows={4} className={field} placeholder={t("descriptionPlaceholder")} />
        <p className="mt-1.5 text-xs text-white/40">{t("descriptionTip")}</p>
      </div>

      {/* subida de stems */}
      <div className="mt-8">
        <h4 className="font-heading text-lg font-bold text-white">{t("uploadTitle")}</h4>
        <p className="mt-1 text-sm text-white/55">{t("uploadSubtitle")}</p>

        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            drag ? "border-[#ff914d] bg-[#ff914d]/10" : "border-white/15 bg-white/[0.02] hover:border-[#ff914d]/50"
          }`}
        >
          <UploadCloud className="size-8 text-[#ff914d]" />
          <span className="mt-3 font-medium text-white">{t("dropTitle")}</span>
          <span className="mt-1 text-sm text-white/45">{t("dropSubtitle")}</span>
          <input
            ref={inputRef}
            type="file"
            accept=".wav,.mp3,audio/wav,audio/mpeg"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>

        {files.length > 0 && (
          <ul className="mt-4 space-y-2.5">
            {files.map((f) => (
              <li key={f.key} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-3">
                  <Music2 className="size-4 shrink-0 text-[#ff914d]" />
                  <span className="min-w-0 flex-1 truncate text-sm text-white">{f.name}</span>
                  <span className="shrink-0 text-xs text-white/45">
                    {f.status === "done"
                      ? t("ready")
                      : f.status === "error"
                        ? "—"
                        : `${f.progress}%`}{" "}
                    · {bytes(f.size)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(f.key)}
                    aria-label="Remove"
                    className="shrink-0 text-white/40 hover:text-white"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${f.status === "error" ? "bg-red-500" : "bg-[#ff914d]"}`}
                    style={{ width: `${f.status === "error" ? 100 : f.progress}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* acuerdo de derechos */}
      <div id="agreement" className="mt-8 scroll-mt-24">
        <h4 className="font-heading text-lg font-bold text-white">{t("agreementTitle")}</h4>
        <p className="mt-1 text-sm text-white/55">{t("agreementSubtitle")}</p>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm leading-relaxed text-white/65">
          <p className="font-heading font-bold text-white">{t("agreementHeading")}</p>
          <p className="mt-3">{t("agreementP1")}</p>
          <p className="mt-3">{t("agreementP2")}</p>
          <p className="mt-3 font-medium text-white/80">{t("agreementUsersTitle")}</p>
          <ul className="mt-2 space-y-1.5">
            {(t.raw("agreementBullets") as string[]).map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#ff914d]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">{t("agreementP3")}</p>
          <p className="mt-3">{t("agreementP4")}</p>
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-white/75">
          <input
            type="checkbox"
            name="agree"
            className="mt-0.5 size-4 shrink-0 accent-[#ff914d]"
          />
          <span>{t("agree")}</span>
        </label>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="lg-orange mt-7 w-full rounded-full px-7 py-3.5 text-base font-semibold text-black hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100 sm:w-auto sm:px-10"
      >
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
