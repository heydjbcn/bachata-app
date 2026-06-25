import { useTranslations } from "next-intl";

export function ArtistsValue() {
  const t = useTranslations("artists.value");
  const items = t.raw("items") as { n: string; title: string; text: string }[];
  return (
    <section id="value" className="bg-black py-20">
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

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {items.map((it) => (
            <div key={it.n} className="lg-card rounded-2xl p-6">
              <span className="font-heading text-3xl font-bold text-gradient">
                {it.n}
              </span>
              <h3 className="mt-3 font-heading text-xl font-bold leading-snug text-white">
                {it.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {it.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
