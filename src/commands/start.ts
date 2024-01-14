import { Command } from "../command";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { AudioPlayer } from "../lavacord/audioPlayer";

export class Start extends Command {
  async execute() {
    const player = AudioPlayer.get();

    if (!player) {
      await this._interaction.reply('Start a listening session with /play');
      return;
    }

    const url = this._interaction.options.get('url');

    if (!url) {
      await this._interaction.reply('You must specify a spotify or youtube urls.');
      return;
    }

    const channel = this._interaction.channel;

    if (!channel) {
      console.log('Something went wrong and there was no channel available.');
      return;
    }

    player.embedMessage = await channel.send({ embeds: [this.buildEmbed('Loading tracks...')] });

    const response = await player.start(<string>url.value);

    // if (!response) {
    //   await this._interaction.editReply('There was no song to play next...');
    //   return;
    // }
    //
    // await this._interaction.channel?.send({ embeds: [this.buildEmbed(response)] });

    player.embedMessage.edit({ embeds: [this.buildEmbed(`Now playing: ${response}`)] });

    await this._interaction.deferReply();
    await this._interaction.deleteReply();
  }

  private buildEmbed(title: string) {
    return new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(title);
  }

  command(): SlashCommandBuilder {
    return <SlashCommandBuilder>new SlashCommandBuilder()
      .setName('start')
      .setDescription('Start playing songs.')
      .addStringOption((option) =>
        option.setName('url')
          .setDescription('Enter a spotify link'));
  }
}
