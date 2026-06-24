import Image from "next/image";
import { Music, Play } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StoreBadges } from "@/components/site/StoreBadges";
import { CtaBand } from "@/components/site/CtaBand";
import { FeatureCarousel } from "@/components/site/FeatureCarousel";
import { TestimonialCarousel } from "@/components/site/TestimonialCarousel";
import { CHOICE_LOGOS, MINI_REVIEWS, MUSICIANS } from "@/lib/content";

export default function Home() {
  return (
    <main className="bg-black">
      {/* 1 - HERO */}
      <section className="relative overflow-hidden bg-black">
        <Header />
        <div className="container-x grid items-center gap-10 pb-16 pt-28 lg:grid-cols-2 lg:pb-24 lg:pt-36">
          <div>
            <h1 className="font-heading text-3xl font-black leading-[1.1] text-white sm:text-4xl lg:text-5xl">
              BachatAppStudio: The App for bachata masters and students,
              <br />
              teach and learn bachata easy.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
              Play with instruments, rhythms, syncopations speeds and counts,
              taking your knowledge and your students&apos; to the next level.
              Discover the ultimate immersive practice experience powered by the
              best dance instructors and musicians of the genre.
            </p>
            <StoreBadges variant="white" className="mt-8" />
          </div>

          <div className="relative flex justify-center">
            <div
              className="absolute aspect-square w-[78%] rounded-full bg-[#ff914d]/30 blur-[60px]"
              aria-hidden
            />
            <div
              className="absolute aspect-square w-[88%] rounded-full border-2 border-[#ff914d]/70"
              aria-hidden
            />
            <span
              className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 font-heading text-2xl font-bold italic text-[#ff914d] sm:text-3xl"
              aria-hidden
            >
              Teach &amp; learn easy
            </span>
            <Image
              src="/assets/Post-De-Instagram-Mockup-De-Telefono-Con-Promocion-Para-Negocios-Moderno-Negro-Y-Rojo.webp"
              alt="BachatAppStudio app on a phone"
              width={520}
              height={760}
              priority
              className="relative z-10 w-[230px] drop-shadow-2xl sm:w-[280px]"
            />
          </div>
        </div>
      </section>

      {/* 2 - BANNER */}
      <section className="bg-black py-16 text-center">
        <div className="container-x">
          <p className="font-heading text-sm font-bold tracking-[0.3em] text-accent-orange">
            INNOVATE. INSPIRE. LEAD
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold text-white sm:text-4xl">
            Play with the stems adjust the speed.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/55">
            Adjust the volume of each instrument individually, highlighting the
            one you need during your classes.
          </p>
        </div>
      </section>

      {/* 3 - FEATURE SPLIT */}
      <section className="bg-black pb-16">
        <div className="container-x">
          <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] p-8 md:grid-cols-2 md:p-12">
            <div className="flex justify-center">
              <Image
                src="/assets/Post-De-Instagram-Mockup-De-Telefono-Con-Promocion-Para-Negocios-Moderno-Negro-Y-Rojo.webp"
                alt="Hand holding a phone with BachatAppStudio"
                width={420}
                height={620}
                className="w-[220px] sm:w-[260px]"
              />
            </div>
            <div>
              <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-accent-orange">
                Master Bachata and Merengue with smart tools
              </p>
              <h2 className="mt-3 font-heading text-2xl font-extrabold leading-snug text-white sm:text-3xl">
                Adjust BPM, separate stems, and create unique.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                Teach and learn with precision and professionalism, backed by
                the world&apos;s top bachata dancers and musicians.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 - POWERED BY + FEATURES */}
      <section id="features" className="bg-black py-16">
        <div className="container-x">
          <h2 className="max-w-3xl font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Powered by Innovation, Perfected by Dancers and Professional Bachata
            Musicians.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/55">
            No more switching between apps or wasting time looking for ways to
            improve your classes. With BachatApp Studio, explore, adapt, and
            master Bachata with tools designed to let your learning and
            creativity flow without limits.
          </p>
          <div className="mt-10">
            <FeatureCarousel />
          </div>
        </div>
      </section>

      {/* 5 - REPEAT HEADLINE */}
      <section className="bg-black py-16 text-center">
        <div className="container-x">
          <h2 className="mx-auto max-w-3xl font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            BachatAppStudio: The App for bachata masters and students teach and
            learn bachata easy.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-white/55">
            Play with instruments, rhythms, timing, syncopations speeds and
            counts, taking your knowledge and your students&apos; to the next
            level. Discover the ultimate immersive practice experience powered
            by the best dance instructors and musicians of the genre.
          </p>
        </div>
      </section>

      {/* 6 - CTA DOWNLOAD */}
      <CtaBand
        id="download"
        heading="Professional tools accessible to every teacher and student."
        subtitle="!DOWNLOAD IT FOR FREE TODAY!"
        badges
      />

      {/* 7 - THE CHOICE OF THE BEST */}
      <section className="bg-black py-16">
        <div className="container-x">
          <h2 className="text-center font-heading text-3xl font-extrabold text-white sm:text-4xl">
            The choice of the best.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {CHOICE_LOGOS.map((logo, i) => (
              <div key={i} className="text-center">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src={logo}
                    alt="BachatAppStudio logo"
                    width={512}
                    height={272}
                    className="h-auto w-full"
                  />
                </div>
                <p className="mt-4 text-xs text-white/45">2022</p>
                <p className="mt-1 font-heading text-base font-bold text-white">
                  BachatAppStudio: The App
                </p>
                <p className="mt-1 text-sm text-white/50">
                  BachatAppStudio the app
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 - MINI REVIEWS */}
      <section className="bg-black pb-16">
        <div className="container-x grid gap-8 md:grid-cols-3">
          {MINI_REVIEWS.map((r, i) => (
            <div key={i}>
              <Music className="size-8 text-accent-orange" />
              <h3 className="mt-3 font-heading text-lg font-bold text-white">
                {r.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {r.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9 - MUSICIANS */}
      <section id="musicians" className="bg-black py-16">
        <div className="container-x">
          <h2 className="mx-auto max-w-3xl text-center font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Trusted by professional musicians and dancers. Loved by thousands of
            teachers and students around the world.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {MUSICIANS.map((m, i) => (
              <article
                key={i}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]"
              >
                <Image
                  src={m.image}
                  alt={`${m.role} - ${m.name}`}
                  width={1280}
                  height={720}
                  className="h-auto w-full"
                />
                <div className="p-5">
                  <p className="font-heading text-sm font-bold text-accent-orange">
                    {m.role}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-bold text-white">
                    {m.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    {m.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 10 - CTA */}
      <CtaBand
        heading="Are you ready to take your dancing to the next level?"
        subtitle="TRY IT FREE TODAY!"
        badges
      />

      {/* 11 - TESTIMONIALS */}
      <section id="testimonials" className="bg-black py-16">
        <div className="container-x">
          <h2 className="mx-auto max-w-3xl text-center font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Discover why thousands of bachata teachers and students love
            BachatApp Studio.
          </h2>
          <div className="mt-10">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* 12 - VIDEO (placeholder) */}
      <section className="bg-white py-20 text-center">
        <div className="container-x">
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-extrabold leading-tight text-[#1a1208] sm:text-4xl">
            Professional tools accessible to every teacher and student.
          </h2>
          <div className="mx-auto mt-10 flex aspect-video max-w-3xl items-center justify-center rounded-2xl bg-[#bdbdbd]">
            <span className="flex size-20 items-center justify-center rounded-full bg-white/80 shadow-lg">
              <Play className="size-9 translate-x-0.5 fill-[#1a1208] text-[#1a1208]" />
            </span>
          </div>
        </div>
      </section>

      {/* 13 - CTA */}
      <CtaBand
        heading="Are you ready to take your dancing to the next level?"
        subtitle="TRY IT FREE TODAY!"
      />

      {/* 14 - FOOTER */}
      <Footer />
    </main>
  );
}
