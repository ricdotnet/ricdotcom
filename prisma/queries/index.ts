import { Logger } from '@ricdotnet/logger/dist';
import { prisma } from '..';

export async function createGuild(guildId: string) {
  Logger.get().info(`Adding guild ${guildId}`);

  await prisma.guild.create({
    data: {
      guildId,
    },
  });

  Logger.get().info(`Guild ${guildId} added`);
}

export async function deleteGuild(guildId: string) {
  Logger.get().info(`Deleting guild ${guildId}`);

  await prisma.guild.delete({
    where: {
      guildId,
    },
  });

  Logger.get().info(`Guild ${guildId} deleted`);
}

export async function updateLastCommand(guildId: string, date: Date) {
  Logger.get().info(`Updating last command for guild ${guildId}`);

  await prisma.guild.update({
    where: {
      guildId,
    },
    data: {
      lastCommand: date,
    },
  });

  Logger.get().info(`Last command for guild ${guildId} updated`);
}

export async function createOrUpdateExistingUserAndMember(
  guildId: string,
  userId: string,
  date: Date,
  command: string,
) {
  Logger.get().info(
    `Creating or updating entries user and member entries for user ${userId}`,
  );

  await prisma.$transaction([
    prisma.user.upsert({
      where: {
        userId,
      },
      update: {
        lastCommand: date,
      },
      create: {
        userId,
        lastCommand: date,
      },
    }),
    prisma.member.upsert({
      where: {
        userId_guildId: {
          userId,
          guildId,
        },
      },
      update: {},
      create: {
        guildId,
        userId,
      },
    }),
    prisma.command.create({
      data: {
        command,
        createdAt: date,
        memberGuildId: guildId,
        memberUserId: userId,
      },
    }),
    prisma.economy.create({
      data: {
        memberGuildId: guildId,
        memberUserId: userId,
      },
    }),
  ]);

  Logger.get().info(
    `User and member entries creater or updated for user ${userId}`,
  );
  Logger.get().info(`New command (${command}) entry added for user ${userId}`);
}

export async function getUserBalanse(guildId: string, userId: string) {
  return prisma.economy.findFirst({
    where: {
      memberGuildId: guildId,
      memberUserId: userId,
    },
  });
}

type UpdateUserBalanceOptions = {
  holding?: number;
  bank?: number;
};

export async function updateUserBalance(
  guildId: string,
  userId: string,
  options: UpdateUserBalanceOptions,
) {
  return prisma.economy.updateMany({
    where: {
      memberGuildId: guildId,
      memberUserId: userId,
    },
    data: {
      bank: {
        increment: options.bank ?? 0,
      },
      holding: {
        increment: options.holding ?? 0,
      },
    },
  });
}
