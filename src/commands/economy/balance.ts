import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../command';
import { Logger } from '@ricdotnet/logger/dist';
import { LogLevels } from '@ricdotnet/logger/dist/src/Constants';
import { getUserBalanse } from '../../../prisma/queries';

export class Balance extends Command {
  async execute() {
    await this._interaction.deferReply();

    const balance = await getUserBalanse(this.guildId(), this.userId());

    if (!balance) {
      Logger.get().fmt(
        LogLevels.WARN,
        'User {} from guild {} does not have an economy entry in the database.',
        this.userId(),
        this.guildId(),
      );
      await this._interaction.editReply(
        '❌ An error occurred when trying to get your balance.',
      );
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Your economies')
      .addFields(
        { name: 'Holding', value: balance.holding.toString(), inline: true },
        { name: 'Bank', value: balance.bank.toString(), inline: true },
      );

    await this._interaction.editReply({ embeds: [embed] });
  }

  command(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('balance')
      .setDescription('See your current money balance');
  }
}
