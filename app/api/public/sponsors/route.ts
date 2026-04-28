import { NextResponse } from "next/server";

import { getActiveSponsors } from "@/lib/sponsors";

export async function GET() {
  const sponsors = await getActiveSponsors();
  return NextResponse.json({ sponsors });
}
