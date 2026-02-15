import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

const ALLOW_PREFIXES = ["/_next", "/api/auth"];
const ALLOW_EXACT = [
  "/login",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    ALLOW_EXACT.includes(pathname) ||
    ALLOW_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (sessionCookie) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
