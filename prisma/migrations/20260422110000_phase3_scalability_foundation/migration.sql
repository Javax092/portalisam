CREATE TYPE "UserRole_new" AS ENUM ('VIEWER', 'VOLUNTEER', 'EDITOR', 'MANAGER', 'ADMIN');

ALTER TABLE "User"
  ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "User"
  ALTER COLUMN "role" TYPE "UserRole_new"
  USING (
    CASE
      WHEN "role"::text = 'ADMIN' THEN 'ADMIN'::"UserRole_new"
      WHEN "role"::text = 'LEADER' THEN 'MANAGER'::"UserRole_new"
      ELSE 'VOLUNTEER'::"UserRole_new"
    END
  );

DROP TYPE "UserRole";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";

ALTER TABLE "User"
  ALTER COLUMN "role" SET DEFAULT 'VIEWER';

CREATE TYPE "ReportActivityType" AS ENUM (
  'CREATED',
  'STATUS_CHANGED',
  'PRIORITY_CHANGED',
  'ASSIGNED',
  'UNASSIGNED',
  'COMMENT_ADDED',
  'INTERNAL_NOTE_ADDED',
  'PUBLIC_UPDATE_EDITED',
  'NOTIFICATION_QUEUED',
  'NOTIFICATION_SENT'
);

CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'WHATSAPP');
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELED');

CREATE TABLE "Organization" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

CREATE TABLE "Community" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Community_organizationId_slug_key" ON "Community"("organizationId", "slug");
CREATE INDEX "Community_organizationId_isActive_idx" ON "Community"("organizationId", "isActive");

ALTER TABLE "User"
  ADD COLUMN "organizationId" TEXT,
  ADD COLUMN "communityId" TEXT;

ALTER TABLE "Notice"
  ADD COLUMN "organizationId" TEXT,
  ADD COLUMN "communityId" TEXT;

ALTER TABLE "Event"
  ADD COLUMN "organizationId" TEXT,
  ADD COLUMN "communityId" TEXT;

ALTER TABLE "Report"
  ADD COLUMN "organizationId" TEXT,
  ADD COLUMN "communityId" TEXT,
  ADD COLUMN "assignedToUserId" TEXT,
  ADD COLUMN "submittedByName" TEXT,
  ADD COLUMN "submittedByEmail" TEXT,
  ADD COLUMN "submittedByPhone" TEXT,
  ADD COLUMN "allowEmailUpdates" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "allowWhatsappUpdates" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "relevantUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "lastStatusChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "firstResponseDueAt" TIMESTAMP(3),
  ADD COLUMN "resolutionDueAt" TIMESTAMP(3),
  ADD COLUMN "closedAt" TIMESTAMP(3);

UPDATE "Report"
SET
  "relevantUpdatedAt" = COALESCE("updatedAt", "createdAt", CURRENT_TIMESTAMP),
  "lastStatusChangedAt" = COALESCE("updatedAt", "createdAt", CURRENT_TIMESTAMP),
  "lastActivityAt" = COALESCE("updatedAt", "createdAt", CURRENT_TIMESTAMP);

CREATE TABLE "ReportComment" (
  "id" TEXT NOT NULL,
  "reportId" TEXT NOT NULL,
  "authorUserId" TEXT,
  "authorName" TEXT,
  "body" TEXT NOT NULL,
  "isInternal" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReportComment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ReportComment_reportId_createdAt_idx" ON "ReportComment"("reportId", "createdAt");
CREATE INDEX "ReportComment_authorUserId_createdAt_idx" ON "ReportComment"("authorUserId", "createdAt");

CREATE TABLE "ReportActivity" (
  "id" TEXT NOT NULL,
  "reportId" TEXT NOT NULL,
  "actorUserId" TEXT,
  "type" "ReportActivityType" NOT NULL,
  "fromStatus" "ReportStatus",
  "toStatus" "ReportStatus",
  "message" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReportActivity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ReportActivity_reportId_createdAt_idx" ON "ReportActivity"("reportId", "createdAt");
CREATE INDEX "ReportActivity_actorUserId_createdAt_idx" ON "ReportActivity"("actorUserId", "createdAt");
CREATE INDEX "ReportActivity_type_createdAt_idx" ON "ReportActivity"("type", "createdAt");

CREATE TABLE "NotificationDelivery" (
  "id" TEXT NOT NULL,
  "reportId" TEXT NOT NULL,
  "organizationId" TEXT,
  "channel" "NotificationChannel" NOT NULL,
  "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
  "recipient" TEXT NOT NULL,
  "templateKey" TEXT,
  "payload" JSONB,
  "scheduledAt" TIMESTAMP(3),
  "lastAttemptAt" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "NotificationDelivery_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "NotificationDelivery_reportId_status_createdAt_idx" ON "NotificationDelivery"("reportId", "status", "createdAt");
CREATE INDEX "NotificationDelivery_organizationId_status_createdAt_idx" ON "NotificationDelivery"("organizationId", "status", "createdAt");
CREATE INDEX "NotificationDelivery_channel_status_scheduledAt_idx" ON "NotificationDelivery"("channel", "status", "scheduledAt");

CREATE INDEX "User_organizationId_role_idx" ON "User"("organizationId", "role");
CREATE INDEX "User_communityId_idx" ON "User"("communityId");
CREATE INDEX "Notice_organizationId_publishedAt_idx" ON "Notice"("organizationId", "publishedAt");
CREATE INDEX "Notice_communityId_publishedAt_idx" ON "Notice"("communityId", "publishedAt");
CREATE INDEX "Event_organizationId_startsAt_idx" ON "Event"("organizationId", "startsAt");
CREATE INDEX "Event_communityId_startsAt_idx" ON "Event"("communityId", "startsAt");
CREATE INDEX "Report_organizationId_status_priority_lastActivityAt_idx" ON "Report"("organizationId", "status", "priority", "lastActivityAt");
CREATE INDEX "Report_communityId_status_lastActivityAt_idx" ON "Report"("communityId", "status", "lastActivityAt");
CREATE INDEX "Report_assignedToUserId_status_idx" ON "Report"("assignedToUserId", "status");
CREATE INDEX "Report_status_createdAt_idx" ON "Report"("status", "createdAt");
CREATE INDEX "Report_priority_createdAt_idx" ON "Report"("priority", "createdAt");
CREATE INDEX "Report_relevantUpdatedAt_idx" ON "Report"("relevantUpdatedAt");
CREATE INDEX "Report_lastActivityAt_idx" ON "Report"("lastActivityAt");

ALTER TABLE "Community"
  ADD CONSTRAINT "Community_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "User"
  ADD CONSTRAINT "User_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "User_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Notice"
  ADD CONSTRAINT "Notice_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "Notice_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Event"
  ADD CONSTRAINT "Event_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "Event_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Report"
  ADD CONSTRAINT "Report_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "Report_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "Report_assignedToUserId_fkey"
  FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ReportComment"
  ADD CONSTRAINT "ReportComment_reportId_fkey"
  FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "ReportComment_authorUserId_fkey"
  FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ReportActivity"
  ADD CONSTRAINT "ReportActivity_reportId_fkey"
  FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "ReportActivity_actorUserId_fkey"
  FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "NotificationDelivery"
  ADD CONSTRAINT "NotificationDelivery_reportId_fkey"
  FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "NotificationDelivery_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
