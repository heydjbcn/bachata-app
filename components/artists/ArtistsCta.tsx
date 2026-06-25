import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

// Banda CTA en la home que sustituye a "La elección de los mejores":
// invita a los músicos a la página /artists.
export function ArtistsCta() {
  const t = useTranslations("artists.cta");
  return (
    <section className="bg-black py-16">
      <div className="container-x">
        <div className="lg-panel relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute left-1/2 top-[-40%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,145,77,0.25),transparent_65%)]"
            aria-hidden
          />
          <h2 className="relative mx-auto max-w-2xl font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="relative mt-4 font-heading text-base font-bold uppercase tracking-wide text-[#ffb98a]">
            {t("subtitle")}
          </p>
          <Link
            href="/artists"
            className="lg-orange relative mt-8 inline-block rounded-full px-8 py-3.5 text-base font-semibold text-black hover:scale-[1.03]"
          >
            {t("button")}
          </Link>
        </div>
      </div>
    </section>
  );
}
