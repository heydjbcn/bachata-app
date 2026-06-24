"use client";

import { Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TESTIMONIALS } from "@/lib/content";

export function TestimonialCarousel() {
  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent className="-ml-4">
        {TESTIMONIALS.map((t, i) => (
          <CarouselItem key={i} className="pl-4 sm:basis-1/2 lg:basis-1/3">
            <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
              <Quote
                className="size-9 fill-accent-orange text-accent-orange"
                aria-hidden
              />
              <h3 className="mt-3 font-heading text-lg font-bold text-white">
                {t.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">
                {t.text}
              </p>
              <span className="mt-5 text-sm text-accent-orange">{t.origin}</span>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden border-white/15 bg-black/60 text-white hover:bg-black sm:flex" />
      <CarouselNext className="hidden border-white/15 bg-black/60 text-white hover:bg-black sm:flex" />
    </Carousel>
  );
}
