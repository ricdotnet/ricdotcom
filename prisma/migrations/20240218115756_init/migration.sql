/*
  Warnings:

  - You are about to drop the column `lastUser` on the `Cooldown` table. All the data in the column will be lost.
  - Added the required column `lastUsed` to the `Cooldown` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cooldown" DROP COLUMN "lastUser",
ADD COLUMN     "lastUsed" TIMESTAMP(3) NOT NULL;
