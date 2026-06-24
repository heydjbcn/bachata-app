import Image from "next/image";
import { useTranslations } from "next-intl";
import { Music } from "lucide-react";
import { CHOICE_LOGOS } from "@/lib/content";

export function ChoiceCards() {
  const t = useTranslations("choice");
  const miniReviews = t.raw("miniReviews") as { title: string; text: string }[];
  return (
    <section className="bg-black py-20">
      <div className="container-x">
        <h2 className="text-center font-heading text-4xl font-bold text-white sm:text-5xl">
          {t("title")}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CHOICE_LOGOS.map((logo, i) => (
            <div key={i} className="text-center">
              <div className="overflow-hidden rounded-2xl border border-white/8">
                <Image
                  src={logo}
                  alt="BachatAppStudio logo"
                  width={735}
                  height={391}
                  className="h-auto w-full"
                />
              </div>
              <p className="mt-4 text-xs uppercase tracking-wide text-white/40">
                {t("year")}
              </p>
              <p className="mt-1 font-heading text-lg font-semibold text-white">
                {t("appName")}
              </p>
              <p className="mt-1 text-sm text-white/50">{t("tagline")}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {miniReviews.map((r, i) => (
            <div key={i}>
              <Music className="size-7 text-[#ff914d]" />
              <h3 className="mt-3 font-heading text-lg font-semibold text-white">
                {r.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {r.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
