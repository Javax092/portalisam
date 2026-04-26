import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  CalendarRange,
  ClipboardList,
  HandHeart,
  HelpingHand,
  Heart,
  House,
  Megaphone,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  Store,
  SunMedium,
  Users,
  Accessibility,
} from "lucide-react";

import { WhatsAppCta } from "@/components/public/whatsapp-cta";
import { siteConfig } from "@/lib/site";

const quickLinks = [
  {
    title: "Ver avisos",
    description: "Acompanhe comunicados e recados importantes do portal comunitário.",
    href: "/portal",
    icon: BellRing,
    external: false,
  },
  {
    title: "Próximos eventos",
    description: "Confira ações sociais, encontros, campanhas e atividades no território.",
    href: "/portal",
    icon: CalendarRange,
    external: false,
  },
  {
    title: "Registrar demanda",
    description: "Informe problemas e necessidades da comunidade em poucos minutos.",
    href: "/report",
    icon: ClipboardList,
    external: false,
  },
  {
    title: "Apoiadores locais",
    description: `Saiba como apoiar a ${siteConfig.organizationName} e divulgar seu negócio no portal.`,
    href: siteConfig.whatsappAdsLink,
    icon: Store,
    external: true,
  },
] as const;

const portalFeatures = [
  {
    title: "Avisos da comunidade",
    description:
      "Recados importantes, atualizações do território e informações úteis reunidas em um canal oficial para os moradores.",
    icon: Megaphone,
  },
  {
    title: "Eventos e ações sociais",
    description:
      `Mutirões, campanhas, atendimentos e atividades da ${siteConfig.organizationName} com linguagem clara para quem participa pelo celular.`,
    icon: HandHeart,
  },
  {
    title: "Demandas acompanhadas",
    description:
      "Problemas e necessidades do Promorar registrados com mais contexto para facilitar encaminhamento e acompanhamento.",
    icon: BadgeCheck,
  },
] as const;

const actions = [
  {
    title: "Ações sociais",
    description: "Campanhas, mutirões e iniciativas que fortalecem o cuidado com a comunidade.",
    icon: Heart,
  },
  {
    title: "Atendimento comunitário",
    description: "Orientações, escuta e apoio para famílias que precisam de acompanhamento próximo.",
    icon: PhoneCall,
  },
  {
    title: "Campanhas solidárias",
    description: "Mobilizações para arrecadação, apoio emergencial e ações em rede com parceiros.",
    icon: HelpingHand,
  },
  {
    title: "Famílias, jovens e voluntários",
    description: "Atividades de convivência e participação para aproximar quem vive e apoia o Promorar.",
    icon: Users,
  },
] as const;

