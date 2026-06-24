import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LANGS = ["en", "es"];
const DEFAULT_LANG = "es";
const COOKIE_NAME = "lang";

function getPreferredLang(request: NextRequest): string {
  // 1. Cookie takes priority
  const cookieLang = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLang && SUPPORTED_LANGS.includes(cookieLang)) return cookieLang;

  // 2. Accept-Language header
  const acceptLang = request.headers.get("accept-language");
  if (acceptLang) {
    const preferred = acceptLang.split(",")[0]?.trim().slice(0, 2).toLowerCase();
    if (preferred && SUPPORTED_LANGS.includes(preferred)) return preferred;
  }

  return DEFAULT_LANG;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path already starts with a supported lang
  const pathHasLang = SUPPORTED_LANGS.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (pathHasLang) return;

  // Redirect to preferred language
  const lang = getPreferredLang(request);
  request.nextUrl.pathname = `/${lang}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
