import Image from "next/image";
import { Gauge, BarChart3 } from "lucide-react";
import { StoreBadges } from "@/components/site/StoreBadges";
import { HERO_STATS } from "@/lib/content";

export function Hero() {
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
            Trusted by pro bachata dancers &amp; musicians
          </span>

          <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Teach and learn
            <br />
            bachata, the
            <br />
            <span className="text-gradient lowercase italic">easy way.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">
            Play with instruments, rhythms, syncopations, speeds and counts —
            taking your knowledge and your students&apos; to the next level. The
            ultimate immersive practice experience, powered by the best
            instructors and musicians of the genre.
          </p>

          <StoreBadges variant="white" className="mt-8" />

          {/* stats */}
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {HERO_STATS.map((s, i) => (
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

        {/* derecha: móvil + aro + chips */}
        <div className="relative mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center">
          <div
            className="absolute inset-[6%] rounded-full glow-orange"
            aria-hidden
          />
          <div
            className="absolute inset-0 rounded-full border border-dashed border-[#ff914d]/40"
            aria-hidden
          />

          <Image
            src="/assets/Post-De-Instagram-Mockup-De-Telefono-Con-Promocion-Para-Negocios-Moderno-Negro-Y-Rojo.webp"
            alt="BachatAppStudio app on a phone"
            width={520}
            height={628}
            priority
            className="relative z-10 w-[68%] drop-shadow-2xl"
          />

          {/* chip Speed */}
          <div className="absolute right-[2%] top-[12%] z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-[#141414]/90 px-3 py-2 backdrop-blur">
            <Gauge className="size-4 text-[#ff914d]" />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-wide text-white/50">
                Speed
              </p>
              <p className="font-heading text-base font-bold text-white">100%</p>
            </div>
          </div>

          {/* chip Live stems */}
          <div className="absolute bottom-[10%] left-0 z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-[#141414]/90 px-3 py-2 backdrop-blur">
            <BarChart3 className="size-4 text-[#ff914d]" />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-wide text-white/50">
                Live stems
              </p>
              <p className="font-heading text-base font-bold text-white">
                9 tracks
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
