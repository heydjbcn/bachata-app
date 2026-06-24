"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Music, ChevronLeft, ChevronRight } from "lucide-react";

export function FeatureGrid() {
  const t = useTranslations("features");
  const items = t.raw("items") as string[];
  const bodies = t.raw("bodies") as string[];
  const scroller = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("article");
    const amount = card ? card.clientWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section id="features" className="bg-black py-20">
      <div className="container-x">
        <p className="text-center font-heading text-sm font-semibold uppercase tracking-[0.25em] text-[#ff914d]">
          {t("eyebrow")}
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-center font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
          {t("title")} <span className="text-gradient">{t("titleAccent")}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-white/55">
          {t("description")}
        </p>
      </div>

      <div className="container-x mt-12">
        {/* fila con scroll horizontal nativo (trackpad / swipe / rueda) */}
        <div
          ref={scroller}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((title, i) => (
            <article
              key={i}
              className="flex min-h-[460px] w-[300px] shrink-0 snap-start flex-col rounded-3xl border border-white/8 bg-[#0c0c0c] p-7 sm:w-[340px]"
            >
              <Music className="size-9 text-[#ff914d]" />
              <h3 className="mt-5 font-heading text-xl font-bold leading-snug text-white">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/55">
                {bodies[i]}
              </p>
              <span className="mt-auto border-t border-white/8 pt-5 text-sm font-semibold text-[#ff914d]">
                {t("learnMore")}
              </span>
            </article>
          ))}
        </div>

        {/* flechas */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous"
            className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next"
            className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition-colors hover:bg-white/10"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
