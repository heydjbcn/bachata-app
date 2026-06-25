import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const ADMIN_HOST = "appbachata.jmauri.com";

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // El subdominio del panel "es" el panel: cualquier ruta que no sea /admin
  // (el matcher ya excluye /admin) redirige a /admin.
  if (host === ADMIN_HOST) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  // Excluye api, admin, _next, _vercel y ficheros con extensión.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
