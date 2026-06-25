import { useTranslations } from "next-intl";

export function ArtistsHow() {
  const t = useTranslations("artists.how");
  const steps = t.raw("steps") as { title: string; text: string }[];
  return (
    <section id="how" className="bg-black py-20">
      <div className="container-x">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.25em] text-[#ff914d]">
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 max-w-3xl font-heading text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55">
          {t("lead")}
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={i} className="lg-card rounded-2xl p-6">
              <span className="flex size-11 items-center justify-center rounded-full border border-[#ff914d]/35 bg-[#ff914d]/10 font-heading text-lg font-bold text-[#ff914d]">
                {i + 1}
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold leading-snug text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
