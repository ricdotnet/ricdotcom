import { Command } from "../command";
import { SlashCommandBuilder } from "discord.js";
import { AudioPlayer } from "../lavacord/audioPlayer";

export class Add extends Command {
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
