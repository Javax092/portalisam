import { NextResponse } from "next/server";

import { clearUserSession } from "@/lib/auth/server";

export async function POST() {
  await clearUserSession();

  return NextResponse.json({ success: true });
}
