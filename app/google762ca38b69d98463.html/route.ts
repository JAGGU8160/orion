import { NextResponse } from "next/server";

export function GET() {
  return new NextResponse("google-site-verification: google762ca38b69d98463.html", {
    headers: { "Content-Type": "text/html" },
  });
}
