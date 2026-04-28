-- CreateTable
CREATE TABLE "AdBanner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "link" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "position" TEXT NOT NULL DEFAULT 'portal_top',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdBanner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdBanner_position_isActive_priority_createdAt_idx" ON "AdBanner"("position", "isActive", "priority", "createdAt");
