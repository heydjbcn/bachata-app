import { Layers, Volume2, Gauge } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Mixer } from "@/components/site/Mixer";
import { FeatureSplit } from "@/components/site/FeatureSplit";
import { FeatureGrid } from "@/components/site/FeatureGrid";
import { ChoiceCards } from "@/components/site/ChoiceCards";
import { Musicians } from "@/components/site/Musicians";
import { Testimonials } from "@/components/site/Testimonials";
import { VideoBlock } from "@/components/site/VideoBlock";
import { CtaBand } from "@/components/site/CtaBand";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-black">
        <Hero />
        <Marquee />

        {/* MIXER */}
        <section id="mixer" className="bg-black py-20">
          <div className="container-x grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-14">
            <div>
              <p className="font-heading text-sm font-semibold uppercase tracking-[0.25em] text-[#ff914d]">
                Innovate · Inspire · Lead
              </p>
              <h2 className="mt-3 font-heading text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
                Play with the stems. Adjust the speed.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/55">
                Adjust the volume of each instrument individually, highlighting
                the one you need during your classes. Go ahead — try the mixer.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: Layers, text: "6 real separated stems" },
                  { icon: Volume2, text: "Mute any instrument live" },
                  {
                    icon: Gauge,
                    text: "Speed 50–150% — pitch preserved",
                  },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#ff914d]/25 bg-[#ff914d]/10 text-[#ff914d]">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-sm font-medium text-white/80">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Mixer />
          </div>
        </section>

        <FeatureSplit />
        <FeatureGrid />

        {/* HEADLINE CENTRADO */}
        <section className="bg-black py-16 text-center">
          <div className="container-x">
            <h2 className="mx-auto max-w-3xl font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
              The app for bachata masters and students.{" "}
              <span className="text-gradient">Teach and learn bachata easy.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/55">
              Play with instruments, rhythms, timing, syncopations, speeds and
              counts — taking your knowledge and your students&apos; to the next
              level. The ultimate immersive practice experience powered by the
              best instructors and musicians of the genre.
            </p>
          </div>
        </section>

        <CtaBand
          id="download"
          heading="Professional tools accessible to every teacher and student."
          subtitle="DOWNLOAD IT FOR FREE TODAY!"
          badges
        />

        <ChoiceCards />
        <Musicians />

        <CtaBand
          heading="Are you ready to take your dancing to the next level?"
          subtitle="TRY IT FREE TODAY!"
          badges
        />

        <Testimonials />
        <VideoBlock />

        <CtaBand
          heading="Are you ready to take your dancing to the next level?"
          subtitle="TRY IT FREE TODAY!"
        />

        <Footer />
      </main>
    </>
  );
}
