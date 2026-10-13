// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Allow all requests to pass straight through without locale prefixing
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!admin|api|_next|.*\\..*).*)"],
};