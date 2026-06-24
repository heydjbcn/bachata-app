"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Play, X } from "lucide-react";
import { MUSICIANS } from "@/lib/content";

export function Musicians() {
  const t = useTranslations("musicians");
  const roles = t.raw("roles") as string[];
  const [video, setVideo] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVideo(null);
    if (video) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [video]);

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
              <button
                type="button"
                onClick={() => setVideo(m.youtubeId)}
                aria-label={`${roles[i]} — ${m.name}`}
                className="group relative block w-full"
              >
                <Image
                  src={m.image}
                  alt={`${roles[i]} — ${m.name}`}
                  width={1280}
                  height={720}
                  className="h-auto w-full"
                />
                {/* play glassmorfismo */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-16 items-center justify-center rounded-full border border-white/40 bg-white/15 shadow-lg backdrop-blur-md transition-transform duration-200 group-hover:scale-110 group-hover:bg-white/25">
                    <Play className="size-7 translate-x-0.5 fill-white text-white" />
                  </span>
                </span>
              </button>
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

      {/* modal de vídeo */}
      {video && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setVideo(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            onClick={() => setVideo(null)}
          >
            <X className="size-6" />
          </button>
          <div
            className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="size-full"
              src={`https://www.youtube.com/embed/${video}?autoplay=1&rel=0&modestbranding=1`}
              title="BachatAppStudio"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
