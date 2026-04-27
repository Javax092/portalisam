"use client";

import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { divIcon } from "leaflet";
import { AlertTriangle, CheckCircle2, LoaderCircle, MapPinned } from "lucide-react";

import { communityMapDefaults } from "@/lib/maps/leaflet";
import { reportCategoryLabels, reportStatusLabels } from "@/lib/community";
import { Badge } from "@/components/ui/badge";
import type { PublicReportMapItem } from "@/lib/types/public";

type ReportsMapProps = {
  reports: PublicReportMapItem[];
};

function createMarker(status: string) {
  const color =
    status === "RESOLVED"
      ? "#16a34a"
      : status === "IN_PROGRESS"
        ? "#0284c7"
        : status === "IN_REVIEW"
          ? "#f59e0b"
          : "#dc2626";

  return divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:0 8px 24px rgba(15,23,42,.25)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export function ReportsMap({ reports }: ReportsMapProps) {
  const reportsWithCoordinates = reports.filter(
    (report) => report.latitude !== null && report.longitude !== null,
  );

  const center = useMemo<[number, number]>(() => {
    const first = reportsWithCoordinates[0];

    if (first?.latitude !== null && first?.longitude !== null && first !== undefined) {
      return [first.latitude, first.longitude];
    }

    return communityMapDefaults.center;
  }, [reportsWithCoordinates]);

  if (reportsWithCoordinates.length === 0) {
    return (
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
        <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <MapPinned className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-950">Mapa das demandas</p>
              <p className="text-sm text-slate-700">Aguardando coordenadas para exibir os pontos publicos.</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="max-w-xl text-sm leading-6 text-slate-700">
            Os registros permanecem disponiveis na listagem publica. Com localizacao informada,
            passam a integrar a visualizacao territorial.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 px-5 py-5 text-white sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sky-200">
              <MapPinned className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">Mapa das demandas no territorio</p>
              <p className="text-sm leading-6 text-slate-200">
                Visualizacao territorial dos registros comunitarios com leitura publica de distribuicao e status.
              </p>
            </div>
          </div>
          <Badge className="border-white/10 bg-slate-900 text-white">
            {reportsWithCoordinates.length} pontos visiveis
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-3 py-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
            Resolvida
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-3 py-2">
            <LoaderCircle className="h-3.5 w-3.5 text-amber-300" />
            Em analise
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-3 py-2">
            <MapPinned className="h-3.5 w-3.5 text-sky-300" />
            Em andamento
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-300" />
            Urgente
          </span>
        </div>
      </div>

      <MapContainer center={center} className="h-[360px] w-full sm:h-[520px] lg:h-[620px]" scrollWheelZoom={false} zoom={communityMapDefaults.zoom}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reportsWithCoordinates.map((report) => (
          <Marker
            key={report.id}
            icon={createMarker(report.status)}
            position={[report.latitude as number, report.longitude as number]}
          >
            <Popup>
              <div className="space-y-1.5">
                <strong>{report.title}</strong>
                <p>{reportCategoryLabels[report.category as keyof typeof reportCategoryLabels]}</p>
                <p>{reportStatusLabels[report.status as keyof typeof reportStatusLabels]}</p>
                {report.neighborhood ? <p>{report.neighborhood}</p> : null}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
