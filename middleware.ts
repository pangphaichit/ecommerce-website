import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const publicPaths = [
  "/",
  "/login",
  "/register",
  "/register/success",
  "/register/privacy-policy",
  "/news-and-events",
  "/products",
  "/customer/forgot-password",
  "/courses",
  "/blog",
  "/about-us",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") || "";

  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .filter((parts) => parts.length === 2)
      .map(([key, value]) => [key, decodeURIComponent(value)])
  );

  const userRole = cookies.user_role;

  const isAuthenticated = Boolean(userRole);

  // Handle protected routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isCustomerRoute = pathname.startsWith("/customer/my-account");

  if (isAdminRoute || isCustomerRoute) {
    // Redirect unauthenticated users to log-in
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to home");
      return NextResponse.redirect(new URL("/log-in", request.url));
    }

    // Redirect customers trying to access admin routes to log-in
    if (isAdminRoute && userRole !== "admin") {
      console.log(
        "Non-admin trying to access admin route, redirecting to home"
      );
      return NextResponse.redirect(new URL("/log-in", request.url));
    }

    // Redirect admins trying to access customer routes to admin
    if (isCustomerRoute && userRole === "admin") {
      console.log(
        "Admin trying to access customer route, redirecting to admin"
      );
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}
