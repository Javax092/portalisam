"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
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
      setMessage(data?.message ?? "Nao foi possivel salvar o aviso.");
      return;
    }

    setItems((current) =>
      editingId
        ? current.map((item) => (item.id === data.notice!.id ? data.notice! : item))
        : [data.notice!, ...current],
    );
    setMessage(data.message ?? "Aviso salvo com sucesso.");
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
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {items.length > 0 ? items.map((item) => (
          <Card key={item.id} className="premium-card-hover bg-white">
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                <Badge>{item.category}</Badge>
                {item.isFeatured ? <Badge variant="success">Destaque</Badge> : null}
                <Badge variant="muted">{item.isActive ? "Ativo" : "Inativo"}</Badge>
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Publicacao: {item.publishedAt ? formatDate(item.publishedAt) : "Nao definida"}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => startEdit(item)} type="button">Editar</Button>
                <Button size="sm" variant="ghost" onClick={() => toggleFlag(item, "isActive")} type="button">
                  {item.isActive ? "Desativar" : "Ativar"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleFlag(item, "isFeatured")} type="button">
                  {item.isFeatured ? "Remover destaque" : "Destacar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <EmptyState
            description="Publique o primeiro comunicado para organizar informacoes importantes em um unico lugar."
            title="Nenhum aviso cadastrado ainda"
          />
        )}
      </div>

      <Card className="h-fit bg-white">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>{currentItem ? "Editar aviso" : "Novo aviso"}</CardTitle>
              <CardDescription>
                Organize comunicados de forma clara para a comunidade.
              </CardDescription>
            </div>
            <Button size="sm" variant="secondary" onClick={startCreate} type="button">
              <Plus className="h-4 w-4" />
              Novo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" key={editingId ?? "new"} onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900" htmlFor="notice-title">Titulo</label>
              <Input id="notice-title" {...register("title")} />
              {errors.title ? <p className="text-sm text-rose-600">{errors.title.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900" htmlFor="notice-description">Descricao</label>
              <Textarea id="notice-description" {...register("description")} />
              {errors.description ? <p className="text-sm text-rose-600">{errors.description.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900" htmlFor="notice-category">Categoria</label>
              <Input id="notice-category" {...register("category")} />
              {errors.category ? <p className="text-sm text-rose-600">{errors.category.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900" htmlFor="notice-publishedAt">Data de publicacao</label>
              <Input
                id="notice-publishedAt"
                type="datetime-local"
                onChange={(event) => setValue("publishedAt", event.target.value ? new Date(event.target.value) : undefined)}
                defaultValue={
                  currentItem?.publishedAt
                    ? new Date(currentItem.publishedAt).toISOString().slice(0, 16)
                    : ""
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <Checkbox {...register("isFeatured")} />
                Destacar este aviso
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <Checkbox defaultChecked {...register("isActive")} />
                Manter aviso ativo
              </label>
            </div>
            {message ? <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div> : null}
            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Salvando...</> : <><Save className="h-4 w-4" /> Salvar aviso</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
