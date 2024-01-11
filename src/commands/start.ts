import { Command } from "../command";
import { SlashCommandBuilder } from "discord.js";
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

    if (url && url.value) {
      player.add(<string>url.value);
    }

    const track = await player.start();

    if (!track) {
      await this._interaction.reply('There was no song to play next...');
      return;
    }

    await this._interaction.reply('Now playing: ' + track);
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
