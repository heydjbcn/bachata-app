import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "es", "fr", "it", "pt", "ko", "ja", "de"],
  defaultLocale: "en",
  // "always": cada idioma con prefijo (/en, /es…). El rewrite de "as-needed"
  // se rompe en el server standalone (bucle /→/en→/), así que "/" hace un
  // redirect limpio a /en. Inglés sigue siendo el idioma principal/por defecto.
  localePrefix: "always",
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
