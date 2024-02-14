-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastCommand" TIMESTAMP(3),
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);
