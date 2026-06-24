import Image from "next/image";
import { Play } from "lucide-react";

export function VideoBlock() {
  return (
    <section className="bg-black py-20">
      <div className="container-x">
        <h2 className="mx-auto max-w-2xl text-center font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
          Professional tools accessible to every teacher and student.
        </h2>

        <div className="group relative mx-auto mt-12 aspect-[16/10] max-w-4xl overflow-hidden rounded-3xl border border-white/10">
          <Image
            src="/assets/TEASER-CON-LOGO-BUENO-mp4-image.jpg"
            alt="It all started with a question — BachatAppStudio"
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
          <button
            type="button"
            aria-label="Play video"
            className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-2xl transition-transform group-hover:scale-110"
          >
            <Play className="size-9 translate-x-0.5 fill-black text-black" />
          </button>
        </div>
      </div>
    </section>
  );
}
