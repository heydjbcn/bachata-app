import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArtistRegister } from "@/components/artists/ArtistRegister";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "artists.register" });
  return { title: `${t("title")} — BachatAppStudio`, robots: { index: false } };
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Header nav={[]} forArtists={false} />
      <main className="bg-black">
        <section className="relative overflow-hidden bg-black px-4 pb-24 pt-32">
          <div
            className="pointer-events-none absolute left-1/2 top-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,145,77,0.14),transparent_60%)]"
            aria-hidden
          />
          <div className="relative">
            <ArtistRegister />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
