/*
  Warnings:

  - A unique constraint covering the columns `[memberGuildId,memberUserId]` on the table `Economy` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Cooldown" (
    "memberGuildId" TEXT NOT NULL,
    "memberUserId" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "lastUser" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Cooldown_command_memberGuildId_memberUserId_key" ON "Cooldown"("command", "memberGuildId", "memberUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Economy_memberGuildId_memberUserId_key" ON "Economy"("memberGuildId", "memberUserId");

-- AddForeignKey
ALTER TABLE "Cooldown" ADD CONSTRAINT "Cooldown_memberGuildId_memberUserId_fkey" FOREIGN KEY ("memberGuildId", "memberUserId") REFERENCES "Member"("guildId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;
