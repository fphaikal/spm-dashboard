// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  const { pathname } = request.nextUrl;

  // Jika sudah login dan mengakses halaman login, redirect ke homepage (misalnya "/")
  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Jika belum login dan mengakses halaman yang diproteksi, redirect ke halaman login
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Lanjutkan request jika tidak ada kondisi yang terpenuhi
  return NextResponse.next();
}

// Konfigurasi matcher untuk middleware
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
