"use client";

import { useMemo, useState } from "react";
import { AdPlacement } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { LayoutTemplate, LoaderCircle, Megaphone, Plus, Save, Trash2, Users2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { adPlacementLabels } from "@/lib/sponsors";
import {
  adSlotSchema,
  advertisementSchema,
  sponsorSchema,
  type AdSlotInput,
  type AdvertisementInput,
  type SponsorInput,
} from "@/lib/validations/sponsor";

type ModuleData = Awaited<ReturnType<typeof import("@/lib/admin-data").getAdminSponsorsModuleData>>;
type SponsorItem = ModuleData["sponsors"][number];
type SlotItem = ModuleData["slots"][number];
type AdvertisementItem = ModuleData["advertisements"][number];
type TabId = "sponsors" | "slots" | "ads";

type SponsorManagerProps = {
  initialData: ModuleData;
};

const sponsorDefaults: SponsorInput = {
  name: "",
  description: "",
  category: "",
  logoUrl: "",
  websiteUrl: "",
  whatsappUrl: "",
  isActive: true,
};

const slotDefaults: AdSlotInput = {
  title: "",
  description: "",
  placement: AdPlacement.HOME_TOP,
  size: "",
  isActive: true,
};

const advertisementDefaults: AdvertisementInput = {
  sponsorId: "",
  adSlotId: "",
  title: "",
  description: "",
  imageUrl: "",
  targetUrl: "",
  startsAt: new Date(),
  endsAt: undefined,
  priority: 0,
  isActive: true,
};

const tabs = [
  { id: "sponsors", label: "Patrocinadores", icon: Users2 },
  { id: "slots", label: "Espacos de anuncio", icon: LayoutTemplate },
  { id: "ads", label: "Campanhas / Banners", icon: Megaphone },
] as const;

export function SponsorManager({ initialData }: SponsorManagerProps) {
  const [activeTab, setActiveTab] = useState<TabId>("sponsors");
  const [sponsors, setSponsors] = useState(initialData.sponsors);
  const [slots, setSlots] = useState(initialData.slots);
  const [advertisements, setAdvertisements] = useState(initialData.advertisements);
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editingAdvertisementId, setEditingAdvertisementId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const sponsorForm = useForm<SponsorInput>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: sponsorDefaults,
  });
  const slotForm = useForm<AdSlotInput>({
    resolver: zodResolver(adSlotSchema),
    defaultValues: slotDefaults,
  });
  const advertisementForm = useForm<AdvertisementInput>({
    resolver: zodResolver(advertisementSchema),
    defaultValues: advertisementDefaults,
  });

  const currentSponsor = useMemo(
    () => sponsors.find((item) => item.id === editingSponsorId),
    [sponsors, editingSponsorId],
  );
  const currentSlot = useMemo(() => slots.find((item) => item.id === editingSlotId), [slots, editingSlotId]);
  const currentAdvertisement = useMemo(
    () => advertisements.find((item) => item.id === editingAdvertisementId),
    [advertisements, editingAdvertisementId],
  );

  const startCreateSponsor = () => {
    setEditingSponsorId(null);
    setMessage(null);
    sponsorForm.reset(sponsorDefaults);
  };

  const startCreateSlot = () => {
    setEditingSlotId(null);
    setMessage(null);
    slotForm.reset(slotDefaults);
  };

  const startCreateAdvertisement = () => {
    setEditingAdvertisementId(null);
    setMessage(null);
    advertisementForm.reset(advertisementDefaults);
  };

  const startEditSponsor = (item: SponsorItem) => {
    setEditingSponsorId(item.id);
    setMessage(null);
    sponsorForm.reset({
      name: item.name,
      description: item.description || "",
      category: item.category,
      logoUrl: item.logoUrl || "",
      websiteUrl: item.websiteUrl || "",
      whatsappUrl: item.whatsappUrl || "",
      isActive: item.isActive,
    });
  };

  const startEditSlot = (item: SlotItem) => {
    setEditingSlotId(item.id);
    setMessage(null);
    slotForm.reset({
      title: item.title,
      description: item.description || "",
      placement: item.placement,
      size: item.size,
      isActive: item.isActive,
    });
  };

  const startEditAdvertisement = (item: AdvertisementItem) => {
    setEditingAdvertisementId(item.id);
    setMessage(null);
    advertisementForm.reset({
      sponsorId: item.sponsorId,
      adSlotId: item.adSlotId,
      title: item.title,
      description: item.description || "",
      imageUrl: item.imageUrl,
      targetUrl: item.targetUrl || "",
      startsAt: new Date(item.startsAt),
      endsAt: item.endsAt ? new Date(item.endsAt) : undefined,
      priority: item.priority,
      isActive: item.isActive,
    });
  };

  const submitSponsor = sponsorForm.handleSubmit(async (values) => {
    setMessage(null);
    const endpoint = editingSponsorId ? `/api/admin/sponsors/${editingSponsorId}` : "/api/admin/sponsors";
    const method = editingSponsorId ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await response.json().catch(() => null)) as { message?: string; sponsor?: SponsorItem } | null;

    if (!response.ok || !data?.sponsor) {
      setMessage(data?.message ?? "Nao foi possivel salvar o patrocinador.");
      return;
    }

    setSponsors((current) =>
      editingSponsorId ? current.map((item) => (item.id === data.sponsor!.id ? data.sponsor! : item)) : [data.sponsor!, ...current],
    );
    setMessage(data.message ?? "Patrocinador salvo com sucesso.");
    startEditSponsor(data.sponsor);
  });

  const submitSlot = slotForm.handleSubmit(async (values) => {
    setMessage(null);
    const endpoint = editingSlotId ? `/api/admin/ad-slots/${editingSlotId}` : "/api/admin/ad-slots";
    const method = editingSlotId ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await response.json().catch(() => null)) as { message?: string; slot?: SlotItem } | null;

    if (!response.ok || !data?.slot) {
      setMessage(data?.message ?? "Nao foi possivel salvar o espaco.");
      return;
    }

    setSlots((current) =>
      editingSlotId ? current.map((item) => (item.id === data.slot!.id ? data.slot! : item)) : [...current, data.slot!],
    );
    setMessage(data.message ?? "Espaco salvo com sucesso.");
    startEditSlot(data.slot);
  });

  const submitAdvertisement = advertisementForm.handleSubmit(async (values) => {
    setMessage(null);
    const endpoint = editingAdvertisementId ? `/api/admin/advertisements/${editingAdvertisementId}` : "/api/admin/advertisements";
    const method = editingAdvertisementId ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        startsAt: values.startsAt.toISOString(),
        endsAt: values.endsAt ? values.endsAt.toISOString() : undefined,
      }),
    });
    const data = (await response.json().catch(() => null)) as
      | { message?: string; advertisement?: AdvertisementItem }
      | null;

    if (!response.ok || !data?.advertisement) {
      setMessage(data?.message ?? "Nao foi possivel salvar a campanha.");
      return;
    }

    setAdvertisements((current) =>
      editingAdvertisementId
        ? current.map((item) => (item.id === data.advertisement!.id ? data.advertisement! : item))
        : [data.advertisement!, ...current],
    );
    setMessage(data.message ?? "Campanha salva com sucesso.");
    startEditAdvertisement(data.advertisement);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`premium-focus inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                active ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:text-slate-950"
              }`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {message ? <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div> : null}

      {activeTab === "sponsors" ? (
        <ResourceTabLayout
          emptyDescription="Cadastre apoiadores e parceiros para liberar campanhas institucionais."
          emptyTitle="Nenhum patrocinador cadastrado."
          form={
            <Card className="h-fit overflow-hidden border-slate-200 bg-white xl:sticky xl:top-6">
              <CardHeader className="border-b border-slate-200/80">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>{currentSponsor ? "Editar patrocinador" : "Novo patrocinador"}</CardTitle>
                    <CardDescription>Gestao institucional de apoiadores com links e identidade visual.</CardDescription>
                  </div>
                  <Button size="sm" type="button" variant="secondary" onClick={startCreateSponsor}>
                    <Plus className="h-4 w-4" />
                    Novo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-5" key={editingSponsorId ?? "new-sponsor"} onSubmit={submitSponsor}>
                  <FormField error={sponsorForm.formState.errors.name?.message} htmlFor="sponsor-name" label="Nome">
                    <Input id="sponsor-name" {...sponsorForm.register("name")} />
                  </FormField>
                  <FormField error={sponsorForm.formState.errors.description?.message} htmlFor="sponsor-description" label="Descricao">
                    <Textarea id="sponsor-description" {...sponsorForm.register("description")} />
                  </FormField>
                  <FormField error={sponsorForm.formState.errors.category?.message} htmlFor="sponsor-category" label="Categoria">
                    <Input id="sponsor-category" {...sponsorForm.register("category")} />
                  </FormField>
                  <FormField error={sponsorForm.formState.errors.logoUrl?.message} htmlFor="sponsor-logo" label="Logo URL">
                    <Input id="sponsor-logo" placeholder="https://..." {...sponsorForm.register("logoUrl")} />
                  </FormField>
                  <FormField error={sponsorForm.formState.errors.websiteUrl?.message} htmlFor="sponsor-site" label="Website URL">
                    <Input id="sponsor-site" placeholder="https://..." {...sponsorForm.register("websiteUrl")} />
                  </FormField>
                  <FormField error={sponsorForm.formState.errors.whatsappUrl?.message} htmlFor="sponsor-whatsapp" label="WhatsApp URL">
                    <Input id="sponsor-whatsapp" placeholder="https://wa.me/..." {...sponsorForm.register("whatsappUrl")} />
                  </FormField>
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <Checkbox defaultChecked {...sponsorForm.register("isActive")} />
                    <span>
                      <strong className="block text-slate-950">Patrocinador ativo</strong>
                      Permite vincular campanhas e exibir o apoiador na area publica.
                    </span>
                  </label>
                  <SubmitButton loading={sponsorForm.formState.isSubmitting}>Salvar patrocinador</SubmitButton>
                </form>
              </CardContent>
            </Card>
          }
          items={sponsors.map((item) => (
            <EntityCard
              key={item.id}
              badges={[
                { label: item.isActive ? "Ativo" : "Inativo", variant: item.isActive ? "success" : "muted" },
                { label: item.category, variant: "muted" },
                { label: `${item._count.advertisements} campanhas`, variant: "muted" },
              ]}
              description={item.description || "Sem descricao institucional."}
              footer={`${item.websiteUrl || "Sem site"} • ${item.whatsappUrl || "Sem WhatsApp"}`}
              onDelete={() => handleDelete(`/api/admin/sponsors/${item.id}`, "sponsor", item.id)}
              onEdit={() => startEditSponsor(item)}
              onToggle={() => quickUpdate(`/api/admin/sponsors/${item.id}`, "sponsor", {
                name: item.name,
                description: item.description || "",
                category: item.category,
                logoUrl: item.logoUrl || "",
                websiteUrl: item.websiteUrl || "",
                whatsappUrl: item.whatsappUrl || "",
                isActive: !item.isActive,
              })}
              title={item.name}
              toggleLabel={item.isActive ? "Desativar" : "Ativar"}
            />
          ))}
        />
      ) : null}

      {activeTab === "slots" ? (
        <ResourceTabLayout
          emptyDescription="Crie espacos reservados para organizar banners por placement."
          emptyTitle="Nenhum espaco cadastrado."
          form={
            <Card className="h-fit overflow-hidden border-slate-200 bg-white xl:sticky xl:top-6">
              <CardHeader className="border-b border-slate-200/80">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>{currentSlot ? "Editar espaco" : "Novo espaco"}</CardTitle>
                    <CardDescription>Reserve placements discretos sem poluir a navegacao publica.</CardDescription>
                  </div>
                  <Button size="sm" type="button" variant="secondary" onClick={startCreateSlot}>
                    <Plus className="h-4 w-4" />
                    Novo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-5" key={editingSlotId ?? "new-slot"} onSubmit={submitSlot}>
                  <FormField error={slotForm.formState.errors.title?.message} htmlFor="slot-title" label="Titulo">
                    <Input id="slot-title" {...slotForm.register("title")} />
                  </FormField>
                  <FormField error={slotForm.formState.errors.description?.message} htmlFor="slot-description" label="Descricao">
                    <Textarea id="slot-description" {...slotForm.register("description")} />
                  </FormField>
                  <FormField error={slotForm.formState.errors.placement?.message} htmlFor="slot-placement" label="Placement">
                    <Select id="slot-placement" {...slotForm.register("placement")}>
                      {Object.values(AdPlacement).map((placement) => (
                        <option key={placement} value={placement}>{adPlacementLabels[placement]}</option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField error={slotForm.formState.errors.size?.message} htmlFor="slot-size" label="Tamanho">
                    <Input id="slot-size" placeholder="1200x320" {...slotForm.register("size")} />
                  </FormField>
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <Checkbox defaultChecked {...slotForm.register("isActive")} />
                    <span>
                      <strong className="block text-slate-950">Espaco ativo</strong>
                      Permite receber campanhas e entrar no pool publico do placement.
                    </span>
                  </label>
                  <SubmitButton loading={slotForm.formState.isSubmitting}>Salvar espaco</SubmitButton>
                </form>
              </CardContent>
            </Card>
          }
          items={slots.map((item) => (
            <EntityCard
              key={item.id}
              badges={[
                { label: item.isActive ? "Ativo" : "Inativo", variant: item.isActive ? "success" : "muted" },
                { label: adPlacementLabels[item.placement], variant: "muted" },
                { label: `${item._count.advertisements} campanhas`, variant: "muted" },
              ]}
              description={item.description || "Sem descricao institucional."}
              footer={`Tamanho: ${item.size}`}
              onDelete={() => handleDelete(`/api/admin/ad-slots/${item.id}`, "slot", item.id)}
              onEdit={() => startEditSlot(item)}
              onToggle={() => quickUpdate(`/api/admin/ad-slots/${item.id}`, "slot", {
                title: item.title,
                description: item.description || "",
                placement: item.placement,
                size: item.size,
                isActive: !item.isActive,
              })}
              title={item.title}
              toggleLabel={item.isActive ? "Desativar" : "Ativar"}
            />
          ))}
        />
      ) : null}

      {activeTab === "ads" ? (
        <ResourceTabLayout
          emptyDescription="Vincule patrocinador, placement e banner para ativar campanhas."
          emptyTitle="Nenhuma campanha cadastrada."
          form={
            <Card className="h-fit overflow-hidden border-slate-200 bg-white xl:sticky xl:top-6">
              <CardHeader className="border-b border-slate-200/80">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>{currentAdvertisement ? "Editar campanha" : "Nova campanha"}</CardTitle>
                    <CardDescription>Banners responsivos com prioridade, janela de exibicao e destino configuravel.</CardDescription>
                  </div>
                  <Button size="sm" type="button" variant="secondary" onClick={startCreateAdvertisement}>
                    <Plus className="h-4 w-4" />
                    Novo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-5" key={editingAdvertisementId ?? "new-ad"} onSubmit={submitAdvertisement}>
                  <FormField error={advertisementForm.formState.errors.sponsorId?.message} htmlFor="ad-sponsor" label="Patrocinador">
                    <Select id="ad-sponsor" {...advertisementForm.register("sponsorId")}>
                      <option value="">Selecione</option>
                      {sponsors.map((sponsor) => <option key={sponsor.id} value={sponsor.id}>{sponsor.name}</option>)}
                    </Select>
                  </FormField>
                  <FormField error={advertisementForm.formState.errors.adSlotId?.message} htmlFor="ad-slot" label="Espaco de anuncio">
                    <Select id="ad-slot" {...advertisementForm.register("adSlotId")}>
                      <option value="">Selecione</option>
                      {slots.map((slot) => <option key={slot.id} value={slot.id}>{slot.title} • {adPlacementLabels[slot.placement]}</option>)}
                    </Select>
                  </FormField>
                  <FormField error={advertisementForm.formState.errors.title?.message} htmlFor="ad-title" label="Titulo">
                    <Input id="ad-title" {...advertisementForm.register("title")} />
                  </FormField>
                  <FormField error={advertisementForm.formState.errors.description?.message} htmlFor="ad-description" label="Descricao">
                    <Textarea id="ad-description" {...advertisementForm.register("description")} />
                  </FormField>
                  <FormField error={advertisementForm.formState.errors.imageUrl?.message} htmlFor="ad-image" label="Imagem do banner">
                    <Input id="ad-image" placeholder="https://..." {...advertisementForm.register("imageUrl")} />
                  </FormField>
                  <FormField error={advertisementForm.formState.errors.targetUrl?.message} htmlFor="ad-target" label="Link de destino">
                    <Input id="ad-target" placeholder="https://..." {...advertisementForm.register("targetUrl")} />
                  </FormField>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField error={advertisementForm.formState.errors.startsAt?.message as string | undefined} htmlFor="ad-start" label="Data inicial">
                      <Input
                        id="ad-start"
                        type="datetime-local"
                        onChange={(event) => advertisementForm.setValue("startsAt", new Date(event.target.value))}
                        defaultValue={currentAdvertisement ? new Date(currentAdvertisement.startsAt).toISOString().slice(0, 16) : ""}
                      />
                    </FormField>
                    <FormField error={advertisementForm.formState.errors.endsAt?.message as string | undefined} htmlFor="ad-end" label="Data final">
                      <Input
                        id="ad-end"
                        type="datetime-local"
                        onChange={(event) => advertisementForm.setValue("endsAt", event.target.value ? new Date(event.target.value) : undefined)}
                        defaultValue={currentAdvertisement?.endsAt ? new Date(currentAdvertisement.endsAt).toISOString().slice(0, 16) : ""}
                      />
                    </FormField>
                  </div>
                  <FormField error={advertisementForm.formState.errors.priority?.message} htmlFor="ad-priority" label="Prioridade">
                    <Input id="ad-priority" type="number" {...advertisementForm.register("priority", { valueAsNumber: true })} />
                  </FormField>
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <Checkbox defaultChecked {...advertisementForm.register("isActive")} />
                    <span>
                      <strong className="block text-slate-950">Campanha ativa</strong>
                      Exibe o banner apenas dentro da janela configurada e se patrocinador e slot tambem estiverem ativos.
                    </span>
                  </label>
                  <SubmitButton loading={advertisementForm.formState.isSubmitting}>Salvar campanha</SubmitButton>
                </form>
              </CardContent>
            </Card>
          }
          items={advertisements.map((item) => (
            <EntityCard
              key={item.id}
              badges={[
                { label: item.isActive ? "Ativa" : "Inativa", variant: item.isActive ? "success" : "muted" },
                { label: item.sponsor.name, variant: "muted" },
                { label: adPlacementLabels[item.adSlot.placement], variant: "muted" },
              ]}
              description={item.description || "Sem descricao institucional."}
              footer={`Prioridade ${item.priority} • ${new Date(item.startsAt).toLocaleString("pt-BR")}${item.endsAt ? ` ate ${new Date(item.endsAt).toLocaleString("pt-BR")}` : ""}`}
              onDelete={() => handleDelete(`/api/admin/advertisements/${item.id}`, "advertisement", item.id)}
              onEdit={() => startEditAdvertisement(item)}
              onToggle={() => quickUpdate(`/api/admin/advertisements/${item.id}`, "advertisement", {
                sponsorId: item.sponsorId,
                adSlotId: item.adSlotId,
                title: item.title,
                description: item.description || "",
                imageUrl: item.imageUrl,
                targetUrl: item.targetUrl || "",
                startsAt: new Date(item.startsAt).toISOString(),
                endsAt: item.endsAt ? new Date(item.endsAt).toISOString() : undefined,
                priority: item.priority,
                isActive: !item.isActive,
              })}
              title={item.title}
              toggleLabel={item.isActive ? "Desativar" : "Ativar"}
            />
          ))}
        />
      ) : null}
    </div>
  );

  async function quickUpdate(endpoint: string, kind: "sponsor" | "slot" | "advertisement", payload: Record<string, unknown>) {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => null)) as
      | { sponsor?: SponsorItem; slot?: SlotItem; advertisement?: AdvertisementItem; message?: string }
      | null;

    if (!response.ok) {
      setMessage(data?.message ?? "Nao foi possivel atualizar o item.");
      return;
    }

    if (kind === "sponsor" && data?.sponsor) {
      setSponsors((current) => current.map((item) => (item.id === data.sponsor!.id ? data.sponsor! : item)));
      if (editingSponsorId === data.sponsor.id) startEditSponsor(data.sponsor);
    }

    if (kind === "slot" && data?.slot) {
      setSlots((current) => current.map((item) => (item.id === data.slot!.id ? data.slot! : item)));
      if (editingSlotId === data.slot.id) startEditSlot(data.slot);
    }

    if (kind === "advertisement" && data?.advertisement) {
      setAdvertisements((current) => current.map((item) => (item.id === data.advertisement!.id ? data.advertisement! : item)));
      if (editingAdvertisementId === data.advertisement.id) startEditAdvertisement(data.advertisement);
    }
  }

  async function handleDelete(endpoint: string, kind: "sponsor" | "slot" | "advertisement", id: string) {
    if (!window.confirm("Confirma a exclusao deste item?")) return;

    const response = await fetch(endpoint, { method: "DELETE" });
    const data = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      setMessage(data?.message ?? "Nao foi possivel excluir o item.");
      return;
    }

    if (kind === "sponsor") {
      setSponsors((current) => current.filter((item) => item.id !== id));
      if (editingSponsorId === id) startCreateSponsor();
    }

    if (kind === "slot") {
      setSlots((current) => current.filter((item) => item.id !== id));
      if (editingSlotId === id) startCreateSlot();
    }

    if (kind === "advertisement") {
      setAdvertisements((current) => current.filter((item) => item.id !== id));
      if (editingAdvertisementId === id) startCreateAdvertisement();
    }

    setMessage(data?.message ?? "Item excluido com sucesso.");
  }
}

function ResourceTabLayout({
  items,
  form,
  emptyTitle,
  emptyDescription,
}: {
  items: React.ReactNode[];
  form: React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        {items.length > 0 ? items : <EmptyState description={emptyDescription} title={emptyTitle} />}
      </div>
      {form}
    </div>
  );
}

function EntityCard({
  title,
  description,
  footer,
  badges,
  onEdit,
  onToggle,
  onDelete,
  toggleLabel,
}: {
  title: string;
  description: string;
  footer: string;
  badges: Array<{ label: string; variant: "muted" | "success" }>;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  toggleLabel: string;
}) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white">
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {badges.map((badge) => (
            <Badge key={`${title}-${badge.label}`} variant={badge.variant}>{badge.label}</Badge>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h3>
          <p className="text-sm leading-7 text-slate-600">{description}</p>
        </div>
        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">{footer}</div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" type="button" variant="secondary" onClick={onEdit}>Editar</Button>
          <Button size="sm" type="button" variant="ghost" onClick={onToggle}>{toggleLabel}</Button>
          <Button size="sm" type="button" variant="ghost" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <Button className="w-full" disabled={loading} type="submit">
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {children}
    </Button>
  );
}
