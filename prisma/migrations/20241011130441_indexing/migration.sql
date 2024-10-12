-- CreateTable
CREATE TABLE "SearchIndex" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SearchIndex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexUrls" (
    "searchIndexId" TEXT NOT NULL,
    "urlId" TEXT NOT NULL,

    CONSTRAINT "IndexUrls_pkey" PRIMARY KEY ("searchIndexId","urlId")
);

-- AddForeignKey
ALTER TABLE "IndexUrls" ADD CONSTRAINT "IndexUrls_searchIndexId_fkey" FOREIGN KEY ("searchIndexId") REFERENCES "SearchIndex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexUrls" ADD CONSTRAINT "IndexUrls_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "CrawledUrl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
