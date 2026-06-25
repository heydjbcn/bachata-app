"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LanguageSelector } from "@/components/site/LanguageSelector";
import { NAV } from "@/lib/content";

export function Header() {
  const t = useTranslations("header");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl md:border-transparent md:bg-transparent md:backdrop-blur-none">
      <div className="container-x flex h-[72px] items-center justify-between gap-3">
        <Link href="/" aria-label="BachatAppStudio home" className="shrink-0">
          <Image
            src="/assets/Logo-Bachatappstudio.png"
            alt="BachatAppStudio"
            width={220}
            height={64}
            priority
            className="h-9 w-auto md:h-14"
          />
        </Link>

        {/* nav pill centrada (desktop) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1.5 backdrop-blur md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/5 hover:text-white"
            >
              {t(item.key as "features" | "mixer" | "musicians" | "reviews")}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* enlace a artistas junto al botón de descarga (móvil y escritorio) */}
          <Link
            href="/artists"
            className="lg-ghost shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-white hover:scale-[1.03] sm:px-4"
          >
            {t("forArtists")}
          </Link>
          <a
            href="#download"
            className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-black hover:scale-[1.03] lg-orange sm:px-5 sm:py-2.5"
          >
            {t("getApp")}
          </a>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
