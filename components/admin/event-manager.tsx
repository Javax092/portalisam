"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, LoaderCircle, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/community";
import { eventSchema, type EventInput } from "@/lib/validations/event";

type EventItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: string | Date;
  imageUrl: string | null;
  isActive: boolean;
  updatedAt: string | Date;
};

type EventManagerProps = {
  initialEvents: EventItem[];
};

const emptyValues = {
  title: "",
  description: "",
  location: "",
  startsAt: new Date(),
  imageUrl: "",
  isActive: true,
} satisfies EventInput;

export function EventManager({ initialEvents }: EventManagerProps) {
  const [items, setItems] = useState(initialEvents);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const currentItem = useMemo(() => items.find((item) => item.id === editingId), [items, editingId]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: emptyValues,
  });

  const startCreate = () => {
    setEditingId(null);
    setMessage(null);
    reset(emptyValues);
  };

  const startEdit = (item: EventItem) => {
    setEditingId(item.id);
    setMessage(null);
    reset({
      title: item.title,
      description: item.description,
      location: item.location,
      startsAt: new Date(item.startsAt),
      imageUrl: item.imageUrl || "",
      isActive: item.isActive,
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);

    const endpoint = editingId ? `/api/admin/events/${editingId}` : "/api/admin/events";
    const method = editingId ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        startsAt: values.startsAt.toISOString(),
      }),
    });

    const data = (await response.json().catch(() => null)) as { message?: string; event?: EventItem } | null;

    if (!response.ok || !data?.event) {
      setMessage(data?.message ?? "Nao foi possivel salvar o evento.");
      return;
    }

    setItems((current) =>
      editingId ? current.map((item) => (item.id === data.event!.id ? data.event! : item)) : [data.event!, ...current],
    );
    setMessage(data.message ?? "Evento salvo com sucesso.");
    setEditingId(data.event.id);
    startEdit(data.event);
  });

  const toggleActive = async (item: EventItem) => {
    const response = await fetch(`/api/admin/events/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: item.title,
        description: item.description,
        location: item.location,
        startsAt: new Date(item.startsAt).toISOString(),
        imageUrl: item.imageUrl || "",
        isActive: !item.isActive,
      }),
    });

    const data = (await response.json().catch(() => null)) as { event?: EventItem } | null;
    if (response.ok && data?.event) {
      setItems((current) => current.map((entry) => (entry.id === data.event!.id ? data.event! : entry)));
      if (editingId === data.event.id) {
        startEdit(data.event);
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
                <Badge>{item.isActive ? "Ativo" : "Inativo"}</Badge>
                {item.imageUrl ? <Badge variant="muted">Com imagem</Badge> : null}
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                <p>{item.location}</p>
                <p>{formatDate(item.startsAt, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => startEdit(item)} type="button">Editar</Button>
                <Button size="sm" variant="ghost" onClick={() => toggleActive(item)} type="button">
                  {item.isActive ? "Desativar" : "Ativar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <EmptyState
            description="Crie o primeiro evento para manter a agenda publica da comunidade atualizada."
            title="Nenhum evento cadastrado ainda"
          />
        )}
      </div>

      <Card className="h-fit bg-white">
        <CardHeader>
          <CardTitle>{currentItem ? "Editar evento" : "Novo evento"}</CardTitle>
          <CardDescription>Mantenha a agenda comunitaria organizada e visivel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" key={editingId ?? "new"} onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900" htmlFor="event-title">Titulo</label>
              <Input id="event-title" {...register("title")} />
              {errors.title ? <p className="text-sm text-rose-600">{errors.title.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900" htmlFor="event-description">Descricao</label>
              <Textarea id="event-description" {...register("description")} />
              {errors.description ? <p className="text-sm text-rose-600">{errors.description.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900" htmlFor="event-location">Local</label>
              <Input id="event-location" {...register("location")} />
              {errors.location ? <p className="text-sm text-rose-600">{errors.location.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900" htmlFor="event-startsAt">Data e hora</label>
              <Input
                id="event-startsAt"
                type="datetime-local"
                onChange={(event) => setValue("startsAt", new Date(event.target.value))}
                defaultValue={currentItem ? new Date(currentItem.startsAt).toISOString().slice(0, 16) : ""}
              />
              {errors.startsAt ? <p className="text-sm text-rose-600">{errors.startsAt.message as string}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900" htmlFor="event-image">Imagem opcional</label>
              <Input id="event-image" {...register("imageUrl")} placeholder="https://..." />
              {errors.imageUrl ? <p className="text-sm text-rose-600">{errors.imageUrl.message}</p> : null}
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <Checkbox defaultChecked {...register("isActive")} />
              Manter evento ativo
            </label>
            {message ? <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div> : null}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="flex-1" disabled={isSubmitting} type="submit">
                {isSubmitting ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Salvando...</> : <><Save className="h-4 w-4" /> Salvar evento</>}
              </Button>
              <Button onClick={startCreate} type="button" variant="secondary">
                <CalendarPlus className="h-4 w-4" />
                Novo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
