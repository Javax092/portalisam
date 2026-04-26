import { SectionContainer } from "@/components/ui/section-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="bg-hero-grid py-16 sm:py-24">
      <SectionContainer className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-14 w-full max-w-2xl" />
          <Skeleton className="h-6 w-full max-w-xl" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      </SectionContainer>
    </main>
  );
}
