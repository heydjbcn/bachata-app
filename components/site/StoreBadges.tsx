import Image from "next/image";
import { STORE_LINKS } from "@/lib/content";

export function StoreBadges({
  variant = "black",
  className = "",
}: {
  variant?: "black" | "white";
  className?: string;
}) {
  const appStore =
    variant === "white"
      ? "/assets/App-Store-IconW.png"
      : "/assets/App-Store-Icon.png";
  const googlePlay =
    variant === "white"
      ? "/assets/Google-Play-Iconw.png"
      : "/assets/Google-Play-Icon.png";

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
          src={appStore}
          alt="Download on the App Store"
          width={180}
          height={53}
          className="h-[52px] w-auto"
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
          src={googlePlay}
          alt="Get it on Google Play"
          width={180}
          height={53}
          className="h-[52px] w-auto"
        />
      </a>
    </div>
  );
}
