import {
  AdPlacement,
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

import { hashPassword } from "../lib/auth/password";
import { getReportSlaWindow } from "../lib/reports";

const prisma = new PrismaClient();

type SeedMode = "prod" | "demo";

const DEFAULT_ADMIN_EMAIL = "admin@isam.org";
const DEFAULT_ASSISTANT_EMAIL = "assistente@isam.org";

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
  internalComment?: string;
  withNotification?: boolean;
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

const defaultAdSlots = [
  {
    title: "Home top",
    slug: "home-top",
    description: "Banner institucional discreto logo apos a abertura principal da home.",
    placement: AdPlacement.HOME_TOP,
    size: "1200x320",
  },
  {
    title: "Home middle",
    slug: "home-middle",
    description: "Espaco de apoio institucional no miolo da home publica.",
    placement: AdPlacement.HOME_MIDDLE,
    size: "1200x240",
  },
  {
    title: "Portal sidebar",
    slug: "portal-sidebar",
    description: "Espaco lateral para apoiadores e banners institucionais no portal.",
    placement: AdPlacement.PORTAL_SIDEBAR,
    size: "420x320",
  },
  {
    title: "Portal bottom",
    slug: "portal-bottom",
    description: "Espaco de rodape para parceiros do territorio na pagina do portal.",
    placement: AdPlacement.PORTAL_BOTTOM,
    size: "1200x220",
  },
  {
    title: "Reports bottom",
    slug: "reports-bottom",
    description: "Apoio comunitario no rodape da pagina de demandas.",
    placement: AdPlacement.REPORTS_BOTTOM,
    size: "1200x220",
  },
  {
    title: "Footer supporters",
    slug: "footer-supporters",
    description: "Lista de apoiadores ativos no rodape publico.",
    placement: AdPlacement.FOOTER_SUPPORTERS,
    size: "fluid",
  },
] as const;

function getSeedMode(): SeedMode {
  const argvMode = process.argv[2]?.trim().toLowerCase();
  const envMode = process.env.SEED_MODE?.trim().toLowerCase();
  const mode = argvMode || envMode || "prod";

  return mode === "demo" ? "demo" : "prod";
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`A variavel ${name} e obrigatoria para executar o seed.`);
  }

  return value;
}

function getOptionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

async function ensureBaseStructure() {
  const organization = await prisma.organization.upsert({
    where: { slug: "promorar-conectado" },
    update: { name: "ISAM", isActive: true },
    create: {
      slug: "promorar-conectado",
      name: "ISAM",
      isActive: true,
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
      description: "Comunidade base do portal ISAM Conectado.",
      isActive: true,
    },
    create: {
      organizationId: organization.id,
      slug: "promorar",
      name: "Comunidade Promorar",
      description: "Comunidade base do portal ISAM Conectado.",
      isActive: true,
    },
  });

  return { organization, community };
}

async function ensureInternalUsers(organizationId: string, communityId: string) {
  const adminEmail = (getOptionalEnv("ADMIN_DEFAULT_EMAIL") ?? DEFAULT_ADMIN_EMAIL).toLowerCase();
  const assistantEmail = (getOptionalEnv("ASSISTANT_DEFAULT_EMAIL") ?? DEFAULT_ASSISTANT_EMAIL).toLowerCase();
  const [adminPasswordHash, assistantPasswordHash] = await Promise.all([
    hashPassword(getRequiredEnv("ADMIN_DEFAULT_PASSWORD")),
    hashPassword(getRequiredEnv("ASSISTANT_DEFAULT_PASSWORD")),
  ]);

  const [adminUser, assistantUser] = await Promise.all([
    prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        name: "Admin principal",
        passwordHash: adminPasswordHash,
        role: UserRole.ADMIN,
        isActive: true,
        organizationId,
        communityId,
      },
      create: {
        name: "Admin principal",
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: UserRole.ADMIN,
        isActive: true,
        organizationId,
        communityId,
      },
    }),
    prisma.user.upsert({
      where: { email: assistantEmail },
      update: {
        name: "Assistente do admin",
        passwordHash: assistantPasswordHash,
        role: UserRole.ASSISTANT,
        isActive: true,
        organizationId,
        communityId,
      },
      create: {
        name: "Assistente do admin",
        email: assistantEmail,
        passwordHash: assistantPasswordHash,
        role: UserRole.ASSISTANT,
        isActive: true,
        organizationId,
        communityId,
      },
    }),
  ]);

  return { adminUser, assistantUser };
}

