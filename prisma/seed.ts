import {
  NotificationChannel,
  NotificationStatus,
  PrismaClient,
  ReportActivityType,
  ReportCategory,
  ReportPriority,
  ReportSeverity,
  ReportStatus,
  UserRole,
} from "@prisma/client";

import { authConfig } from "../lib/auth/config";
import { hashPassword } from "../lib/auth/password";
import { getReportSlaWindow } from "../lib/reports";

const prisma = new PrismaClient();

type ReportSeed = {
  title: string;
  description: string;
  category: ReportCategory;
  severity: ReportSeverity;
  status: ReportStatus;
  priority: ReportPriority;
  address: string;
  neighborhood: string;
  latitude: string | null;
  longitude: string | null;
  managerComment: string | null;
  assignedToUserId: string | null;
  submittedByName: string;
  submittedByEmail?: string;
  submittedByPhone?: string;
  allowEmailUpdates?: boolean;
  allowWhatsappUpdates?: boolean;
  internalComment: string;
  withNotification: boolean;
};

type NoticeSeed = {
  title: string;
  description: string;
  category: string;
  isFeatured: boolean;
  publishedAt: Date;
};

type EventSeed = {
  title: string;
  description: string;
  location: string;
  startsAt: Date;
};

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL nao foi configurada. Copie .env.example para .env antes de rodar o seed.",
    );
  }

  const adminEmail = authConfig.adminSeedEmail.toLowerCase();
  const passwordHash = await hashPassword(authConfig.adminSeedPassword);

  const organization = await prisma.organization.upsert({
    where: { slug: "promorar-conectado" },
    update: { name: "Promorar Conectado" },
    create: {
      slug: "promorar-conectado",
      name: "Promorar Conectado",
    },
  });

  const community = await prisma.community.upsert({
    where: {
      organizationId_slug: {
        organizationId: organization.id,
        slug: "promorar",
      },
    },
    update: {
      name: "Comunidade Promorar",
      description: "Comunidade base usada para demonstracao, operacao local e futura evolucao multi-tenant.",
    },
    create: {
      organizationId: organization.id,
      slug: "promorar",
      name: "Comunidade Promorar",
      description: "Comunidade base usada para demonstracao, operacao local e futura evolucao multi-tenant.",
    },
  });

  const [adminUser, managerUser, editorUser, volunteerUser] = await Promise.all([
    prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        name: "Administrador",
        passwordHash,
        role: UserRole.ADMIN,
        isActive: true,
        organizationId: organization.id,
        communityId: community.id,
      },
      create: {
        name: "Administrador",
        email: adminEmail,
        passwordHash,
        role: UserRole.ADMIN,
        isActive: true,
        organizationId: organization.id,
        communityId: community.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "gestao@promorar.local" },
      update: {
        name: "Gestora Comunitaria",
        passwordHash,
        role: UserRole.MANAGER,
        isActive: true,
        organizationId: organization.id,
        communityId: community.id,
      },
      create: {
        name: "Gestora Comunitaria",
        email: "gestao@promorar.local",
        passwordHash,
        role: UserRole.MANAGER,
        isActive: true,
        organizationId: organization.id,
        communityId: community.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "editor@promorar.local" },
      update: {
        name: "Editor de Conteudo",
        passwordHash,
        role: UserRole.EDITOR,
        isActive: true,
        organizationId: organization.id,
        communityId: community.id,
      },
      create: {
        name: "Editor de Conteudo",
        email: "editor@promorar.local",
        passwordHash,
        role: UserRole.EDITOR,
        isActive: true,
        organizationId: organization.id,
        communityId: community.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "voluntario@promorar.local" },
      update: {
        name: "Voluntario de Campo",
        passwordHash,
        role: UserRole.VOLUNTEER,
        isActive: true,
        organizationId: organization.id,
        communityId: community.id,
      },
      create: {
        name: "Voluntario de Campo",
        email: "voluntario@promorar.local",
        passwordHash,
        role: UserRole.VOLUNTEER,
        isActive: true,
        organizationId: organization.id,
        communityId: community.id,
      },
    }),
  ]);

  const noticeSeeds: NoticeSeed[] = [
    {
      title: "Acao social neste sabado na quadra do bairro",
      description:
        "Voluntarios, igrejas e projetos locais vao oferecer orientacao, lanche e atividades para familias da comunidade a partir das 8h.",
      category: "Acao social",
      isFeatured: true,
      publishedAt: new Date("2026-04-19T09:00:00.000Z"),
    },
    {
      title: "Reuniao aberta com liderancas comunitarias",
      description:
        "Moradores estao convidados para uma conversa sobre prioridades do bairro, seguranca local e acompanhamento das demandas registradas.",
      category: "Participacao comunitaria",
      isFeatured: true,
      publishedAt: new Date("2026-04-18T15:30:00.000Z"),
    },
    {
      title: "Campanha de arrecadacao para familias em vulnerabilidade",
      description:
        "A coleta segue durante toda a semana com foco em alimentos nao pereciveis, produtos de higiene e roupas em bom estado.",
      category: "Solidariedade",
      isFeatured: false,
      publishedAt: new Date("2026-04-17T12:00:00.000Z"),
    },
    {
      title: "Novo horario de atendimento na base comunitaria",
      description:
        "O atendimento presencial passara a acontecer em novo horario para melhorar o acolhimento, a triagem de demandas e a orientacao das familias.",
      category: "Comunicado oficial",
      isFeatured: false,
      publishedAt: new Date("2026-04-16T14:00:00.000Z"),
    },
  ];

  for (const noticeSeed of noticeSeeds) {
    const existingNotice = await prisma.notice.findFirst({
      where: {
        title: noticeSeed.title,
        organizationId: organization.id,
        communityId: community.id,
      },
      select: { id: true },
    });

    if (existingNotice) {
      await prisma.notice.update({
        where: { id: existingNotice.id },
        data: {
          description: noticeSeed.description,
          category: noticeSeed.category,
          isFeatured: noticeSeed.isFeatured,
          isActive: true,
          publishedAt: noticeSeed.publishedAt,
        },
      });
    } else {
      await prisma.notice.create({
        data: {
          title: noticeSeed.title,
          description: noticeSeed.description,
          category: noticeSeed.category,
          isFeatured: noticeSeed.isFeatured,
          isActive: true,
          organizationId: organization.id,
          communityId: community.id,
          publishedAt: noticeSeed.publishedAt,
        },
      });
    }
  }

  const eventSeeds: EventSeed[] = [
    {
      title: "Culto comunitario de gratidao e acolhimento",
      description:
        "Encontro aberto para oracao, partilha e fortalecimento da convivencia comunitaria no bairro.",
      location: "Igreja Comunidade da Esperanca",
      startsAt: new Date("2026-04-24T22:00:00.000Z"),
    },
    {
      title: "Distribuicao de cestas basicas para familias cadastradas",
      description:
        "Acao organizada com apoio de voluntarios locais para atender familias acompanhadas por iniciativas sociais da regiao.",
      location: "Centro Comunitario Promorar",
      startsAt: new Date("2026-04-25T13:00:00.000Z"),
    },
    {
      title: "Mutirao de limpeza nas ruas principais",
      description:
        "Moradores e parceiros vao atuar juntos para recolher entulho, reforcar cuidados com o bairro e mapear pontos criticos.",
      location: "Concentracao na Praca Central",
      startsAt: new Date("2026-04-26T12:30:00.000Z"),
    },
    {
      title: "Encontro de jovens com esporte, escuta e orientacao",
      description:
        "Programacao com dinamicas, escuta ativa e incentivo a participacao dos jovens nas acoes comunitarias.",
      location: "Quadra do Promorar",
      startsAt: new Date("2026-04-27T22:30:00.000Z"),
    },
  ];

  for (const eventSeed of eventSeeds) {
    const existingEvent = await prisma.event.findFirst({
      where: {
        title: eventSeed.title,
        organizationId: organization.id,
        communityId: community.id,
      },
      select: { id: true },
    });

    if (existingEvent) {
      await prisma.event.update({
        where: { id: existingEvent.id },
        data: {
          description: eventSeed.description,
          location: eventSeed.location,
          startsAt: eventSeed.startsAt,
          imageUrl: null,
          isActive: true,
        },
      });
    } else {
      await prisma.event.create({
        data: {
          title: eventSeed.title,
          description: eventSeed.description,
          location: eventSeed.location,
          startsAt: eventSeed.startsAt,
          imageUrl: null,
          isActive: true,
          organizationId: organization.id,
          communityId: community.id,
        },
      });
    }
  }

  const reportSeeds: ReportSeed[] = [
    {
      title: "Buraco grande na rua principal proximo ao ponto de onibus",
      description:
        "O buraco aumentou nos ultimos dias e esta dificultando a passagem de carros, motos e moradores que caminham no trecho.",
      category: ReportCategory.INFRASTRUCTURE,
      severity: ReportSeverity.HIGH,
      status: ReportStatus.IN_REVIEW,
      priority: ReportPriority.HIGH,
      address: "Avenida Principal, proximo ao ponto de onibus",
      neighborhood: "Promorar",
      latitude: "-3.1218000",
      longitude: "-60.0197000",
      managerComment: "Registro enviado para avaliacao inicial com apoio das liderancas locais e segue em acompanhamento.",
      assignedToUserId: managerUser.id,
      submittedByName: "Maria da Silva",
      submittedByEmail: "maria@bairro.local",
      allowEmailUpdates: true,
      internalComment: "Aguardando agenda da equipe de infraestrutura.",
      withNotification: true,
    },
    {
      title: "Poste sem iluminacao perto da escola municipal",
      description:
        "Moradores relataram que o local fica muito escuro no inicio da noite, especialmente no horario de saida das criancas.",
      category: ReportCategory.LIGHTING,
      severity: ReportSeverity.URGENT,
      status: ReportStatus.OPEN,
      priority: ReportPriority.URGENT,
      address: "Rua da Escola, esquina com Rua das Flores",
      neighborhood: "Promorar",
      latitude: "-3.1203000",
      longitude: "-60.0222000",
      managerComment: null,
      assignedToUserId: null,
      submittedByName: "Jose Ferreira",
      submittedByPhone: "+55 92 99999-1000",
      allowWhatsappUpdates: true,
      internalComment: "Precisa de resposta rapida por risco em horario escolar.",
      withNotification: false,
    },
    {
      title: "Lixo acumulado em area de circulacao de pedestres",
      description:
        "Sacos e entulho estao acumulados ha dias, atrapalhando a passagem e trazendo preocupacao com mau cheiro e insetos.",
      category: ReportCategory.CLEANING,
      severity: ReportSeverity.MEDIUM,
      status: ReportStatus.IN_PROGRESS,
      priority: ReportPriority.MEDIUM,
      address: "Travessa Nova Vida, ao lado do mercadinho",
      neighborhood: "Nova Esperanca",
      latitude: null,
      longitude: null,
      managerComment: "Moradores organizaram um ponto de apoio enquanto aguardam solucao definitiva e a demanda segue visivel no acompanhamento.",
      assignedToUserId: editorUser.id,
      submittedByName: "Lucia Ramos",
      allowEmailUpdates: false,
      internalComment: "Manter acompanhamento visual no mapa mesmo sem coordenadas.",
      withNotification: false,
    },
    {
      title: "Falta de acessibilidade na entrada da unidade comunitaria",
      description:
        "A entrada principal nao tem rampa adequada e dificulta o acesso de cadeirantes, idosos e pessoas com mobilidade reduzida.",
      category: ReportCategory.ACCESSIBILITY,
      severity: ReportSeverity.HIGH,
      status: ReportStatus.IN_REVIEW,
      priority: ReportPriority.HIGH,
      address: "Centro Comunitario Promorar",
      neighborhood: "Promorar",
      latitude: "-3.1187000",
      longitude: "-60.0204000",
      managerComment: "Demanda priorizada para levantamento tecnico e proposta de adequacao com foco em acesso digno.",
      assignedToUserId: managerUser.id,
      submittedByName: "Ana Beatriz",
      submittedByEmail: "ana@bairro.local",
      allowEmailUpdates: true,
      internalComment: "Avaliar parceria com associacao local e obra de baixo custo.",
      withNotification: true,
    },
    {
      title: "Relatos de inseguranca no fim da noite em rua lateral",
      description:
        "Moradores pedem mais visibilidade para situacoes recorrentes de intimidacao e movimentacao suspeita em uma rua lateral.",
      category: ReportCategory.SECURITY,
      severity: ReportSeverity.HIGH,
      status: ReportStatus.OPEN,
      priority: ReportPriority.HIGH,
      address: "Rua Sao Marcos, trecho final",
      neighborhood: "Nova Esperanca",
      latitude: "-3.1232000",
      longitude: "-60.0179000",
      managerComment: null,
      assignedToUserId: null,
      submittedByName: "Carlos Viana",
      submittedByPhone: "+55 92 99999-2000",
      allowWhatsappUpdates: true,
      internalComment: "Mapear recorrencia com liderancas e horario de maior risco.",
      withNotification: false,
    },
    {
      title: "Calcada danificada em frente ao posto de atendimento",
      description:
        "O piso esta quebrado e cria risco de queda para idosos, criancas e pessoas que passam diariamente pelo local.",
      category: ReportCategory.INFRASTRUCTURE,
      severity: ReportSeverity.MEDIUM,
      status: ReportStatus.RESOLVED,
      priority: ReportPriority.MEDIUM,
      address: "Rua do Atendimento, 45",
      neighborhood: "Promorar",
      latitude: "-3.1199000",
      longitude: "-60.0211000",
      managerComment: "A equipe comunitaria informou que o reparo emergencial ja foi realizado e o fluxo de passagem foi normalizado.",
      assignedToUserId: managerUser.id,
      submittedByName: "Renata Souza",
      submittedByEmail: "renata@bairro.local",
      allowEmailUpdates: true,
      internalComment: "Caso mantido como referencia positiva de resolucao.",
      withNotification: true,
    },
  ];

  for (const [index, reportSeed] of reportSeeds.entries()) {
    const createdAt = new Date(Date.UTC(2026, 3, 15 + index, 14, 0));
    const slaWindow = getReportSlaWindow(reportSeed.status, reportSeed.priority, createdAt);

    const existingReport = await prisma.report.findFirst({
      where: {
        title: reportSeed.title,
        organizationId: organization.id,
        communityId: community.id,
      },
      select: { id: true },
    });

    const reportPayload = {
      title: reportSeed.title,
      description: reportSeed.description,
      category: reportSeed.category,
      severity: reportSeed.severity,
      status: reportSeed.status,
      priority: reportSeed.priority,
      address: reportSeed.address,
      neighborhood: reportSeed.neighborhood,
      latitude: reportSeed.latitude,
      longitude: reportSeed.longitude,
      imageUrl: null,
      managerComment: reportSeed.managerComment,
      organizationId: organization.id,
      communityId: community.id,
      assignedToUserId: reportSeed.assignedToUserId,
      submittedByName: reportSeed.submittedByName,
      submittedByEmail: reportSeed.submittedByEmail ?? null,
      submittedByPhone: reportSeed.submittedByPhone ?? null,
      allowEmailUpdates: reportSeed.allowEmailUpdates ?? false,
      allowWhatsappUpdates: reportSeed.allowWhatsappUpdates ?? false,
      relevantUpdatedAt: createdAt,
      lastStatusChangedAt: createdAt,
      lastActivityAt: createdAt,
      firstResponseDueAt: slaWindow.firstResponseDueAt,
      resolutionDueAt: slaWindow.resolutionDueAt,
      closedAt:
        reportSeed.status === ReportStatus.RESOLVED
          ? new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000)
          : null,
      createdAt,
    };

    const report = existingReport
      ? await prisma.report.update({
          where: { id: existingReport.id },
          data: reportPayload,
        })
      : await prisma.report.create({
          data: reportPayload,
        });

    await prisma.notificationDelivery.deleteMany({
      where: { reportId: report.id },
    });
    await prisma.reportActivity.deleteMany({
      where: { reportId: report.id },
    });
    await prisma.reportComment.deleteMany({
      where: { reportId: report.id },
    });

    await prisma.reportActivity.create({
      data: {
        reportId: report.id,
        actorUserId: volunteerUser.id,
        type: ReportActivityType.CREATED,
        message: "Ocorrencia inserida pela base de seed como simulacao de entrada do portal publico.",
        createdAt,
      },
    });

    await prisma.reportComment.create({
      data: {
        reportId: report.id,
        authorUserId: managerUser.id,
        body: reportSeed.internalComment,
        isInternal: true,
        createdAt: new Date(createdAt.getTime() + 30 * 60 * 1000),
      },
    });

    if (reportSeed.managerComment) {
      await prisma.reportComment.create({
        data: {
          reportId: report.id,
          authorUserId: managerUser.id,
          body: reportSeed.managerComment,
          isInternal: false,
          createdAt: new Date(createdAt.getTime() + 60 * 60 * 1000),
        },
      });
    }

    if (reportSeed.assignedToUserId) {
      await prisma.reportActivity.create({
        data: {
          reportId: report.id,
          actorUserId: adminUser.id,
          type: ReportActivityType.ASSIGNED,
          message: "Responsavel inicial definido para a demanda.",
          createdAt: new Date(createdAt.getTime() + 15 * 60 * 1000),
        },
      });
    }

    if (reportSeed.status !== ReportStatus.OPEN) {
      await prisma.reportActivity.create({
        data: {
          reportId: report.id,
          actorUserId: managerUser.id,
          type: ReportActivityType.STATUS_CHANGED,
          fromStatus: ReportStatus.OPEN,
          toStatus: reportSeed.status,
          message: `Status atualizado para ${reportSeed.status}.`,
          createdAt: new Date(createdAt.getTime() + 45 * 60 * 1000),
        },
      });
    }

    if (reportSeed.withNotification && (reportSeed.submittedByEmail || reportSeed.submittedByPhone)) {
      await prisma.notificationDelivery.create({
        data: {
          reportId: report.id,
          organizationId: organization.id,
          channel: reportSeed.submittedByEmail ? NotificationChannel.EMAIL : NotificationChannel.WHATSAPP,
          status: NotificationStatus.PENDING,
          recipient: reportSeed.submittedByEmail || reportSeed.submittedByPhone || "destino-pendente",
          templateKey: "report-status-update",
          payload: {
            reportTitle: report.title,
            status: report.status,
          },
          createdAt: new Date(createdAt.getTime() + 90 * 60 * 1000),
        },
      });

      await prisma.reportActivity.create({
        data: {
          reportId: report.id,
          actorUserId: managerUser.id,
          type: ReportActivityType.NOTIFICATION_QUEUED,
          message: "Atualizacao preparada para envio ao morador.",
          createdAt: new Date(createdAt.getTime() + 90 * 60 * 1000),
        },
      });
    }
  }

  console.log("Seed concluido com sucesso.");
  console.log(`Admin: ${adminEmail}`);
  console.log(`Senha: ${authConfig.adminSeedPassword}`);
  console.log("Perfis criados: admin, manager, editor e volunteer.");
  console.log("Base sincronizada com organizacao/comunidade padrao, 4 avisos, 4 eventos e 6 ocorrencias.");
  console.log("Este seed e idempotente para os dados demo persistidos no banco.");
  console.log("Apoiadores demo permanecem estaticos no frontend e nao geram duplicacao no banco.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Falha desconhecida ao executar o seed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
