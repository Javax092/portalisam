"use client";

import dynamic from "next/dynamic";

import type { PublicReportMapItem } from "@/lib/types/public";

const ReportsMap = dynamic(
  () => import("@/components/public/reports-map").then((module) => module.ReportsMap),
  { ssr: false },
);

type ReportsMapSectionProps = {
  reports: PublicReportMapItem[];
};

export function ReportsMapSection({ reports }: ReportsMapSectionProps) {
  return <ReportsMap reports={reports} />;
}
