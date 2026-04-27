import { BellRing, Pin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/community";

type CommunityNoticeCardProps = {
  notice: {
    title: string;
    description: string;
    category: string;
    isFeatured?: boolean;
    createdAt: Date | string;
    publishedAt?: Date | string | null;
  };
};

export function CommunityNoticeCard({ notice }: CommunityNoticeCardProps) {
  return (
    <Card className="premium-card-hover h-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant="muted">{notice.category}</Badge>
          {notice.isFeatured ? <Badge className="border-slate-900 bg-slate-950 text-white">Comunicado principal</Badge> : null}
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-slate-950">{notice.title}</h3>
            <p className="text-sm leading-7 text-slate-600">{notice.description}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm">
            {notice.isFeatured ? <Pin className="h-5 w-5" /> : <BellRing className="h-5 w-5" />}
          </div>
        </div>
        <div className="rounded-[1rem] border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
          Publicado em {formatDate(notice.publishedAt || notice.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}
