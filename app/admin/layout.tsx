import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "../globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const oswald = Oswald({
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin · BachatAppStudio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full bg-black text-white font-sans">{children}</body>
    </html>
  );
}
