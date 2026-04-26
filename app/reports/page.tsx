import { ReportsOverview } from "@/components/public/reports-overview";

type ReportsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function ReportsPage({ searchParams }: ReportsPageProps) {
  return <ReportsOverview searchParams={searchParams} />;
}
