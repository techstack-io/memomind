import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0];

  if (
    hostname === "mettavia-lojong.com" ||
    hostname === "www.mettavia-lojong.com"
  ) {
    const url = request.nextUrl.clone();

    if (url.pathname === "/") {
      url.pathname = "/marketing";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};