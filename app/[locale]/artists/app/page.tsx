import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { STUDIO_APP_LINKS } from "@/lib/content";
import { Apple, Smartphone, Download } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "artists.app" });
  return { title: `${t("title")} — BachatAppStudio`, robots: { index: false } };
}

export default async function AppPage({ params }: Props) {
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
          <div className="relative mx-auto max-w-2xl text-center">
            <AppContent />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function AppContent() {
  const t = useTranslations("artists.app");
  return (
    <>
      <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/60">
        {t("subtitle")}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <PlatformCard
          icon={<Apple className="size-7" />}
          label={t("ios")}
          href={STUDIO_APP_LINKS.ios}
          comingSoon={t("comingSoon")}
        />
        <PlatformCard
          icon={<Smartphone className="size-7" />}
          label={t("android")}
          href={STUDIO_APP_LINKS.android}
          comingSoon={t("comingSoon")}
        />
      </div>

      <p className="mt-8 text-sm text-white/45">{t("note")}</p>
      <Link
        href="/artists/register"
        className="mt-3 inline-block text-sm text-[#ffb98a] hover:text-[#ff914d]"
      >
        {t("needAccount")}
      </Link>
    </>
  );
}

function PlatformCard({
  icon,
  label,
  href,
  comingSoon,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  comingSoon: string;
}) {
  const inner = (
    <div className="lg-card flex flex-col items-center gap-3 rounded-2xl p-7">
      <span className="text-[#ff914d]">{icon}</span>
      <span className="font-heading text-lg font-bold text-white">{label}</span>
      {href ? (
        <span className="lg-orange flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold text-black">
          <Download className="size-4" />
          {label.includes("iOS") ? "App Store" : "APK"}
        </span>
      ) : (
        <span className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/50">
          {comingSoon}
        </span>
      )}
    </div>
  );
  return href ? (
    <a href={href} className="block transition-transform hover:scale-[1.02]">
      {inner}
    </a>
  ) : (
    inner
  );
}
