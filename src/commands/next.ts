import { Command } from "../command";
import { SlashCommandBuilder } from "discord.js";
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

    await this._interaction.reply('Now playing: ' + track);
  }

  command(): SlashCommandBuilder {
    return <SlashCommandBuilder>new SlashCommandBuilder()
      .setName('next')
      .setDescription('Start playing songs.');
  }
}
