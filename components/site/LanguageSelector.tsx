"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { X } from "lucide-react";
import GB from "country-flag-icons/react/3x2/GB";
import ES from "country-flag-icons/react/3x2/ES";
import FR from "country-flag-icons/react/3x2/FR";
import IT from "country-flag-icons/react/3x2/IT";
import PT from "country-flag-icons/react/3x2/PT";
import KR from "country-flag-icons/react/3x2/KR";
import JP from "country-flag-icons/react/3x2/JP";
import DE from "country-flag-icons/react/3x2/DE";

type Locale = "en" | "es" | "fr" | "it" | "pt" | "ko" | "ja" | "de";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const languages: { code: Locale; name: string; Flag: React.ComponentType<any> }[] =
  [
    { code: "en", name: "English", Flag: GB },
    { code: "es", name: "Español", Flag: ES },
    { code: "fr", name: "Français", Flag: FR },
    { code: "it", name: "Italiano", Flag: IT },
    { code: "pt", name: "Português", Flag: PT },
    { code: "ko", name: "한국어", Flag: KR },
    { code: "ja", name: "日本語", Flag: JP },
    { code: "de", name: "Deutsch", Flag: DE },
  ];

export function LanguageSelector({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("header");
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [desktop, setDesktop] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // escape (ambos) + scroll lock (solo modal móvil)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) {
      window.addEventListener("keydown", onKey);
      if (!desktop) document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, desktop]);

  // click fuera (dropdown desktop)
  React.useEffect(() => {
    if (!open || !desktop) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open, desktop]);

  const current = languages.find((l) => l.code === locale) || languages[0];

  const change = (code: Locale) => {
    setOpen(false);
    if (code !== locale) router.replace(pathname, { locale: code });
  };

  if (!mounted) {
    return (
      <span
        className={`flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] ${className}`}
      >
        <span className="h-4 w-5 animate-pulse rounded-sm bg-white/20" />
      </span>
    );
  }

  return (
    <div ref={wrapRef} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("changeLanguage")}
        className="lg-glass flex size-9 items-center justify-center rounded-full"
      >
        <current.Flag className="h-4 w-5 rounded-sm shadow-sm" />
      </button>

      {/* DESKTOP: dropdown compacto */}
      {open && desktop && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right rounded-2xl border border-white/10 bg-black/85 p-1.5 shadow-2xl backdrop-blur-xl">
          {languages.map((lang) => {
            const active = lang.code === locale;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => change(lang.code)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? "bg-[#ff914d]/12 text-[#ff914d]"
                    : "text-white/85 hover:bg-white/[0.06]"
                }`}
              >
                <lang.Flag className="h-4 w-6 shrink-0 rounded-sm shadow-sm" />
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* MÓVIL: overlay grande */}
      {open &&
        !desktop &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="w-full max-w-md rounded-3xl border border-white/10 bg-black/70 p-5 shadow-2xl backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-white">
                  {t("changeLanguage")}
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="lg-glass flex size-9 items-center justify-center rounded-full text-white/70 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {languages.map((lang) => {
                  const active = lang.code === locale;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => change(lang.code)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left ${
                        active
                          ? "border border-[#ff914d]/50 bg-[#ff914d]/15 text-white shadow-[0_8px_24px_-10px_rgba(255,145,77,0.7)]"
                          : "lg-glass text-white/85"
                      }`}
                    >
                      <lang.Flag className="h-5 w-7 shrink-0 rounded-sm shadow-sm" />
                      <span className="text-base font-medium">{lang.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
