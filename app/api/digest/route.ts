import { NextResponse } from "next/server";
import { fetchDigest } from "@/lib/sheets";

export const revalidate = 300;

export async function GET() {
  try {
    const data = await fetchDigest();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
      }
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
