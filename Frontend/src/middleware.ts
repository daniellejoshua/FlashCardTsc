import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies?.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/protected") && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/public/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*"],
};
