"use client";

import { useTranslations } from "next-intl";
import { Music } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function FeatureGrid() {
  const t = useTranslations("features");
  const items = t.raw("items") as string[];
  const bodies = t.raw("bodies") as string[];

  return (
    <section id="features" className="overflow-hidden bg-black py-20">
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
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-5">
            {items.map((title, i) => (
              <CarouselItem
                key={i}
                className="pl-5 basis-[86%] sm:basis-[55%] lg:basis-[34%] xl:basis-[31%]"
              >
                <article className="flex h-full min-h-[460px] flex-col rounded-3xl border border-white/8 bg-[#0c0c0c] p-7">
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
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-8 flex items-center justify-center gap-3">
            <CarouselPrevious className="static translate-y-0 border-white/15 bg-white/[0.03] text-white hover:bg-white/10" />
            <CarouselNext className="static translate-y-0 border-white/15 bg-white/[0.03] text-white hover:bg-white/10" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
