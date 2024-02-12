import { Command } from '../command';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { RuntimeData } from '../runtime-data';
import { audioStoppedEmbed } from '../lavacord/audio-utils';

export class Stop extends Command {
  async execute() {
    const player = RuntimeData.get().getPlayer(this.guildId());

    if (!player) {
      await this._interaction.reply(
        'There is no player to stop... stopping anyway eheh',
      );
      return;
    }

    await player.stop();
    
    RuntimeData.get().deletePlayer(this.guildId());

    await this._interaction.channel?.send({ embeds: [audioStoppedEmbed()] });

    await this._interaction.deferReply();
    await this._interaction.deleteReply();
  }

  command(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('stop')
      .setDescription('Stop playing and close the player.');
  }
}
