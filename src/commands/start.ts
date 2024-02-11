import { Command } from "../command";
import { EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
import { AudioPlayer } from "../lavacord/audioPlayer";
import { AudioManager } from "../lavacord/manager";

export class Start extends Command {
  private embed: Message | undefined;

  async execute() {
    await this.start();
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

    this.embed = await channel.send({
      embeds: [new EmbedBuilder().setTitle('Loading tracks...')],
    });

    const track = await player.start(<string>url.value);

    if (!track) {
      await this._interaction.editReply('There was no song to play next...');
      return;
    }

    this.embed.edit({
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

  private async start() {
    const channels = this._interaction.guild?.channels;
    const channel = channels?.cache.find(c => c.name === 'Concert');

    if (!channel) return;

    const manager = AudioManager.manager();
    await manager.join({
      guild: channel.guildId,
      channel: channel.id,
      node: "1"
    });
    new AudioPlayer(channel.guildId, channel.id);

    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guildId,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: true,
    });
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
