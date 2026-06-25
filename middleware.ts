import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const ADMIN_HOSTS = ["appbachata.jmauri.com", "admin.bachatappstudio.com"];

export default function middleware(request: NextRequest) {
  const host = (request.headers.get("host") || "").split(":")[0];

  // El subdominio del panel "es" el panel: cualquier ruta que no sea /admin
  // (el matcher ya excluye /admin) redirige a /admin.
  if (ADMIN_HOSTS.includes(host)) {
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
