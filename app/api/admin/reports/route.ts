import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/api";
import { getAdminReports } from "@/lib/admin-data";
import { adminReportFiltersSchema } from "@/lib/validations/report-filters";

export async function GET(request: Request) {
  const session = await requireAdminApiSession();
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const parsed = adminReportFiltersSchema.safeParse({
    query: searchParams.get("query") || "",
    status: searchParams.get("status") || "",
    priority: searchParams.get("priority") || "",
    category: searchParams.get("category") || "",
    assignedToUserId: searchParams.get("assignedToUserId") || "",
    page: searchParams.get("page") || "1",
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "Filtros invalidos." }, { status: 400 });
  }

  const result = await getAdminReports(parsed.data);

  return NextResponse.json(result);
}
