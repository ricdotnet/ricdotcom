import { Command } from "../command";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { AudioPlayer } from "../lavacord/audioPlayer";

export class Next extends Command {
  async execute() {
      const player = AudioPlayer.get();

    if (!player) {
      await this._interaction.reply('Start a listening session with /play');
      return;
    }

    const track = await player.next();

    if (!track) {
      await this._interaction.reply('There was no song to play next...');
      return;
    }

    await this._interaction.channel?.send({
      embeds: [this.buildEmbed(track.info.title, track.info.artworkUrl)],
    });

    await this._interaction.deferReply();
    await this._interaction.deleteReply();
  }

  private buildEmbed(title: string, image?: string) {
    const builder = new EmbedBuilder();

    builder.setColor(0x0099FF)
      .setTitle('Now playing:')
      .setDescription(title);

    if (image) {
      builder.setThumbnail(image);
    }

    return builder;
  }


  command(): SlashCommandBuilder {
    return <SlashCommandBuilder>new SlashCommandBuilder()
      .setName('next')
      .setDescription('Start playing songs.');
  }
}
