-- CreateTable
CREATE TABLE "Economy" (
    "id" SERIAL NOT NULL,
    "memberGuildId" TEXT NOT NULL,
    "memberUserId" TEXT NOT NULL,
    "holding" INTEGER NOT NULL DEFAULT 10000,
    "bank" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Economy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Economy" ADD CONSTRAINT "Economy_memberGuildId_memberUserId_fkey" FOREIGN KEY ("memberGuildId", "memberUserId") REFERENCES "Member"("guildId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;
