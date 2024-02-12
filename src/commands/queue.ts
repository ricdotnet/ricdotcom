import { Command } from '../command';
import {
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  Interaction,
  SlashCommandBuilder,
} from 'discord.js';
import { AudioPlayer, TTrackData } from '../lavacord/audio-player';
import { RuntimeData } from '../runtime-data';

export class Queue extends Command {
  private player: AudioPlayer | null | undefined; // oof
  private queue: TTrackData[] | undefined;

  private currentPage = 1;
  private totalPages = 1;

  async execute() {
    this.player = RuntimeData.get().getPlayer(this.guildId());

    if (!this.player) {
      await this._interaction.reply('Start a listening session with /play');
      return;
    }

    this.queue = this.player.list();

    await this._interaction.reply({
      content: 'Loading the current song queue...',
      ephemeral: true,
    });

    this.totalPages = Math.ceil(this.queue.length / 10);

    const pagination: Message = await this._interaction.editReply({
      embeds: [this.buildEmbed()],
      components: [this.buildActionRow()],
    });

    try {
      await this.paginate(pagination);
    } catch (err) {
      await this._interaction.editReply(
        'Timed out... use /queue to get the current song queue.',
      );
    }
  }

  private async paginate(pagination: Message) {
    const confirmation = await pagination.awaitMessageComponent({
      filter: this.collectorFilter(this._interaction),
      time: 60_000,
    });

    if (confirmation.customId === 'next-page') {
      this.currentPage += 1;
    } else if (confirmation.customId === 'prev-page') {
      this.currentPage -= 1;
    }

    confirmation.update({
      embeds: [this.buildEmbed()],
      components: [this.buildActionRow()],
    });

    await this.paginate(pagination);
  }

  private collectorFilter(_i: CommandInteraction) {
    return (i: Interaction) => {
      return i.user.id === _i.user.id;
    };
  }

  private buildActionRow() {
    const prevPage = new ButtonBuilder()
      .setCustomId('prev-page')
      .setLabel('Previous')
      .setStyle(ButtonStyle.Primary);

    const nextPage = new ButtonBuilder()
      .setCustomId('next-page')
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary);

    if (this.currentPage === 1) {
      prevPage.setDisabled(true);
    }

    if (this.currentPage === this.totalPages) {
      nextPage.setDisabled(true);
    }

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      prevPage,
      nextPage,
    );
  }

  private buildEmbed() {
    const embed = new EmbedBuilder()
      .setTitle('The current song queue')
      .setDescription(
        `There are currently ${this.queue?.length} songs on the queue`,
      );

    const start = this.currentPage === 1 ? 0 : (this.currentPage - 1) * 10;
    const end = start + 10;

    const paginatedQueue = this.queue?.slice(start, end);

    if (!paginatedQueue) {
      throw new Error('No tracks to paginate through');
    }

    for (let i = 0; i < paginatedQueue.length; i++) {
      const _title = paginatedQueue[i].info.title;
      const _author = paginatedQueue[i].info.author;

      embed.addFields({
        name: _title === '' ? '**no title**' : _title,
        value: _author === '' ? '**no author**' : _author,
      });
    }

    embed.setFooter({
      text: `Page ${this.currentPage} of ${this.totalPages} pages`,
    });

    return embed;
  }

  command(): SlashCommandBuilder {
    return <SlashCommandBuilder>(
      new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View the current song queue')
    );
  }
}
