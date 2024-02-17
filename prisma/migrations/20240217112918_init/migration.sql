/*
  Warnings:

  - Made the column `memberGuildId` on table `Command` required. This step will fail if there are existing NULL values in that column.
  - Made the column `memberUserId` on table `Command` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Command" DROP CONSTRAINT "Command_memberUserId_memberGuildId_fkey";

-- AlterTable
ALTER TABLE "Command" ALTER COLUMN "memberGuildId" SET NOT NULL,
ALTER COLUMN "memberUserId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_memberUserId_memberGuildId_fkey" FOREIGN KEY ("memberUserId", "memberGuildId") REFERENCES "Member"("userId", "guildId") ON DELETE RESTRICT ON UPDATE CASCADE;
