import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../command';
import { updateUserBalance } from '../../../prisma/queries';

export class Beg extends Command {
  async execute() {
    await this._interaction.deferReply();

    const begged = Math.ceil(Math.random() * 50);

    await updateUserBalance(this.guildId(), this.userId(), {
      holding: begged,
    });

    this._interaction.editReply(
      `You begged so much and got £${begged}... shame on you!`,
    );
  }

  command(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('beg')
      .setDescription('Beg for money... you will always get some');
  }
}
