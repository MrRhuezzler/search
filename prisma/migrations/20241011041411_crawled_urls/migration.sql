-- CreateTable
CREATE TABLE "CrawledUrl" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "crawlDuration" BIGINT NOT NULL,
    "responseCode" INTEGER NOT NULL,
    "pageTitle" TEXT NOT NULL,
    "pageDescription" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "lastTested" TIMESTAMP(3),
    "indexed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CrawledUrl_pkey" PRIMARY KEY ("id")
);
