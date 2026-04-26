import { CalendarDays, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/community";

type EventCardProps = {
  event: {
    title: string;
    description: string;
    location: string;
    startsAt: Date | string;
  };
};

export function EventCard({ event }: EventCardProps) {
  const parsed = typeof event.startsAt === "string" ? new Date(event.startsAt) : event.startsAt;
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(parsed);
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(parsed);

  return (
    <Card className="premium-card-hover h-full rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
      <CardContent className="grid gap-4 p-5 sm:grid-cols-[88px_1fr] sm:items-start">
        <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-4 text-center shadow-sm shadow-emerald-100/60">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700">{month}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-emerald-950">{day}</p>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">Evento comunitário</Badge>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">{event.title}</h3>
            <p className="text-sm leading-7 text-slate-600">{event.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
              <CalendarDays className="h-4 w-4 text-emerald-700" />
              {formatDate(event.startsAt, {
                day: "2-digit",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
              <MapPin className="h-4 w-4 text-sky-700" />
              {event.location}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
