import { Command } from "../command";
import { Embed, SlashCommandBuilder } from "discord.js";
import { AudioPlayer } from "../lavacord/audioPlayer";

export class Queue extends Command {
  private player: AudioPlayer | null | undefined; // oof

  async execute() {
    this.player = AudioPlayer.get();

    if (!this.player) {
      await this._interaction.reply('Start a listening session with /play');
      return;
    }

    const queue = this.player.list();

    const embed: Pick<Embed, 'color' | 'title' | 'description' | 'fields'> = {
      color: 0x0099ff,
      title: 'Current song queue',
      description: `There are currently ${queue.length} songs on the queue`,
      fields: [],
    }

    for (const i in queue) {
      embed.fields.push({
        name: `${parseInt(i) + 1}`,
        value: queue[i].info.title,
      });
    }

    await this._interaction.reply('Loading the current song queue...');

    await this._interaction.channel?.send({
      embeds: [<Embed>embed],
    });

    // await this._interaction.deferReply();
    await this._interaction.deleteReply()
  }

  command(): SlashCommandBuilder {
    return <SlashCommandBuilder>new SlashCommandBuilder()
      .setName('queue')
      .setDescription('View the current song queue');
  }
}
