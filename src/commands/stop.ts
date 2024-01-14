import { Command } from "../command";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { AudioPlayer } from "../lavacord/audioPlayer";

export class Stop extends Command {
  async execute() {
    const player = AudioPlayer.get();

    if (!player) {
      return;
    }

    await player.stop();

    await player.embedMessage?.edit({ embeds: [this.buildEmbed()] });

    await this._interaction.deferReply();
    await this._interaction.deleteReply();
  }

  private buildEmbed(): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Audio player stopped.');
  }

  command(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('stop')
      .setDescription('Stop playing and close the player.');
  }
}
