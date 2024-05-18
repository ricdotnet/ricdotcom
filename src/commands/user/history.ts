import {
  APIEmbedField,
  EmbedBuilder,
  Message,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../command';
import { getUserCommandHistory } from '../../../prisma/queries';
import { collectorFilter, paginationButtons } from '../../utils';
import { Logger } from '@ricdotnet/logger/dist';

export class History extends Command {
  private currentPage = 1;
  private totalPages = 1;
  private totalPerPage = 10;

  async execute(): Promise<void> {
    await this._interaction.reply({
      ephemeral: true,
      content: 'Getting your command history...',
    });

    const historyEmbed = await this.fetchDataAndBuildEmbed();
    const buttons = paginationButtons(this.currentPage, this.totalPages);

    const embedActions: Message = await this._interaction.editReply({
      embeds: [historyEmbed],
      components: [buttons],
    });

    try {
      await this.paginate(embedActions);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (err: any) {
      Logger.get().error(err.message);
      await this._interaction.editReply(
        'Timed out... use /history to view your history again.',
      );
    }
  }

  command(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('history')
      .setDescription('Get your command history');
  }

  private async fetchDataAndBuildEmbed() {
    const offset: number = (this.currentPage - 1) * this.totalPerPage;
    const [count, history] = await getUserCommandHistory(
      this.userId(),
      this.guildId(),
      offset,
      this.totalPerPage,
    );
    const fields = history.reduce((prev: APIEmbedField[], curr) => {
      prev.push({
        name: curr.command,
        value: `Sent on: ${curr.createdAt}`,
      });

      return prev;
    }, []);

    this.totalPages = Math.ceil(count / this.totalPerPage);

    return new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Your command history')
      .addFields(...fields.slice(0, 10))
      .setFooter({ text: `Page ${this.currentPage} of ${this.totalPages}` });
  }

  private async paginate(embedActions: Message) {
    const confirmation = await embedActions.awaitMessageComponent({
      filter: collectorFilter(this._interaction),
      time: 60_000,
    });

    if (confirmation.customId === 'next-page') {
      this.currentPage += 1;
    } else if (confirmation.customId === 'prev-page') {
      this.currentPage -= 1;
    }

    const historyEmbed = await this.fetchDataAndBuildEmbed();
    const buttons = paginationButtons(this.currentPage, this.totalPages);

    confirmation.update({
      embeds: [historyEmbed],
      components: [buttons],
    });

    await this.paginate(embedActions);
  }
}
