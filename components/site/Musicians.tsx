import Image from "next/image";
import { useTranslations } from "next-intl";
import { MUSICIANS } from "@/lib/content";

export function Musicians() {
  const t = useTranslations("musicians");
  const roles = t.raw("roles") as string[];
  return (
    <section id="musicians" className="bg-black py-20">
      <div className="container-x">
        <h2 className="mx-auto max-w-3xl text-center font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
          {t("title")} <span className="text-gradient">{t("titleAccent")}</span>{" "}
          {t("titleAfter")}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {MUSICIANS.map((m, i) => (
            <article
              key={i}
              className="overflow-hidden rounded-2xl border border-white/8 bg-[#0c0c0c] transition-colors hover:border-[#ff914d]/40"
            >
              <Image
                src={m.image}
                alt={`${roles[i]} — ${m.name}`}
                width={1280}
                height={720}
                className="h-auto w-full"
              />
              <div className="p-5">
                <p className="font-heading text-sm font-semibold uppercase tracking-wide text-[#ff914d]">
                  {roles[i]}
                </p>
                <h3 className="mt-1 font-heading text-xl font-bold text-white">
                  {m.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {t("text")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
