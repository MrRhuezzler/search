/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `CrawledUrl` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CrawledUrl" ALTER COLUMN "success" DROP NOT NULL,
ALTER COLUMN "success" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "CrawledUrl_url_key" ON "CrawledUrl"("url");
