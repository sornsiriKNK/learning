import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export default auth((request: NextRequest & { auth: unknown }) => {
  const isLoggedIn = Boolean(request.auth);
  const { pathname } = request.nextUrl;

  const protectedPrefixes = ["/blog", "/health", "/money", "/drafts"];
  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/blog", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/blog/:path*",
    "/health/:path*",
    "/money/:path*",
    "/drafts/:path*",
    "/login",
  ],
};
