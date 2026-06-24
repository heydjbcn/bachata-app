import { useTranslations } from "next-intl";
import { StoreBadges } from "@/components/site/StoreBadges";
import { HeroVideoModal } from "@/components/site/HeroVideoModal";

export function Hero() {
  const t = useTranslations("hero");
  const stats = t.raw("stats") as { value: string; label: string }[];
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-black pt-[72px]"
    >
      {/* fondo moderno: glow naranja muy suave + rejilla de puntos, ambos
          desvanecidos antes del vídeo para que no reaparezca el rectángulo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {/* glow naranja a la derecha: grande y muy transparente */}
        <div className="absolute right-[-14%] top-[-28%] h-[1100px] w-[1100px] rounded-full bg-[radial-gradient(circle,rgba(255,145,77,0.14),transparent_60%)]" />
        {/* rejilla de puntos sutil (se desvanece hacia la derecha) */}
        <div className="absolute inset-0 dot-grid [mask-image:linear-gradient(to_right,#000,#000_35%,transparent_60%)]" />
      </div>
      <div className="container-x relative grid items-center gap-12 pb-20 pt-12 lg:grid-cols-2 lg:pb-28 lg:pt-20">
        {/* izquierda */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#ff914d]/30 bg-[#ff914d]/10 px-4 py-1.5 text-sm font-medium text-[#ffb98a]">
            <span className="size-2 rounded-full bg-[#ff914d]" />
            {t("badge")}
          </span>

          <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
            <br />
            <span className="text-gradient lowercase italic">
              {t("titleAccent")}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">
            {t("subtitle")}
          </p>

          <StoreBadges className="mt-8" />

          {/* stats */}
          <div className="mt-10 grid max-w-xl grid-cols-3">
            {stats.map((s, i) => (
              <div
                key={i}
                className={i > 0 ? "border-l border-white/10 pl-4 sm:pl-6" : ""}
              >
                <p className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs leading-snug text-white/50 sm:text-sm">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* derecha: vídeo en loop (composición original de la web). Bordes
            difuminados para fundirse con el fondo/glow (sin rectángulo). */}
        <div className="relative mx-auto w-full max-w-[480px]">
          <video
            className="w-full"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="BachatAppStudio"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent)",
              WebkitMaskComposite: "source-in",
              maskImage:
                "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent)",
              maskComposite: "intersect",
            }}
          >
            <source src="/assets/hero-loop.mp4" type="video/mp4" />
          </video>

          {/* play en el centro del aro → abre el vídeo grande */}
          <HeroVideoModal
            youtubeId="2OMBnbpg2fc"
            className="absolute left-[31%] top-[44%] z-20 size-14 -translate-x-1/2 -translate-y-1/2 sm:size-16"
          />
        </div>
      </div>
    </section>
  );
}
