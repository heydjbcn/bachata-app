"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Play, X } from "lucide-react";

export function HeroVideoModal({
  youtubeId,
  className = "",
}: {
  youtubeId: string;
  className?: string;
}) {
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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Play video"
        className={`lg-glass group flex items-center justify-center rounded-full transition-transform hover:scale-110 ${className}`}
      >
        <Play className="size-7 translate-x-0.5 fill-white text-white sm:size-8" />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                role="dialog"
                aria-modal="true"
              >
                <motion.div
                  className="relative w-full max-w-4xl"
                  initial={{ scale: 0.6, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.7, opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 240, damping: 24 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="lg-glass absolute -top-12 right-0 flex size-11 items-center justify-center rounded-full text-white sm:-right-12 sm:top-0"
                  >
                    <X className="size-6" />
                  </button>
                  <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                    <iframe
                      className="size-full"
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                      title="BachatAppStudio"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
