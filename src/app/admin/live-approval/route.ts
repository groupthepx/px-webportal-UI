import { NextRequest, NextResponse } from "next/server";

const ADMIN_BASE_URL =
  process.env.NEXT_PUBLIC_ADMIN_BASE_URL || "https://admin.thepxgroup.co.th";

export function GET(request: NextRequest) {
  const target = new URL("/admin/live-approval", ADMIN_BASE_URL);
  request.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });

  return NextResponse.redirect(target, 307);
}
