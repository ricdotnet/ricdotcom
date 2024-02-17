/*
  Warnings:

  - You are about to drop the column `commandId` on the `Member` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_commandId_fkey";

-- AlterTable
ALTER TABLE "Command" ADD COLUMN     "memberGuildId" TEXT,
ADD COLUMN     "memberUserId" TEXT;

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "commandId";

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_memberUserId_memberGuildId_fkey" FOREIGN KEY ("memberUserId", "memberGuildId") REFERENCES "Member"("userId", "guildId") ON DELETE SET NULL ON UPDATE CASCADE;
