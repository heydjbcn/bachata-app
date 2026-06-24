import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export function FeatureGrid() {
  const t = useTranslations("features");
  const items = t.raw("items") as string[];
  const body = t("body");
  return (
    <section id="features" className="bg-black py-20">
      <div className="container-x">
        <p className="text-center font-heading text-sm font-semibold uppercase tracking-[0.25em] text-[#ff914d]">
          {t("eyebrow")}
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-center font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
          {t("title")}{" "}
          <span className="text-gradient">{t("titleAccent")}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-white/55">
          {t("description")}
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((title, i) => (
            <article
              key={i}
              className="group flex flex-col rounded-2xl border border-white/8 bg-[#0c0c0c] p-6 transition-colors hover:border-[#ff914d]/40"
            >
              <span className="font-heading text-2xl font-bold text-[#ff914d]/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-heading text-lg font-semibold leading-snug text-white">
                {title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/50">
                {body}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff914d]">
                {t("learnMore")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
