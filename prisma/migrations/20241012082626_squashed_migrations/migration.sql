-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawledUrl" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "success" BOOLEAN,
    "crawlDuration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "responseCode" INTEGER NOT NULL DEFAULT 0,
    "pageTitle" TEXT,
    "pageDescription" TEXT,
    "heading" TEXT,
    "lastTested" TIMESTAMP(3),
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CrawledUrl_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CrawledUrl_url_key" ON "CrawledUrl"("url");

-- AddForeignKey
ALTER TABLE "IndexUrls" ADD CONSTRAINT "IndexUrls_searchIndexId_fkey" FOREIGN KEY ("searchIndexId") REFERENCES "SearchIndex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndexUrls" ADD CONSTRAINT "IndexUrls_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "CrawledUrl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
