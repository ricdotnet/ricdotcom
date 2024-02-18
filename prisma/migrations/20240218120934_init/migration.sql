/*
  Warnings:

  - You are about to alter the column `lastUsed` on the `Cooldown` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Cooldown" ALTER COLUMN "lastUsed" SET DATA TYPE INTEGER;
