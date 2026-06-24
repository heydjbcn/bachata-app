"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Play, X } from "lucide-react";

export function VideoBlock() {
  const t = useTranslations("video");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section className="bg-black py-20">
      <div className="container-x">
        <h2 className="mx-auto max-w-2xl text-center font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
          {t("title")}
        </h2>

        {/* previsualización horizontal (como estaba) */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("play")}
          className="group relative mx-auto mt-12 block aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black"
        >
          <Image
            src="/assets/TEASER-CON-LOGO-BUENO-mp4-image.jpg"
            alt="It all started with a question — BachatAppStudio"
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover object-center"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
            <span className="lg-glass flex size-20 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <Play className="size-9 translate-x-0.5 fill-white text-white" />
            </span>
          </span>
        </button>
      </div>

      {/* reproducción en VERTICAL (modal expandible) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                role="dialog"
                aria-modal="true"
              >
                <motion.div
                  className="relative aspect-[9/16] h-[84vh] max-h-[84vh] max-w-full"
                  initial={{ scale: 0.7, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.75, opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 240, damping: 24 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="lg-glass absolute -top-12 right-0 z-10 flex size-11 items-center justify-center rounded-full text-white"
                  >
                    <X className="size-6" />
                  </button>
                  <video
                    className="size-full overflow-hidden rounded-2xl border border-white/10 bg-black object-contain shadow-2xl"
                    controls
                    autoPlay
                    playsInline
                    poster="/assets/TEASER-CON-LOGO-BUENO-mp4-image.jpg"
                  >
                    <source
                      src="/assets/TEASER-CON-LOGO-BUENO.mp4"
                      type="video/mp4"
                    />
                  </video>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
