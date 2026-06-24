import Image from "next/image";
import Link from "next/link";
import { STORE_LINKS } from "@/lib/content";

function Facebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function Twitter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.04l12.04 15.64Z" />
    </svg>
  );
}

function Youtube(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.8ZM9.6 15.57V8.43L15.82 12 9.6 15.57Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-black pb-10 pt-14 text-center">
      <div className="container-x flex flex-col items-center">
        <Image
          src="/assets/Logo-Bachatappstudio.png"
          alt="BachatAppStudio"
          width={240}
          height={70}
          className="h-14 w-auto"
        />
        <a
          href={`mailto:${STORE_LINKS.email}`}
          className="mt-5 font-heading text-lg font-bold text-accent-orange hover:underline"
        >
          {STORE_LINKS.email}
        </a>
        <p className="mt-2 text-sm text-white/60">
          The app for bachata masters
        </p>

        <div className="mt-6 flex items-center gap-5">
          <a
            href="#"
            aria-label="Facebook"
            className="text-white/70 transition-colors hover:text-accent-orange"
          >
            <Facebook className="size-5" />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="text-white/70 transition-colors hover:text-accent-orange"
          >
            <Twitter className="size-5" />
          </a>
          <a
            href="#"
            aria-label="Youtube"
            className="text-white/70 transition-colors hover:text-accent-orange"
          >
            <Youtube className="size-5" />
          </a>
        </div>

        <p className="mt-8 text-xs text-white/45">
          @2025 BachatAppStudio. All rights reserved. ·{" "}
          <Link href="/privacy-policy" className="hover:text-white/80">
            Privacy Policy
          </Link>{" "}
          ·{" "}
          <Link href="/terms-and-conditions" className="hover:text-white/80">
            Terms &amp; Conditions
          </Link>
        </p>
      </div>
    </footer>
  );
}
