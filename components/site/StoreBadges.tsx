import Image from "next/image";
import { useLocale } from "next-intl";
import { STORE_LINKS } from "@/lib/content";

// Badges oficiales localizados de Apple y Google (por idioma).
export function StoreBadges({ className = "" }: { className?: string }) {
  const locale = useLocale();

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={STORE_LINKS.appStore}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download on the App Store"
        className="transition-transform hover:scale-[1.03]"
      >
        <Image
          src={`/assets/badges/appstore-${locale}.svg`}
          alt="Download on the App Store"
          width={148}
          height={50}
          className="h-[44px] w-auto"
        />
      </a>
      <a
        href={STORE_LINKS.googlePlay}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get it on Google Play"
        className="transition-transform hover:scale-[1.03]"
      >
        <Image
          src={`/assets/badges/googleplay-${locale}.png`}
          alt="Get it on Google Play"
          width={155}
          height={60}
          className="h-[58px] w-auto"
        />
      </a>
    </div>
  );
}
