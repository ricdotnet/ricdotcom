import { Command } from '../../command';
import { SlashCommandBuilder, SlashCommandNumberOption } from 'discord.js';
import { sendError } from '../../error';
import { getUserBalance, updateUserBalance } from '../../../prisma/queries';
import { prisma } from '../../../prisma';

export class Deposit extends Command {
  async execute(): Promise<void> {
    await this._interaction.deferReply();

    const amount = this._interaction.options.get('amount');

    if (!amount?.value) {
      await sendError(
        this._interaction,
        'Deposit failed because there was no amount set for depositing.',
      );
      return;
    }

    const balance = await getUserBalance(this.guildId(), this.userId());

    if (!balance) {
      // TODO: handle
      return;
    }

    const newHolding = balance.holding - +amount.value;
    const newBank = balance.bank + +amount.value;

    await prisma.economy.update({
      where: {
        memberGuildId_memberUserId: {
          memberGuildId: this.guildId(),
          memberUserId: this.userId(),
        },
      },
      data: {
        bank: newBank,
        holding: newHolding,
      },
    });

    await this._interaction.editReply(`Deposited \`R£ ${amount.value}\``);
  }

  command(): SlashCommandBuilder {
    return <SlashCommandBuilder>new SlashCommandBuilder()
      .setName('deposit')
      .setDescription('Save holding money into your bank account')
      .addNumberOption((option: SlashCommandNumberOption) =>
        option
          .setName('amount')
          .setRequired(true)
          .setDescription('The amount to deposit'),
      );
  }
}
