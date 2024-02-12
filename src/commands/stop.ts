import { Command } from '../command';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { AudioPlayer } from '../lavacord/audioPlayer';

export class Stop extends Command {
  async execute() {
    const player = AudioPlayer.get();

    if (!player) {
      await this._interaction.reply(
        'There is no player to stop... stopping anyway eheh',
      );
      return;
    }

    await player.stop();

    await this._interaction.channel?.send({ embeds: [this.buildEmbed()] });

    await this._interaction.deferReply();
    await this._interaction.deleteReply();
  }

  private buildEmbed(): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Audio player stopped.');
  }

  command(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('stop')
      .setDescription('Stop playing and close the player.');
  }
}
