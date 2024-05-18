import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../command';
import { updateUserBalance } from '../../../prisma/queries';
import { prisma } from '../../../prisma';
import { CooldownTimes } from '../../cooldown-times';

export class Beg extends Command {
  async execute() {
    await this._interaction.deferReply();

    const cooldown = await prisma.cooldown.findUnique({
      where: {
        command_memberGuildId_memberUserId: {
          memberGuildId: this.guildId(),
          memberUserId: this.userId(),
          command: this.commandName(),
        },
      },
    });

    if (cooldown) {
      const timeLeft = Date.now() - Number(cooldown.lastUsed);

      if (timeLeft <= CooldownTimes.BEG * 1000) {
        await this._interaction.editReply(
          `You cannot beg for another ${
            CooldownTimes.BEG - Math.round(timeLeft / 1000)
          } seconds.`,
        );
        return;
      }

      await prisma.cooldown.delete({
        where: {
          command_memberGuildId_memberUserId: {
            memberGuildId: this.guildId(),
            memberUserId: this.userId(),
            command: this.commandName(),
          },
        },
      });
    }

    const begged: number = parseFloat((Math.random() * 50.0).toFixed(2));

    await updateUserBalance(this.guildId(), this.userId(), {
      holding: begged,
    });

    await prisma.cooldown.create({
      data: {
        memberGuildId: this.guildId(),
        memberUserId: this.userId(),
        lastUsed: Date.now(),
        command: this.commandName(),
      },
    });

    await this._interaction.editReply(
      `You begged so much and got £${begged}... shame on you!`,
    );
  }

  command(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('beg')
      .setDescription('Beg for money... you will always get some');
  }
}
