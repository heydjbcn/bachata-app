"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FEATURES } from "@/lib/content";

export function FeatureCarousel() {
  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent className="-ml-4">
        {FEATURES.map((f, i) => (
          <CarouselItem
            key={i}
            className="pl-4 sm:basis-1/2 lg:basis-1/4"
          >
            <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
              <h3 className="font-heading text-lg font-bold leading-snug text-white">
                {f.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">
                {f.text}
              </p>
              <span className="mt-5 text-sm font-semibold text-accent-orange">
                Más información
              </span>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden border-white/15 bg-black/60 text-white hover:bg-black sm:flex" />
      <CarouselNext className="hidden border-white/15 bg-black/60 text-white hover:bg-black sm:flex" />
    </Carousel>
  );
}
