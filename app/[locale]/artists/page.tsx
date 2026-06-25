import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArtistsHero } from "@/components/artists/ArtistsHero";
import { ArtistsStats } from "@/components/artists/ArtistsStats";
import { ArtistsValue } from "@/components/artists/ArtistsValue";
import { ArtistsHow } from "@/components/artists/ArtistsHow";
import { ArtistForm } from "@/components/artists/ArtistForm";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "artists.metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function ArtistsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <main className="bg-black">
        <ArtistsHero />
        <ArtistsStats />
        <ArtistsValue />
        <ArtistsHow />

        <section id="submission" className="scroll-mt-20 bg-black pb-24 pt-4">
          <div className="mx-auto w-full max-w-[1180px] px-3 sm:px-5">
            <FormHeading />
            <div className="mt-10">
              <ArtistForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FormHeading() {
  const t = useTranslations("artists.form");
  const ta = useTranslations("artists");
  return (
    <div className="text-center">
      <p className="font-heading text-sm font-semibold uppercase tracking-[0.25em] text-[#ff914d]">
        {t("eyebrow")}
      </p>
      <h2 className="mt-3 font-heading text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
        {t("title")}
      </h2>
      <Link
        href="/artists/register"
        className="lg-ghost mt-6 inline-block rounded-full px-5 py-2.5 text-sm font-medium text-white hover:scale-[1.03]"
      >
        {ta("landingCta")}
      </Link>
    </div>
  );
}
