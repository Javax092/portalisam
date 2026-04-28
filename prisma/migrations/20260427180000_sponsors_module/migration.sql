-- CreateEnum
CREATE TYPE "AdPlacement" AS ENUM (
  'HOME_TOP',
  'HOME_MIDDLE',
  'PORTAL_SIDEBAR',
  'PORTAL_BOTTOM',
  'REPORTS_BOTTOM',
  'FOOTER_SUPPORTERS'
);

-- CreateTable
CREATE TABLE "Sponsor" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "logoUrl" TEXT,
  "websiteUrl" TEXT,
  "whatsappUrl" TEXT,
  "category" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdSlot" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "placement" "AdPlacement" NOT NULL,
  "size" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AdSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advertisement" (
  "id" TEXT NOT NULL,
  "sponsorId" TEXT NOT NULL,
  "adSlotId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "imageUrl" TEXT NOT NULL,
  "targetUrl" TEXT,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "priority" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Advertisement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_slug_key" ON "Sponsor"("slug");

-- CreateIndex
CREATE INDEX "Sponsor_isActive_createdAt_idx" ON "Sponsor"("isActive", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdSlot_slug_key" ON "AdSlot"("slug");

-- CreateIndex
CREATE INDEX "AdSlot_placement_isActive_idx" ON "AdSlot"("placement", "isActive");

-- CreateIndex
CREATE INDEX "Advertisement_adSlotId_isActive_startsAt_endsAt_priority_idx" ON "Advertisement"("adSlotId", "isActive", "startsAt", "endsAt", "priority");

-- CreateIndex
CREATE INDEX "Advertisement_sponsorId_isActive_startsAt_endsAt_idx" ON "Advertisement"("sponsorId", "isActive", "startsAt", "endsAt");

-- AddForeignKey
ALTER TABLE "Advertisement" ADD CONSTRAINT "Advertisement_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advertisement" ADD CONSTRAINT "Advertisement_adSlotId_fkey" FOREIGN KEY ("adSlotId") REFERENCES "AdSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
