import { Command } from "../command";
import { SlashCommandBuilder } from "discord.js";
import { AudioPlayer, TTrackLoadingResult } from "../lavacord/audioPlayer";
import { AudioManager } from "../lavacord/manager";

export class Add extends Command {
  async execute() {
    const manager = AudioManager.manager();
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

    const trackData = await manager.getSong(<string>url.value) as TTrackLoadingResult;

    if (url && url.value) {
      player.add(trackData.data);
    }

    await this._interaction.reply('Added a song... Total: ' + player.list().length);
  }

  command(): SlashCommandBuilder {
    return <SlashCommandBuilder>new SlashCommandBuilder()
      .setName('add')
      .setDescription('Add a song or a playlist')
      .addStringOption((option) =>
        option.setName('url')
          .setDescription('Enter a spotify link'));
  }
}
