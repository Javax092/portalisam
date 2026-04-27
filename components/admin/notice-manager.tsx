"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing, LoaderCircle, Pin, Plus, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/community";
import { noticeSchema, type NoticeInput } from "@/lib/validations/notice";

type NoticeItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  isFeatured: boolean;
  isActive: boolean;
  publishedAt: string | Date | null;
  updatedAt: string | Date;
};

type NoticeManagerProps = {
  initialNotices: NoticeItem[];
};

const emptyValues = {
  title: "",
  description: "",
  category: "",
  isFeatured: false,
  isActive: true,
  publishedAt: undefined,
} satisfies Partial<NoticeInput>;

export function NoticeManager({ initialNotices }: NoticeManagerProps) {
  const [items, setItems] = useState(initialNotices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const currentItem = useMemo(
    () => items.find((item) => item.id === editingId),
    [items, editingId],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NoticeInput>({
    resolver: zodResolver(noticeSchema),
    defaultValues: emptyValues,
  });

  const startCreate = () => {
    setEditingId(null);
    setMessage(null);
    reset(emptyValues);
  };

  const startEdit = (item: NoticeItem) => {
    setEditingId(item.id);
    setMessage(null);
    reset({
      title: item.title,
      description: item.description,
      category: item.category,
      isFeatured: item.isFeatured,
      isActive: item.isActive,
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : undefined,
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);

    const endpoint = editingId ? `/api/admin/notices/${editingId}` : "/api/admin/notices";
    const method = editingId ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        publishedAt: values.publishedAt ? values.publishedAt.toISOString() : undefined,
      }),
    });

    const data = (await response.json().catch(() => null)) as { message?: string; notice?: NoticeItem } | null;

    if (!response.ok || !data?.notice) {
      setMessage(data?.message ?? "Nao foi possivel salvar o comunicado.");
      return;
    }

    setItems((current) =>
      editingId
        ? current.map((item) => (item.id === data.notice!.id ? data.notice! : item))
        : [data.notice!, ...current],
    );
    setMessage(data.message ?? "Comunicado salvo com sucesso.");
    setEditingId(data.notice.id);
    startEdit(data.notice);
  });

  const toggleFlag = async (item: NoticeItem, field: "isActive" | "isFeatured") => {
    const response = await fetch(`/api/admin/notices/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: item.title,
        description: item.description,
        category: item.category,
        isFeatured: field === "isFeatured" ? !item.isFeatured : item.isFeatured,
        isActive: field === "isActive" ? !item.isActive : item.isActive,
        publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString() : undefined,
      }),
    });

    const data = (await response.json().catch(() => null)) as { notice?: NoticeItem } | null;
    if (response.ok && data?.notice) {
      setItems((current) => current.map((entry) => (entry.id === data.notice!.id ? data.notice! : entry)));
      if (editingId === data.notice.id) {
        startEdit(data.notice);
      }
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <Card key={item.id} className="premium-card-hover overflow-hidden border-slate-200/90 bg-white">
              <CardContent className="space-y-5 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="muted">{item.category}</Badge>
                  {item.isFeatured ? <Badge>Em destaque</Badge> : null}
                  <Badge variant={item.isActive ? "success" : "muted"}>
                    {item.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
                    Publicacao: {item.publishedAt ? formatDate(item.publishedAt) : "Nao definida"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" type="button" variant="secondary" onClick={() => startEdit(item)}>
                      Editar
                    </Button>
                    <Button size="sm" type="button" variant="ghost" onClick={() => toggleFlag(item, "isActive")}>
                      {item.isActive ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={() => toggleFlag(item, "isFeatured")}
                    >
                      {item.isFeatured ? "Remover destaque" : "Destacar"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            description="As publicacoes institucionais serao exibidas conforme novos comunicados forem cadastrados."
            title="Nenhum comunicado publicado."
          />
        )}
      </div>

      <Card className="h-fit overflow-hidden border-slate-200/90 bg-white xl:sticky xl:top-6">
        <CardHeader className="border-b border-slate-200/80">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>{currentItem ? "Editar comunicado" : "Novo comunicado"}</CardTitle>
              <CardDescription>
                Estruture publicacoes oficiais com leitura objetiva, data e destaque institucional.
              </CardDescription>
            </div>
            <Button size="sm" type="button" variant="secondary" onClick={startCreate}>
              <Plus className="h-4 w-4" />
              Novo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-5" key={editingId ?? "new"} onSubmit={onSubmit}>
            <FormField error={errors.title?.message} htmlFor="notice-title" label="Titulo do comunicado">
              <Input id="notice-title" {...register("title")} />
            </FormField>

            <FormField error={errors.description?.message} htmlFor="notice-description" label="Descricao">
              <Textarea id="notice-description" {...register("description")} />
            </FormField>

            <FormField error={errors.category?.message} htmlFor="notice-category" label="Categoria">
              <Input id="notice-category" {...register("category")} />
            </FormField>

            <FormField htmlFor="notice-publishedAt" label="Data de publicacao">
              <Input
                id="notice-publishedAt"
                type="datetime-local"
                onChange={(event) =>
                  setValue("publishedAt", event.target.value ? new Date(event.target.value) : undefined)
                }
                defaultValue={currentItem?.publishedAt ? new Date(currentItem.publishedAt).toISOString().slice(0, 16) : ""}
              />
            </FormField>

            <div className="grid gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <Checkbox {...register("isFeatured")} />
                <span>
                  <strong className="block text-slate-950">Destacar este comunicado</strong>
                  Utilize para priorizar a publicacao principal no portal publico.
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <Checkbox defaultChecked {...register("isActive")} />
                <span>
                  <strong className="block text-slate-950">Manter comunicado ativo</strong>
                  O item permanece visivel no portal publico enquanto estiver vigente.
                </span>
              </label>
            </div>

            {message ? <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div> : null}

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar comunicado
                </>
              )}
            </Button>

            <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              Priorize titulos objetivos, descricao institucional e destaque apenas para publicacoes estrategicas.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
