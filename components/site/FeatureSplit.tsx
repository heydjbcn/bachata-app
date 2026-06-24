import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

export function FeatureSplit() {
  const t = useTranslations("featureSplit");
  const chips = t.raw("chips") as string[];
  return (
    <section className="bg-black py-16">
      <div className="container-x">
        <div className="card-dark grid items-center gap-8 overflow-hidden rounded-3xl p-8 md:grid-cols-2 md:p-12">
          <div className="relative flex justify-center">
            <div
              className="pointer-events-none absolute inset-0 glow-orange"
              aria-hidden
            />
            <Image
              src="/assets/Post-De-Instagram-Mockup-De-Telefono-Con-Promocion-Para-Negocios-Moderno-Negro-Y-Rojo.webp"
              alt="Hand holding phone with BachatAppStudio"
              width={420}
              height={508}
              className="relative w-[240px] drop-shadow-2xl sm:w-[280px]"
            />
          </div>
          <div>
            <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-[#ff914d]">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/60">
              {t("text")}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/80"
                >
                  <Check className="size-4 text-[#ff914d]" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
