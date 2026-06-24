import { useTranslations } from "next-intl";
import { StoreBadges } from "@/components/site/StoreBadges";

export function Hero() {
  const t = useTranslations("hero");
  const stats = t.raw("stats") as { value: string; label: string }[];
  return (
    <section
      id="top"
      className="dot-grid relative overflow-hidden bg-black pt-[72px]"
    >
      {/* glow ambiental */}
      <div
        className="pointer-events-none absolute right-[-10%] top-[-5%] h-[700px] w-[700px] glow-orange"
        aria-hidden
      />
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
