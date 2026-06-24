"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";

export function VideoBlock() {
  const t = useTranslations("video");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play();
    setPlaying(true);
  };

  return (
    <section className="bg-black py-20">
      <div className="container-x">
        <h2 className="mx-auto max-w-2xl text-center font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
          {t("title")}
        </h2>

        <div className="group relative mx-auto mt-12 aspect-[16/10] max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black">
          <video
            ref={videoRef}
            className="size-full object-cover object-center"
            poster="/assets/TEASER-CON-LOGO-BUENO-mp4-image.jpg"
            controls={playing}
            playsInline
            preload="metadata"
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          >
            <source src="/assets/TEASER-CON-LOGO-BUENO.mp4" type="video/mp4" />
          </video>

          {!playing && (
            <button
              type="button"
              onClick={play}
              aria-label={t("play")}
              className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
            >
              <span className="flex size-20 items-center justify-center rounded-full bg-white/90 shadow-2xl transition-transform group-hover:scale-110">
                <Play className="size-9 translate-x-0.5 fill-black text-black" />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
