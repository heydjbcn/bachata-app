import { ArrowRight } from "lucide-react";
import { FEATURES } from "@/lib/content";

export function FeatureGrid() {
  return (
    <section id="features" className="bg-black py-20">
      <div className="container-x">
        <p className="text-center font-heading text-sm font-semibold uppercase tracking-[0.25em] text-[#ff914d]">
          Powered by Innovation
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-center font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
          Perfected by dancers and{" "}
          <span className="text-gradient">professional bachata musicians.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-white/55">
          No more switching between apps or wasting time looking for ways to
          improve your classes. Explore, adapt, and master bachata with tools
          designed to let your creativity flow without limits.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.n}
              className="group flex flex-col rounded-2xl border border-white/8 bg-[#0c0c0c] p-6 transition-colors hover:border-[#ff914d]/40"
            >
              <span className="font-heading text-2xl font-bold text-[#ff914d]/80">
                {f.n}
              </span>
              <h3 className="mt-3 font-heading text-lg font-semibold leading-snug text-white">
                {f.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/50">
                {f.text}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff914d]">
                Learn more
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
