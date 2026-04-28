"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { adBannerPositionDescriptions, adBannerPositionLabels, adBannerPositions, type AdBannerPosition } from "@/lib/ad-banners";
import { type AdBannerInput, adBannerSchema } from "@/lib/validations/ad-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type BannerItem = Awaited<ReturnType<typeof import("@/lib/admin-data").getAdminAdBannersData>>[number];

type AdBannerManagerProps = {
  initialBanners: BannerItem[];
};

const defaultValues: AdBannerInput = {
  title: "",
  description: "",
  imageUrl: "",
  link: "",
  isActive: true,
  priority: 0,
  position: "portal_top",
};

export function AdBannerManager({ initialBanners }: AdBannerManagerProps) {
  const [banners, setBanners] = useState(sortBanners(initialBanners));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<AdBannerInput>({
    resolver: zodResolver(adBannerSchema),
    defaultValues,
  });

  const currentBanner = useMemo(
    () => banners.find((item) => item.id === editingId) ?? null,
    [banners, editingId],
  );

  const startCreate = () => {
    setEditingId(null);
    setMessage(null);
    form.reset(defaultValues);
  };

  const startEdit = (banner: BannerItem) => {
    setEditingId(banner.id);
    setMessage(null);
    form.reset({
      title: banner.title,
      description: banner.description || "",
      imageUrl: banner.imageUrl,
      link: banner.link || "",
      isActive: banner.isActive,
      priority: banner.priority,
      position: normalizePosition(banner.position),
    });
  };

  const submit = form.handleSubmit(async (values) => {
    setMessage(null);

    const endpoint = editingId ? `/api/admin/ad-banners/${editingId}` : "/api/admin/ad-banners";
    const method = editingId ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = (await response.json().catch(() => null)) as
      | { message?: string; banner?: BannerItem }
      | null;

    if (!response.ok || !data?.banner) {
      setMessage(data?.message ?? "Nao foi possivel salvar o anuncio.");
      return;
    }

    setBanners((current) =>
      sortBanners(
        editingId
          ? current.map((item) => (item.id === data.banner!.id ? data.banner! : item))
          : [data.banner!, ...current],
      ),
    );
    setMessage(data.message ?? "Anuncio salvo com sucesso.");
    startEdit(data.banner);
  });

  const handleDelete = async (banner: BannerItem) => {
    const confirmed = window.confirm(`Excluir o anuncio "${banner.title}"?`);
    if (!confirmed) return;

    setMessage(null);
    const response = await fetch(`/api/admin/ad-banners/${banner.id}`, { method: "DELETE" });
    const data = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      setMessage(data?.message ?? "Nao foi possivel remover o anuncio.");
      return;
    }

    setBanners((current) => current.filter((item) => item.id !== banner.id));
    if (editingId === banner.id) {
      startCreate();
    }
    setMessage(data?.message ?? "Anuncio removido com sucesso.");
  };

  const toggleActive = async (banner: BannerItem) => {
    setMessage(null);

    const response = await fetch(`/api/admin/ad-banners/${banner.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: banner.title,
        description: banner.description || "",
        imageUrl: banner.imageUrl,
        link: banner.link || "",
        isActive: !banner.isActive,
        priority: banner.priority,
        position: normalizePosition(banner.position),
      }),
    });

    const data = (await response.json().catch(() => null)) as
      | { message?: string; banner?: BannerItem }
      | null;

    if (!response.ok || !data?.banner) {
      setMessage(data?.message ?? "Nao foi possivel atualizar o status.");
      return;
    }

    setBanners((current) =>
      sortBanners(current.map((item) => (item.id === data.banner!.id ? data.banner! : item))),
    );
    setMessage(data.message ?? "Status atualizado com sucesso.");
    if (editingId === data.banner.id) {
      startEdit(data.banner);
    }
  };

  const selectedPosition = form.watch("position");

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
      <div className="space-y-6">
        <Card className="overflow-hidden border-slate-200 bg-white">
          <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
            <div className="space-y-2">
              <Badge variant="muted">Area patrocinada</Badge>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                  Anuncios e patrocinadores
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Gestao direta de banners institucionais com imagem, link, prioridade e posicao.
                </p>
              </div>
            </div>
            <Button size="sm" type="button" variant="secondary" onClick={startCreate}>
              <Plus className="h-4 w-4" />
              Novo anuncio
            </Button>
          </CardContent>
        </Card>

        {message ? (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
            {message}
          </div>
        ) : null}

        {banners.length > 0 ? (
          <div className="grid gap-4">
            {banners.map((banner) => (
              <Card key={banner.id} className="overflow-hidden border-slate-200 bg-white">
                <CardContent className="grid gap-5 p-5 md:grid-cols-[168px_minmax(0,1fr)] md:p-6">
                  <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={banner.title}
                      className="h-36 w-full object-cover md:h-full"
                      src={banner.imageUrl}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={banner.isActive ? "success" : "muted"}>
                        {banner.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                      <Badge variant="muted">{adBannerPositionLabels[normalizePosition(banner.position)]}</Badge>
                      <Badge variant="muted">Prioridade {banner.priority}</Badge>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold tracking-tight text-slate-950">{banner.title}</h3>
                      <p className="text-sm leading-6 text-slate-600">
                        {banner.description || adBannerPositionDescriptions[normalizePosition(banner.position)]}
                      </p>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                        {banner.link || "Sem link de destino. O bloco sera exibido apenas como institucional."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" type="button" variant="secondary" onClick={() => startEdit(banner)}>
                        <Pencil className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button size="sm" type="button" variant="ghost" onClick={() => toggleActive(banner)}>
                        {banner.isActive ? "Desativar" : "Ativar"}
                      </Button>
                      <Button size="sm" type="button" variant="danger" onClick={() => handleDelete(banner)}>
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            description="Cadastre o primeiro banner para ocupar areas patrocinadas do portal com leitura limpa e institucional."
            title="Nenhum anuncio cadastrado."
          />
        )}
      </div>

      <Card className="h-fit overflow-hidden border-slate-200 bg-white xl:sticky xl:top-6">
        <CardHeader className="border-b border-slate-200/80">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>{currentBanner ? "Editar anuncio" : "Novo anuncio"}</CardTitle>
              <CardDescription>
                Use `imageUrl` por enquanto. O formulario fica pronto para um upload real depois.
              </CardDescription>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
              <ImagePlus className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form className="space-y-5" key={editingId ?? "new-banner"} onSubmit={submit}>
            <FormField error={form.formState.errors.title?.message} htmlFor="banner-title" label="Titulo">
              <Input id="banner-title" placeholder="Ex.: Clinica comunitaria parceira" {...form.register("title")} />
            </FormField>

            <FormField
              error={form.formState.errors.description?.message}
              htmlFor="banner-description"
              hint="Opcional. Texto curto para contextualizar a parceria."
              label="Descricao"
            >
              <Textarea id="banner-description" rows={4} {...form.register("description")} />
            </FormField>

            <FormField
              error={form.formState.errors.imageUrl?.message}
              htmlFor="banner-image-url"
              hint="Use uma imagem horizontal e leve para manter a leitura premium."
              label="Imagem (URL)"
            >
              <Input id="banner-image-url" placeholder="https://..." {...form.register("imageUrl")} />
            </FormField>

            <FormField
              error={form.formState.errors.link?.message}
              htmlFor="banner-link"
              hint="Opcional. Se vazio, o CTA nao sera exibido."
              label="Link do patrocinador"
            >
              <Input id="banner-link" placeholder="https://..." {...form.register("link")} />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField error={form.formState.errors.priority?.message} htmlFor="banner-priority" label="Prioridade">
                <Input id="banner-priority" type="number" {...form.register("priority", { valueAsNumber: true })} />
              </FormField>

              <FormField error={form.formState.errors.position?.message} htmlFor="banner-position" label="Posicao">
                <Select id="banner-position" {...form.register("position")}>
                  {adBannerPositions.map((position) => (
                    <option key={position} value={position}>
                      {adBannerPositionLabels[position]}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Posicao selecionada
              </p>
              <p className="mt-2 font-semibold text-slate-950">
                {adBannerPositionLabels[selectedPosition]}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {adBannerPositionDescriptions[selectedPosition]}
              </p>
            </div>

            <label className="flex items-start gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <Checkbox {...form.register("isActive")} />
              <span>
                <strong className="block text-slate-950">Anuncio ativo</strong>
                Exibe o banner no portal publico conforme prioridade e posicao configuradas.
              </span>
            </label>

            <Button className="w-full" loading={form.formState.isSubmitting} type="submit">
              <Save className="h-4 w-4" />
              {currentBanner ? "Salvar alteracoes" : "Criar anuncio"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function normalizePosition(value: string): AdBannerPosition {
  return adBannerPositions.includes(value as AdBannerPosition)
    ? (value as AdBannerPosition)
    : "portal_top";
}

function sortBanners(items: BannerItem[]) {
  return [...items].sort((left, right) => {
    if (right.priority !== left.priority) {
      return right.priority - left.priority;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}
