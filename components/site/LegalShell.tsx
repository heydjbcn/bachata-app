import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";

export function LegalShell({
  title,
  effective,
  children,
}: {
  title: string;
  effective: string;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-black">
      <header className="border-b border-white/10">
        <div className="container-x flex items-center justify-between py-5">
          <Link href="/" aria-label="BachatAppStudio home">
            <Image
              src="/assets/Logo-Bachatappstudio.png"
              alt="BachatAppStudio"
              width={200}
              height={58}
              className="h-12 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-white/70 transition-colors hover:text-accent-orange"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <article className="container-x max-w-3xl py-14">
        <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-accent-orange">{effective}</p>
        <div className="legal-body mt-8 space-y-5 text-sm leading-relaxed text-white/70">
          {children}
        </div>
      </article>

      <Footer />
    </main>
  );
}
