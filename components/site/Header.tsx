"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { NAV, STORE_LINKS } from "@/lib/content";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Link href="#top" aria-label="BachatAppStudio home" className="shrink-0">
          <Image
            src="/assets/Logo-Bachatappstudio.png"
            alt="BachatAppStudio"
            width={220}
            height={64}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        {/* nav pill centrada (desktop) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1.5 backdrop-blur md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#download"
            className="hidden rounded-full bg-gradient-to-r from-[#ff914d] to-[#ff7a3d] px-5 py-2.5 text-sm font-semibold text-black shadow-[0_8px_24px_-8px_rgba(255,145,77,0.7)] transition-transform hover:scale-[1.03] sm:inline-block"
          >
            Get the app
          </a>

          {/* mobile */}
          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className="rounded-md p-2 text-white transition-colors hover:text-accent-orange md:hidden"
            >
              <Menu className="size-7" strokeWidth={2.4} />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-l border-white/10 bg-black text-white"
            >
              <SheetHeader>
                <SheetTitle className="text-white">
                  <Image
                    src="/assets/Logo-Bachatappstudio.png"
                    alt="BachatAppStudio"
                    width={200}
                    height={56}
                    className="h-9 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={<a href={item.href} />}
                    className="rounded-md px-2 py-3 text-left text-lg font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-accent-orange"
                  >
                    {item.label}
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3 px-4 pb-6">
                <SheetClose
                  render={<a href="#download" />}
                  className="rounded-full bg-gradient-to-r from-[#ff914d] to-[#ff7a3d] px-5 py-3 text-center text-sm font-semibold text-black"
                >
                  Get the app
                </SheetClose>
                <a
                  href={`mailto:${STORE_LINKS.email}`}
                  className="text-center text-sm text-white/50"
                >
                  {STORE_LINKS.email}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
