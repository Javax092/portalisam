import { AdBannerManager } from "@/components/admin/ad-banner-manager";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { getAdminAdBannersData } from "@/lib/admin-data";

export default async function AdminAdBannersPage() {
  const banners = await getAdminAdBannersData();

  return (
    <AdminPageShell
      eyebrow="Patrocinio"
      title="Anuncios e patrocinadores"
      description="Cadastre banners patrocinados com imagem, link, prioridade e posicao para destacar parceiros sem poluir a experiencia publica."
    >
      <AdBannerManager initialBanners={banners} />
    </AdminPageShell>
  );
}
