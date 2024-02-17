import { Command } from '../../command';
import { SlashCommandBuilder } from 'discord.js';
import { RuntimeData } from '../../runtime-data';

export class Next extends Command {
  async execute() {
    const player = RuntimeData.get().getPlayer(this.guildId());

    if (!player) {
      await this._interaction.reply('Start a listening session with /play');
      return;
    }

    const track = await player.next();

    if (!track) {
      await this._interaction.reply('There was no song to play next...');
      return;
    }

    await this._interaction.deferReply();
    await this._interaction.deleteReply();
  }

  command(): SlashCommandBuilder {
    return <SlashCommandBuilder>(
      new SlashCommandBuilder()
        .setName('next')
        .setDescription('Start playing songs.')
    );
  }
}
