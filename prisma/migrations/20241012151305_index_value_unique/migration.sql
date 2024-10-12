/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `SearchIndex` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SearchIndex_value_key" ON "SearchIndex"("value");
