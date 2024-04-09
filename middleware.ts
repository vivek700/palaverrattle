import { NextApiRequest } from "next";
import { auth } from "./app/lib/auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;

  const isLoggedIn = !!req.auth;
  const isLoginPage = pathname.startsWith("/login");

  const sensitiveRoutes = ["/dashboard"];

  const isAccessingSesnsitiveRoute = sensitiveRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isLoginPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }
  if (!isLoggedIn && isAccessingSesnsitiveRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
