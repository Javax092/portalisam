import { SectionHeader } from "@/components/ui/section-header";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: PageHeaderProps) {
  return <SectionHeader align={align} description={description} eyebrow={eyebrow} title={title} />;
}
