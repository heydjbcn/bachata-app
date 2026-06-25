import Image from "next/image";
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
            <article
              key={it.n}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#161616] to-[#0a0a0a] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff914d]/45 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_50px_-20px_rgba(255,145,77,0.55)]"
            >
              {/* blob de luz naranja (estilo del componente): crece y brilla al pasar el cursor */}
              <div
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[radial-gradient(circle,rgba(255,145,77,0.45),transparent_70%)] opacity-50 blur-2xl transition-all duration-500 group-hover:scale-[1.4] group-hover:opacity-100"
                aria-hidden
              />

              <div className="relative flex flex-1 flex-col">
                <span className="font-heading text-3xl font-bold text-gradient">
                  {it.n}
                </span>
                <h3 className="mt-3 font-heading text-xl font-bold leading-snug text-white">
                  {it.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {it.text}
                </p>
                <div className="mt-auto border-t border-white/8 pt-5">
                  <Image
                    src="/assets/Logo-Bachatappstudio.png"
                    alt="BachatAppStudio"
                    width={200}
                    height={53}
                    className="h-9 w-auto opacity-90"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
