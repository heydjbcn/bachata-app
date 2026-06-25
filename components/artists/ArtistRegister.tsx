"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { UserPlus, CheckCircle2, Smartphone } from "lucide-react";

export function ArtistRegister() {
  const t = useTranslations("artists.register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError(t("errName"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError(t("errEmail"));
    if (password.length < 6) return setError(t("errPassword"));
    setLoading(true);
    try {
      const res = await fetch("/api/m/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      if (res.status === 409) return setError(t("errTaken"));
      if (!res.ok) return setError(t("errGeneric"));
      setDone(true);
    } catch {
      setError(t("errGeneric"));
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-[#ff914d]/60 focus:bg-white/[0.06]";
  const label = "mb-1.5 block text-sm font-medium text-white/80";

  if (done) {
    return (
      <div className="lg-card mx-auto max-w-md rounded-3xl p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-[#ff914d]/40 bg-[#ff914d]/10 text-[#ff914d]">
          <CheckCircle2 className="size-7" />
        </span>
        <h2 className="mt-5 font-heading text-2xl font-bold text-white">
          {t("successTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/65">{t("success")}</p>
        <Link
          href="/artists/app"
          className="lg-orange mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black hover:scale-[1.03]"
        >
          <Smartphone className="size-4" />
          {t("toApp")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="lg-panel mx-auto max-w-md rounded-3xl p-7 sm:p-8">
      <h1 className="font-heading text-2xl font-bold text-white">{t("title")}</h1>
      <p className="mt-1.5 text-sm text-white/55">{t("subtitle")}</p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="r-name" className={label}>
            {t("name")}
          </label>
          <input id="r-name" value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder={t("namePlaceholder")} />
        </div>
        <div>
          <label htmlFor="r-email" className={label}>
            {t("email")}
          </label>
          <input id="r-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder={t("emailPlaceholder")} />
        </div>
        <div>
          <label htmlFor="r-password" className={label}>
            {t("password")}
          </label>
          <input id="r-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} placeholder={t("passwordPlaceholder")} />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="lg-orange mt-6 flex w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-semibold text-black hover:scale-[1.01] disabled:opacity-60"
      >
        <UserPlus className="size-5" />
        {loading ? t("submitting") : t("submit")}
      </button>

      <Link
        href="/artists/app"
        className="mt-4 block text-center text-sm text-[#ffb98a] hover:text-[#ff914d]"
      >
        {t("haveAccount")}
      </Link>
    </form>
  );
}
