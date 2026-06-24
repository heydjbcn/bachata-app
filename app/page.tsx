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
          <div className="container-x">
            <p className="text-center font-heading text-sm font-semibold uppercase tracking-[0.25em] text-[#ff914d]">
              Innovate · Inspire · Lead
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
              Play with the stems.
              <br />
              Adjust the speed.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-white/55">
              Adjust the volume of each instrument individually, highlighting
              the one you need during your classes. Go ahead — try the mixer.
            </p>
            <div className="mt-12">
              <Mixer />
            </div>
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
