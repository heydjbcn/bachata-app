"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { LanguageSelector } from "@/components/site/LanguageSelector";
import { STORE_LINKS } from "@/lib/content";

const NAV = [
  { key: "features", href: "#features" },
  { key: "mixer", href: "#mixer" },
  { key: "musicians", href: "#musicians" },
  { key: "reviews", href: "#testimonials" },
] as const;

export function Header() {
  const t = useTranslations("header");

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Link href="/" aria-label="BachatAppStudio home" className="shrink-0">
          <Image
            src="/assets/Logo-Bachatappstudio.png"
            alt="BachatAppStudio"
            width={220}
            height={64}
            priority
            className="h-9 w-auto sm:h-10"
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
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#download"
            className="hidden rounded-full bg-gradient-to-r from-[#ff914d] to-[#ff7a3d] px-5 py-2.5 text-sm font-semibold text-black shadow-[0_8px_24px_-8px_rgba(255,145,77,0.7)] transition-transform hover:scale-[1.03] sm:inline-block"
          >
            {t("getApp")}
          </a>
          <LanguageSelector className="hidden sm:flex" />

          {/* mobile */}
          <Sheet>
            <SheetTrigger
              aria-label={t("openMenu")}
              className="rounded-md p-2 text-white transition-colors hover:text-accent-orange md:hidden"
            >
              <Menu className="size-7" strokeWidth={2.4} />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-l border-white/10 bg-black text-white"
            >
              <SheetHeader>
                <SheetTitle className="text-white">
                  <Image
                    src="/assets/Logo-Bachatappstudio.png"
                    alt="BachatAppStudio"
                    width={200}
                    height={56}
                    className="h-9 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={<a href={item.href} />}
                    className="rounded-md px-2 py-3 text-left text-lg font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-accent-orange"
                  >
                    {t(item.key)}
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3 px-4 pb-6">
                <div className="flex items-center gap-3">
                  <LanguageSelector />
                  <span className="text-sm text-white/50">
                    {t("changeLanguage")}
                  </span>
                </div>
                <SheetClose
                  render={<a href="#download" />}
                  className="rounded-full bg-gradient-to-r from-[#ff914d] to-[#ff7a3d] px-5 py-3 text-center text-sm font-semibold text-black"
                >
                  {t("getApp")}
                </SheetClose>
                <a
                  href={`mailto:${STORE_LINKS.email}`}
                  className="text-center text-sm text-white/50"
                >
                  {STORE_LINKS.email}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
