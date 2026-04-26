export type PublicReportMapItem = {
  id: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  neighborhood: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
};