async function ensureDefaultAdSlots() {
  for (const slot of defaultAdSlots) {
    await prisma.adSlot.upsert({
      where: { slug: slot.slug },
      update: {
        title: slot.title,
        description: slot.description,
        placement: slot.placement,
        size: slot.size,
        isActive: true,
      },
      create: {
        title: slot.title,
        slug: slot.slug,
        description: slot.description,
        placement: slot.placement,
        size: slot.size,
        isActive: true,
      },
    });
  }
}

async function upsertDemoNotices(organizationId: string, communityId: string, noticeSeeds: NoticeSeed[]) {
  for (const noticeSeed of noticeSeeds) {
    const existingNotice = await prisma.notice.findFirst({
      where: {
        title: noticeSeed.title,
        organizationId,
        communityId,
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
      continue;
    }

    await prisma.notice.create({
      data: {
        title: noticeSeed.title,
        description: noticeSeed.description,
        category: noticeSeed.category,
        isFeatured: noticeSeed.isFeatured,
        isActive: true,
        organizationId,
        communityId,
        publishedAt: noticeSeed.publishedAt,
      },
    });
  }
}

async function upsertDemoEvents(organizationId: string, communityId: string, eventSeeds: EventSeed[]) {
  for (const eventSeed of eventSeeds) {
    const existingEvent = await prisma.event.findFirst({
      where: {
        title: eventSeed.title,
        organizationId,
        communityId,
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
          isActive: true,
        },
      });
      continue;
    }

    await prisma.event.create({
      data: {
        title: eventSeed.title,
        description: eventSeed.description,
        location: eventSeed.location,
        startsAt: eventSeed.startsAt,
        isActive: true,
        organizationId,
        communityId,
      },
    });
  }
}

async function upsertDemoReports(
  organizationId: string,
  communityId: string,
  adminUserId: string,
  reportSeeds: ReportSeed[],
) {
  for (const reportSeed of reportSeeds) {
    const existingReport = await prisma.report.findFirst({
      where: {
        title: reportSeed.title,
        organizationId,
        communityId,
      },
      select: { id: true },
    });

    const now = new Date();
    const slaWindow = getReportSlaWindow(reportSeed.status, reportSeed.priority, now);

    const report = existingReport
      ? await prisma.report.update({
          where: { id: existingReport.id },
          data: {
            description: reportSeed.description,
            category: reportSeed.category,
            severity: reportSeed.severity,
            status: reportSeed.status,
            priority: reportSeed.priority,
            address: reportSeed.address,
            neighborhood: reportSeed.neighborhood,
            latitude: reportSeed.latitude,
            longitude: reportSeed.longitude,
            managerComment: reportSeed.managerComment,
            assignedToUserId: reportSeed.assignedToUserId,
            submittedByName: reportSeed.submittedByName,
            submittedByEmail: reportSeed.submittedByEmail,
            submittedByPhone: reportSeed.submittedByPhone,
            allowEmailUpdates: reportSeed.allowEmailUpdates ?? false,
            allowWhatsappUpdates: reportSeed.allowWhatsappUpdates ?? false,
            firstResponseDueAt: slaWindow.firstResponseDueAt,
            resolutionDueAt: slaWindow.resolutionDueAt,
            relevantUpdatedAt: now,
            lastStatusChangedAt: now,
            lastActivityAt: now,
            organizationId,
            communityId,
          },
        })
      : await prisma.report.create({
          data: {
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
            managerComment: reportSeed.managerComment,
            assignedToUserId: reportSeed.assignedToUserId,
            submittedByName: reportSeed.submittedByName,
            submittedByEmail: reportSeed.submittedByEmail,
            submittedByPhone: reportSeed.submittedByPhone,
            allowEmailUpdates: reportSeed.allowEmailUpdates ?? false,
            allowWhatsappUpdates: reportSeed.allowWhatsappUpdates ?? false,
            firstResponseDueAt: slaWindow.firstResponseDueAt,
            resolutionDueAt: slaWindow.resolutionDueAt,
            relevantUpdatedAt: now,
            lastStatusChangedAt: now,
            lastActivityAt: now,
            organizationId,
            communityId,
          },
        });

    const hasCreatedActivity = await prisma.reportActivity.findFirst({
      where: { reportId: report.id, type: ReportActivityType.CREATED },
      select: { id: true },
    });

    if (!hasCreatedActivity) {
      await prisma.reportActivity.create({
        data: {
          reportId: report.id,
          actorUserId: adminUserId,
          type: ReportActivityType.CREATED,
          message: "Ocorrencia criada pelo seed demo.",
        },
      });
    }

    if (reportSeed.internalComment) {
      const hasInternalNote = await prisma.reportComment.findFirst({
        where: { reportId: report.id, body: reportSeed.internalComment },
        select: { id: true },
      });

      if (!hasInternalNote) {
        await prisma.reportComment.create({
          data: {
            reportId: report.id,
            authorUserId: adminUserId,
            body: reportSeed.internalComment,
            isInternal: true,
          },
        });
      }
    }

    if (reportSeed.withNotification && reportSeed.submittedByEmail) {
      const hasNotification = await prisma.notificationDelivery.findFirst({
        where: {
          reportId: report.id,
          recipient: reportSeed.submittedByEmail,
          channel: NotificationChannel.EMAIL,
        },
        select: { id: true },
      });

      if (!hasNotification) {
        await prisma.notificationDelivery.create({
          data: {
            reportId: report.id,
            organizationId,
            channel: NotificationChannel.EMAIL,
            status: NotificationStatus.PENDING,
            recipient: reportSeed.submittedByEmail,
            templateKey: "demo-report-update",
          },
        });
      }
    }
  }
}

async function seedDemo(organizationId: string, communityId: string, adminUserId: string, assistantUserId: string) {
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
  ];

  const eventSeeds: EventSeed[] = [
    {
      title: "Culto comunitario de gratidao e acolhimento",
      description:
        "Encontro aberto para oracao, partilha e fortalecimento da convivencia comunitaria no bairro.",
      location: "Igreja Comunidade da Esperanca",
      startsAt: new Date("2026-04-24T22:00:00.000Z"),
    },
    {
      title: "Mutirao de limpeza nas ruas principais",
      description:
        "Moradores e parceiros vao atuar juntos para recolher entulho, reforcar cuidados com o bairro e mapear pontos criticos.",
      location: "Concentracao na Praca Central",
      startsAt: new Date("2026-04-26T12:30:00.000Z"),
    },
  ];

  const reportSeeds: ReportSeed[] = [
    {
      title: "Poste apagado perto da escola municipal",
      description:
        "Moradores relatam inseguranca no fim da tarde porque o trecho fica muito escuro no horario de saida das criancas.",
      category: ReportCategory.LIGHTING,
      severity: ReportSeverity.HIGH,
      status: ReportStatus.IN_REVIEW,
      priority: ReportPriority.HIGH,
      address: "Rua da Esperanca, perto da escola municipal",
      neighborhood: "Promorar",
      latitude: "-3.1220000",
      longitude: "-60.0180000",
      managerComment: "Demanda validada em campo e encaminhada para acompanhamento.",
      assignedToUserId: assistantUserId,
      submittedByName: "Moradora da comunidade",
      submittedByEmail: "moradora@example.com",
      allowEmailUpdates: true,
      internalComment: "Equipe verificou a ocorrencia no mesmo dia do registro.",
      withNotification: true,
    },
    {
      title: "Entulho acumulado em esquina movimentada",
      description:
        "O local tem acumulado lixo e restos de obra, dificultando a passagem e gerando preocupacao entre moradores.",
      category: ReportCategory.CLEANING,
      severity: ReportSeverity.MEDIUM,
      status: ReportStatus.OPEN,
      priority: ReportPriority.MEDIUM,
      address: "Esquina da Rua Sol Nascente com Travessa Nova Vida",
      neighborhood: "Nova Esperanca",
      latitude: null,
      longitude: null,
      managerComment: null,
      assignedToUserId: null,
      submittedByName: "Lideranca local",
    },
  ];

  await upsertDemoNotices(organizationId, communityId, noticeSeeds);
  await upsertDemoEvents(organizationId, communityId, eventSeeds);
  await upsertDemoReports(organizationId, communityId, adminUserId, reportSeeds);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL nao foi configurada. Copie .env.example para .env antes de rodar o seed.",
    );
  }

  const mode = getSeedMode();
  const { organization, community } = await ensureBaseStructure();
  const { adminUser, assistantUser } = await ensureInternalUsers(organization.id, community.id);
  await ensureDefaultAdSlots();

  if (mode === "demo") {
    await seedDemo(organization.id, community.id, adminUser.id, assistantUser.id);
    console.log("Seed demo concluido com usuarios internos e dados ficticios.");
    return;
  }

  console.log("Seed de producao concluido.");
  console.log(`Admin: ${adminUser.email}`);
  console.log(`Assistente: ${assistantUser.email}`);
  console.log("Nenhum aviso, evento ou demanda ficticia foi criada.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
