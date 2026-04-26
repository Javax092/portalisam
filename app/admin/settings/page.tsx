import { Building2, Mail, MessageCircle, Palette, ShieldCheck, type LucideIcon } from "lucide-react";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireAdminSession } from "@/lib/auth/server";
import { siteConfig } from "@/lib/site-config";

type SettingsField = {
  id: string;
  label: string;
  defaultValue: string;
  icon: LucideIcon;
  multiline?: boolean;
};

const settingsFields: SettingsField[] = [
  {
    id: "organizationName",
    label: "Nome da organização",
    defaultValue: siteConfig.organizationName,
    icon: Building2,
  },
  {
    id: "neighborhoodName",
    label: "Bairro/comunidade atendida",
    defaultValue: siteConfig.neighborhoodName,
    icon: Building2,
  },
  {
    id: "description",
    label: "Descrição curta",
    defaultValue: "Portal comunitário da sua organização. Centralize avisos, eventos e demandas da comunidade.",
    icon: ShieldCheck,
    multiline: true,
  },
  {
    id: "whatsappCommunityNumber",
    label: "WhatsApp principal",
    defaultValue: siteConfig.whatsappCommunityNumber,
    icon: MessageCircle,
  },
  {
    id: "whatsappAdsNumber",
    label: "WhatsApp para anúncios",
    defaultValue: siteConfig.whatsappAdsNumber,
    icon: MessageCircle,
  },
  {
    id: "adminEmail",
    label: "E-mail de contato",
    defaultValue: siteConfig.adminEmail,
    icon: Mail,
  },
  {
    id: "logoUrl",
    label: "Logo URL",
    defaultValue: "",
    icon: Building2,
  },
  {
    id: "primaryColor",
    label: "Cor principal",
    defaultValue: "#0f172a",
    icon: Palette,
  },
] as const;

export default async function AdminSettingsPage() {
  await requireAdminSession();

  return (
    <AdminPageShell
      eyebrow="Configurações"
      title="Dados da organização"
      description="Área preparada para receber os dados reais da ONG, igreja ou associação. A interface fica pronta agora e a persistência pode ser conectada ao Prisma depois."
      actions={<Badge variant="success">Pronto para integração futura</Badge>}
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Resumo da configuração</CardTitle>
            <CardDescription>
              Os dados públicos principais já foram centralizados em <code>lib/site-config.ts</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">App</p>
              <p className="mt-1">{siteConfig.appName}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">Organização</p>
              <p className="mt-1">{siteConfig.organizationName}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">Bairro/comunidade</p>
              <p className="mt-1">{siteConfig.neighborhoodName}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              <p className="font-semibold">Próximo passo</p>
              <p className="mt-1 leading-6">
                Quando quiser persistir essas informações, o formulário já está estruturado para conectar um model
                `Settings` no Prisma sem alterar a experiência visual do painel.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Formulário visual</CardTitle>
            <CardDescription>
              Campos pensados para cadastro real, ainda sem persistência complexa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {settingsFields.map((field) => {
                const Icon = field.icon;

                return (
                  <div key={field.id} className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900" htmlFor={field.id}>
                      {field.label}
                    </label>
                    <div className="relative">
                      <Icon className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                      {field.multiline ? (
                        <Textarea
                          className="min-h-28 border-slate-300 pl-11 text-slate-900"
                          defaultValue={field.defaultValue}
                          id={field.id}
                        />
                      ) : (
                        <Input
                          className="border-slate-300 pl-11 text-slate-900"
                          defaultValue={field.defaultValue}
                          id={field.id}
                        />
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                Esta tela é visual por enquanto. Os dados atuais continuam vindo da configuração central e do banco onde
                já houver persistência real.
              </div>

              <Button className="bg-slate-950 text-white hover:bg-slate-800" type="button">
                Salvar em breve
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  );
}
