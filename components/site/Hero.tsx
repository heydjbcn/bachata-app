import { useTranslations } from "next-intl";
import { StoreBadges } from "@/components/site/StoreBadges";

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
        <div className="absolute left-[-6%] top-[-18%] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(255,145,77,0.16),transparent_62%)]" />
        <div className="absolute inset-0 dot-grid [mask-image:linear-gradient(to_right,#000,#000_28%,transparent_52%)]" />
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

          <StoreBadges variant="white" className="mt-8" />

          {/* stats */}
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className={i > 0 ? "border-l border-white/10 pl-10" : ""}
              >
                <p className="font-heading text-3xl font-bold text-white">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* derecha: vídeo en loop (composición original de la web) */}
        <div className="relative mx-auto w-full max-w-[480px]">
          <video
            className="w-full"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="BachatAppStudio"
          >
            <source src="/assets/hero-loop.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
