import { Building2, Mail, MessageCircle, Palette, ShieldCheck, type LucideIcon } from "lucide-react";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
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
    label: "Nome da organizacao",
    defaultValue: siteConfig.organizationName,
    icon: Building2,
  },
  {
    id: "neighborhoodName",
    label: "Bairro ou comunidade atendida",
    defaultValue: siteConfig.neighborhoodName,
    icon: Building2,
  },
  {
    id: "description",
    label: "Descricao curta",
    defaultValue: "Portal institucional para comunicacao publica, agenda institucional e acompanhamento territorial.",
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
    label: "WhatsApp para anuncios",
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
      eyebrow="Configuracoes"
      title="Dados institucionais"
      description="Parametros organizacionais do portal para identidade institucional, comunicacao oficial e canais de contato."
      actions={<Badge variant="success">Configuracao institucional</Badge>}
    >
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="glass-panel border-slate-200/90">
          <CardHeader>
            <CardTitle>Resumo da configuracao</CardTitle>
            <CardDescription>
              Parametros institucionais centrais para operacao administrativa e apresentacao publica do portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-950">App</p>
              <p className="mt-1">{siteConfig.appName}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-950">Organizacao</p>
              <p className="mt-1">{siteConfig.organizationName}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-950">Bairro ou comunidade</p>
              <p className="mt-1">{siteConfig.neighborhoodName}</p>
            </div>
            <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              <p className="font-semibold">Base institucional</p>
              <p className="mt-1 leading-6">
                Os dados atuais podem evoluir para persistencia dedicada sem alterar a estrutura administrativa da pagina.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-slate-200/90">
          <CardHeader>
            <CardTitle>Formulario institucional</CardTitle>
            <CardDescription>
              Campos organizados para manutencao da identidade institucional e dos canais oficiais do portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {settingsFields.map((field) => {
                const Icon = field.icon;

                return (
                  <FormField key={field.id} htmlFor={field.id} label={field.label}>
                    <div className="relative">
                      <Icon className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-500" />
                      {field.multiline ? (
                        <Textarea
                          className="min-h-28 pl-11"
                          defaultValue={field.defaultValue}
                          id={field.id}
                        />
                      ) : (
                        <Input className="pl-11" defaultValue={field.defaultValue} id={field.id} />
                      )}
                    </div>
                  </FormField>
                );
              })}

              <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                Os dados atuais continuam vindo da configuracao central e do banco onde ja houver persistencia ativa.
              </div>

              <Button className="w-full sm:w-auto" type="button">
                Salvar configuracoes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  );
}
