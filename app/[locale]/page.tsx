import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Layers, Volume2, Gauge } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Mixer } from "@/components/site/Mixer";
import { FeatureSplit } from "@/components/site/FeatureSplit";
import { FeatureGrid } from "@/components/site/FeatureGrid";
import { ArtistsCta } from "@/components/artists/ArtistsCta";
import { Musicians } from "@/components/site/Musicians";
import { Testimonials } from "@/components/site/Testimonials";
import { VideoBlock } from "@/components/site/VideoBlock";
import { CtaBand } from "@/components/site/CtaBand";
import { Footer } from "@/components/site/Footer";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent />;
}

function HomeContent() {
  const tm = useTranslations("mixer");
  const ta = useTranslations("appHeadline");
  const tc = useTranslations("cta");
  const highlights = tm.raw("highlights") as string[];
  const highlightIcons = [Layers, Volume2, Gauge];
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
                {tm("eyebrow")}
              </p>
              <h2 className="mt-3 font-heading text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
                {tm("title")}
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/55">
                {tm("description")}
              </p>
              <ul className="mt-8 space-y-4">
                {highlights.map((text, i) => {
                  const Icon = highlightIcons[i];
                  return (
                    <li key={i} className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#ff914d]/25 bg-[#ff914d]/10 text-[#ff914d]">
                        <Icon className="size-5" />
                      </span>
                      <span className="text-sm font-medium text-white/80">
                        {text}
                      </span>
                    </li>
                  );
                })}
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
              {ta("title")}{" "}
              <span className="text-gradient">{ta("accent")}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/55">
              {ta("text")}
            </p>
          </div>
        </section>

        <CtaBand
          id="download"
          heading={tc("downloadHeading")}
          subtitle={tc("downloadSubtitle")}
          badges
        />

        <ArtistsCta />
        <Musicians />

        <CtaBand
          heading={tc("readyHeading")}
          subtitle={tc("readySubtitle")}
          badges
        />

        <Testimonials />
        <VideoBlock />

        <CtaBand heading={tc("readyHeading")} subtitle={tc("readySubtitle")} />

        <Footer />
      </main>
    </>
  );
}
