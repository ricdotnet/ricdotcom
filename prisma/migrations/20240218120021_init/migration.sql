/*
  Warnings:

  - Changed the type of `lastUsed` on the `Cooldown` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Cooldown" DROP COLUMN "lastUsed",
ADD COLUMN     "lastUsed" BIGINT NOT NULL;
