import Image from "next/image";
import { MUSICIANS } from "@/lib/content";

export function Musicians() {
  return (
    <section id="musicians" className="bg-black py-20">
      <div className="container-x">
        <h2 className="mx-auto max-w-3xl text-center font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
          Trusted by professional musicians and dancers.{" "}
          <span className="text-gradient">Loved by thousands</span> around the
          world.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {MUSICIANS.map((m, i) => (
            <article
              key={i}
              className="overflow-hidden rounded-2xl border border-white/8 bg-[#0c0c0c] transition-colors hover:border-[#ff914d]/40"
            >
              <Image
                src={m.image}
                alt={`${m.role} — ${m.name}`}
                width={1280}
                height={720}
                className="h-auto w-full"
              />
              <div className="p-5">
                <p className="font-heading text-sm font-semibold uppercase tracking-wide text-[#ff914d]">
                  {m.role}
                </p>
                <h3 className="mt-1 font-heading text-xl font-bold text-white">
                  {m.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {m.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
