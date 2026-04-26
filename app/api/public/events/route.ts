import { NextResponse } from "next/server";

import { getPublicEvents } from "@/lib/public-data";

export async function GET() {
  const events = await getPublicEvents();

  return NextResponse.json({ events });
}