export function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <Sparkles className="h-4 w-4" />
              Portal oficial da comunidade
            </div>
            <div className="space-y-4">
              <h1 className="text-slate-950 font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl">
                Portal comunitário da ONG {siteConfig.organizationName}
              </h1>
              <p className="text-slate-950 text-xl font-semibold tracking-tight sm:text-2xl">
                Informação, ações sociais e demandas do Promorar em um só lugar.
              </p>
              <p className="text-slate-600 leading-7 max-w-2xl text-base sm:text-lg">
                O {siteConfig.portalName} aproxima moradores, voluntários, lideranças e apoiadores em uma plataforma
                simples para acompanhar avisos, eventos, necessidades do território e oportunidades de apoio.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                className="rounded-2xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm hover:bg-emerald-600 inline-flex items-center justify-center gap-2"
                href="/portal"
              >
                Acessar portal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 inline-flex items-center justify-center"
                href="/report"
              >
                Reportar demanda
              </Link>
              <WhatsAppCta className="rounded-2xl px-5 py-3" label="Quero apoiar" size="default" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Megaphone className="h-5 w-5" />
                </div>
                <h2 className="text-slate-950 font-bold tracking-tight text-lg">Comunicação confiável</h2>
                <p className="text-slate-600 leading-7 mt-2 text-sm">
                  Avisos e recados publicados em um ponto oficial para consulta da comunidade.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <CalendarRange className="h-5 w-5" />
                </div>
                <h2 className="text-slate-950 font-bold tracking-tight text-lg">Agenda de ações</h2>
                <p className="text-slate-600 leading-7 mt-2 text-sm">
                  Eventos, campanhas solidárias e atividades sociais organizadas em um só lugar.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:col-span-2">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                  <House className="h-5 w-5" />
                </div>
                <h2 className="text-slate-950 font-bold tracking-tight text-lg">
                  {siteConfig.portalName} é o portal comunitário da ONG {siteConfig.organizationName} para informar
                  moradores, divulgar ações sociais, registrar demandas do território e aproximar apoiadores da
                  comunidade.
                </h2>
                <p className="text-slate-600 leading-7 mt-2 text-sm">
                  A home direciona quem mora, participa ou apoia o {siteConfig.neighborhoodName} para as ações
                  principais sem parecer uma página de produto genérico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">Atalhos rápidos</p>
            <h2 className="text-slate-950 font-bold tracking-tight mt-2 text-3xl">Acesse o que importa agora</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-md"
                href={item.href}
                rel={item.external ? "noreferrer" : undefined}
                target={item.external ? "_blank" : undefined}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-slate-950 font-bold tracking-tight text-xl">{item.title}</h3>
                <p className="text-slate-600 leading-7 mt-2 text-sm">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">O que você encontra no portal</p>
          <h2 className="text-slate-950 font-bold tracking-tight mt-2 text-3xl sm:text-4xl">
            Conteúdo útil para quem vive e acompanha o Promorar
          </h2>
          <p className="text-slate-600 leading-7 mt-3">
            O portal foi organizado para facilitar a rotina dos moradores e dar mais visibilidade às ações da{" "}
            {siteConfig.organizationName}.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {portalFeatures.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-slate-950 font-bold tracking-tight text-xl">{item.title}</h3>
                <p className="text-slate-600 leading-7 mt-2">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">Ações da ISAM</p>
          <h2 className="text-slate-950 font-bold tracking-tight mt-2 text-3xl sm:text-4xl">
            Presença social próxima da comunidade
          </h2>
          <p className="text-slate-600 leading-7 mt-3">
            Esta seção destaca frentes que a {siteConfig.organizationName} pode comunicar no portal hoje e conectar a
            dados reais depois sem refazer a estrutura visual.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {actions.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-slate-950 font-bold tracking-tight text-xl">{item.title}</h3>
                <p className="text-slate-600 leading-7 mt-2">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">Demandas do território</p>
            <h2 className="text-slate-950 font-bold tracking-tight mt-2 text-3xl sm:text-4xl">
              Moradores podem registrar problemas e necessidades do dia a dia
            </h2>
            <p className="text-slate-600 leading-7 mt-3">
              O portal ajuda a organizar relatos da comunidade com mais contexto para acompanhamento e resposta.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { label: "Iluminação", icon: SunMedium },
                { label: "Limpeza", icon: Sparkles },
                { label: "Acessibilidade", icon: Accessibility },
                { label: "Segurança", icon: ShieldAlert },
                { label: "Apoio social", icon: HandHeart },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    <Icon className="h-4 w-4 text-emerald-700" />
                    {item.label}
                  </span>
                );
              })}
            </div>
            <div className="mt-6">
              <Link
                className="rounded-2xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm hover:bg-emerald-600 inline-flex items-center justify-center"
                href="/report"
              >
                Registrar demanda
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-emerald-50 to-slate-50 p-6 shadow-sm shadow-slate-200/70 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <BellRing className="h-5 w-5 text-emerald-700" />
                <p className="text-slate-950 font-bold tracking-tight mt-4 text-lg">Mais organização</p>
                <p className="text-slate-600 leading-7 mt-2 text-sm">
                  Cada registro ajuda a comunidade a dar visibilidade ao que precisa de atenção.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <Users className="h-5 w-5 text-emerald-700" />
                <p className="text-slate-950 font-bold tracking-tight mt-4 text-lg">Mais participação</p>
                <p className="text-slate-600 leading-7 mt-2 text-sm">
                  Moradores, lideranças e voluntários passam a colaborar com um fluxo simples.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">
                Apoiadores e anúncios locais
              </p>
              <h2 className="text-slate-950 font-bold tracking-tight mt-2 text-3xl sm:text-4xl">
                Apoie a comunidade e divulgue seu negócio
              </h2>
              <p className="text-slate-600 leading-7 mt-3 max-w-2xl">
                Negócios locais podem apoiar as ações da {siteConfig.organizationName} e aparecer no portal como
                apoiadores da comunidade.
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-slate-950 font-bold tracking-tight text-lg">Visibilidade com propósito</p>
              <p className="text-slate-600 leading-7 mt-2 text-sm">
                O espaço de apoiadores mantém a monetização com uma linguagem alinhada ao território e ao trabalho da ONG.
              </p>
              <div className="mt-5">
                <WhatsAppCta className="rounded-2xl px-5 py-3" label="Quero apoiar / anunciar" size="default" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl shadow-slate-300/30 sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-300">Participe do ISAM Conectado</p>
              <h2 className="font-bold tracking-tight mt-2 text-3xl sm:text-4xl">
                Participe do ISAM Conectado
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200">
                Acompanhe avisos, participe das ações sociais, registre demandas e fortaleça a comunidade do
                {` ${siteConfig.neighborhoodName}.`}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                className="rounded-2xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm hover:bg-emerald-600 inline-flex items-center justify-center"
                href="/portal"
              >
                Acessar portal
              </Link>
              <Link
                className="rounded-2xl border border-slate-600 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 inline-flex items-center justify-center"
                href="/report"
              >
                Reportar demanda
              </Link>
              <WhatsAppCta className="rounded-2xl px-5 py-3" fullWidth label="Quero apoiar" size="default" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
