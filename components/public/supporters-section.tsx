import { SponsorStrip } from "@/components/public/sponsor-strip";

type SponsorItem = Awaited<ReturnType<typeof import("@/lib/sponsors").getActiveSponsors>>[number];

type SupportersSectionProps = {
  sponsors: SponsorItem[];
  title?: string;
  description?: string;
  badgeLabel?: string;
};

export function SupportersSection({
  sponsors,
  title,
  description,
  badgeLabel,
}: SupportersSectionProps) {
  if (sponsors.length === 0) return null;

  return <SponsorStrip badgeLabel={badgeLabel} description={description} sponsors={sponsors} title={title} />;
}
