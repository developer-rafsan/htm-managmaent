export const runtime = "nodejs";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  // Public routes
  const isPublicPath =
    path === "/login" || path === "/verify-email" || path === "/reset-password";

  // If logged-in
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If no token and trying to access private routes
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Token validation & role-based control
  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
      const role = decoded.role;

      // Employer-only routes
      if (path.startsWith("/profile/employer") && role !== "employer") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Team-only routes
      if (path.startsWith("/profile/team") && role !== "team") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Manager-only routes
      if (
        (path.startsWith("/profile/manager") ||
          path.startsWith("/singin") ||
          path.startsWith("/project/create")) &&
        role !== "manager"
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

//Match all relevant routes
export const config = {
  matcher: [
    "/",
    "/login",
    "/verify-email",
    "/reset-password",

    // for employer
    "/profile/employer",

    // for team
    "/profile/team",

    // for manager
    "/profile/manager",
    "/project/create",
    "/singin",
  ],
};
