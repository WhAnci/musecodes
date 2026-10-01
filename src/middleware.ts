import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { SESSION_COOKIE } from "@/lib/session";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = request.cookies.get(SESSION_COOKIE);

  if (!session?.value) {
    response.cookies.set(SESSION_COOKIE, uuidv4(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
