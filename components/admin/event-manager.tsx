"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, CalendarPlus, LoaderCircle, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
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
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <Card key={item.id} className="premium-card-hover overflow-hidden border-slate-200/90 bg-white">
              <CardContent className="space-y-5 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={item.isActive ? "success" : "muted"}>
                    {item.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                  {item.imageUrl ? <Badge variant="muted">Com imagem</Badge> : null}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
                    <p>{item.location}</p>
                    <p className="mt-1">
                      {formatDate(item.startsAt, {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" type="button" variant="secondary" onClick={() => startEdit(item)}>
                      Editar
                    </Button>
                    <Button size="sm" type="button" variant="ghost" onClick={() => toggleActive(item)}>
                      {item.isActive ? "Desativar" : "Ativar"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            description="A agenda institucional sera exibida conforme novos eventos forem cadastrados."
            title="Nenhum evento cadastrado."
          />
        )}
      </div>

      <Card className="h-fit overflow-hidden border-slate-200/90 bg-white xl:sticky xl:top-6">
        <CardHeader className="border-b border-slate-200/80">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>{currentItem ? "Editar evento" : "Novo evento"}</CardTitle>
              <CardDescription>
                Organize a agenda institucional com data, local e informacoes operacionais claras.
              </CardDescription>
            </div>
            <Button size="sm" type="button" variant="secondary" onClick={startCreate}>
              <CalendarPlus className="h-4 w-4" />
              Novo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-5" key={editingId ?? "new"} onSubmit={onSubmit}>
            <FormField error={errors.title?.message} htmlFor="event-title" label="Titulo do evento">
              <Input id="event-title" {...register("title")} />
            </FormField>

            <FormField error={errors.description?.message} htmlFor="event-description" label="Descricao institucional">
              <Textarea id="event-description" {...register("description")} />
            </FormField>

            <FormField error={errors.location?.message} htmlFor="event-location" label="Local da atividade">
              <Input id="event-location" {...register("location")} />
            </FormField>

            <FormField error={errors.startsAt?.message as string | undefined} htmlFor="event-startsAt" label="Data e hora">
              <Input
                id="event-startsAt"
                type="datetime-local"
                onChange={(event) => setValue("startsAt", new Date(event.target.value))}
                defaultValue={currentItem ? new Date(currentItem.startsAt).toISOString().slice(0, 16) : ""}
              />
            </FormField>

            <FormField error={errors.imageUrl?.message} htmlFor="event-image" label="Imagem de apoio">
              <Input id="event-image" placeholder="https://..." {...register("imageUrl")} />
            </FormField>

            <div className="grid gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <Checkbox defaultChecked {...register("isActive")} />
                <span>
                  <strong className="block text-slate-950">Manter evento ativo</strong>
                  O item permanece visivel no portal publico enquanto integrar a programacao vigente.
                </span>
              </label>
            </div>

            {message ? <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div> : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="flex-1" disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar evento
                  </>
                )}
              </Button>
              <Button type="button" variant="secondary" onClick={startCreate}>
                <CalendarDays className="h-4 w-4" />
                Limpar
              </Button>
            </div>

            <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              Registre data, local e contexto institucional para fortalecer a leitura publica da agenda.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
