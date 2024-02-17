/*
  Warnings:

  - A unique constraint covering the columns `[guildId]` on the table `Server` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Server_guildId_key" ON "Server"("guildId");
