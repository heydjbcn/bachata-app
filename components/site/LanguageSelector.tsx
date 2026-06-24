"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  React.useEffect(() => setMounted(true), []);

  const current = languages.find((l) => l.code === locale) || languages[0];

  const change = (code: Locale) => router.replace(pathname, { locale: code });

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
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("changeLanguage")}
        className={`flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur transition-colors hover:bg-white/10 ${className}`}
      >
        <current.Flag className="h-4 w-5 rounded-sm shadow-sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 border-white/10 bg-black/90 text-white backdrop-blur-xl"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => change(lang.code)}
            className={`cursor-pointer focus:bg-white/10 focus:text-white ${
              locale === lang.code ? "text-[#ff914d]" : "text-white/80"
            }`}
          >
            <lang.Flag className="mr-3 h-4 w-5 rounded-sm shadow-sm" />
            <span>{lang.name}</span>
            {locale === lang.code && (
              <span className="ml-auto text-[#ff914d]">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
