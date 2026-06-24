"use client";

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
import { StoreBadges } from "@/components/site/StoreBadges";

const NAV = [
  { label: "Features", href: "#features" },
  { label: "Musicians", href: "#musicians" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Download", href: "#download" },
];

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="container-x flex items-center justify-between py-5">
        <Link href="/" aria-label="BachatAppStudio home">
          <Image
            src="/assets/Logo-Bachatappstudio.png"
            alt="BachatAppStudio"
            width={220}
            height={64}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <Sheet>
          <SheetTrigger
            aria-label="Open menu"
            className="rounded-md p-2 text-white transition-colors hover:text-accent-orange"
          >
            <Menu className="size-8" strokeWidth={2.5} />
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
                  className="h-10 w-auto"
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
            <div className="mt-auto px-4 pb-6">
              <StoreBadges variant="black" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
