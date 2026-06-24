import type { ReactNode } from "react";

// Layout raíz mínimo: el <html> vive en app/[locale]/layout.tsx (next-intl).
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
