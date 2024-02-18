-- DropIndex
DROP INDEX "Economy_memberGuildId_memberUserId_key";

-- AlterTable
ALTER TABLE "Economy" ADD CONSTRAINT "Economy_pkey" PRIMARY KEY ("memberGuildId", "memberUserId");
