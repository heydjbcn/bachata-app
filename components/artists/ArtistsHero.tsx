import { useTranslations } from "next-intl";

export function ArtistsHero() {
  const t = useTranslations("artists.hero");
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-black pt-[72px]"
    >
      {/* fondo: glow naranja suave + rejilla de puntos (como la home) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-[-22%] h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,145,77,0.16),transparent_60%)]" />
        <div className="absolute inset-0 dot-grid [mask-image:radial-gradient(60%_60%_at_50%_30%,#000,transparent)]" />
      </div>

      <div className="container-x relative flex flex-col items-center pb-20 pt-16 text-center lg:pb-28 lg:pt-24">
        <span className="inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full border border-[#ff914d]/30 bg-[#ff914d]/10 px-3.5 py-1.5 text-[11px] font-medium text-[#ffb98a] sm:px-4 sm:text-sm">
          <span className="size-2 shrink-0 rounded-full bg-[#ff914d]" />
          <span className="truncate">{t("eyebrow")}</span>
        </span>

        <h1 className="mt-6 max-w-3xl font-heading text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {t("title")}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
          {t("lead")}
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#submission"
            className="lg-orange rounded-full px-7 py-3.5 text-base font-semibold text-black hover:scale-[1.03]"
          >
            {t("ctaUpload")}
          </a>
          <a
            href="#agreement"
            className="lg-glass rounded-full px-7 py-3.5 text-base font-semibold text-white hover:scale-[1.03]"
          >
            {t("ctaTerms")}
          </a>
        </div>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-white/45">
          {t("note")}
        </p>
      </div>
    </section>
  );
}
