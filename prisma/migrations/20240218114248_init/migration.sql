/*
  Warnings:

  - The primary key for the `Economy` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Economy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Economy" DROP CONSTRAINT "Economy_pkey",
DROP COLUMN "id";
