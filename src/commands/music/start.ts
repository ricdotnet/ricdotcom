import { Command } from '../../command';
import { EmbedBuilder, Message, SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import { AudioPlayer } from '../../lavacord/audio-player';
import { AudioManager } from '../../lavacord/manager';
import { RuntimeData } from '../../runtime-data';
import { audioStartedEmbed, nowPlayingEmbed } from '../../lavacord/audio-utils';
import { Logger } from '@ricdotnet/logger/dist';

export class Start extends Command {
  private embed: Message | undefined;

  async execute() {
    await this.start();

    const player = RuntimeData.get().getPlayer(this.guildId());

    if (!player) {
      await this._interaction.reply('Start a listening session with /play');
      return;
    }

    const url = this._interaction.options.get('url');

    if (!url) {
      await this._interaction.reply(
        'You must specify a spotify or youtube urls.',
      );
      return;
    }

    const channel = this._interaction.channel;

    if (!channel) {
      Logger.get().warn(
        'Something went wrong and there was no channel available.',
      );
      return;
    }

    await channel.send({
      embeds: [audioStartedEmbed()],
    });

    this.embed = await channel.send({
      embeds: [new EmbedBuilder().setTitle('Loading tracks...')],
    });

    const track = await player.start(<string>url.value);

    if (!track) {
      await this._interaction.editReply('There was no song to play next...');
      return;
    }

    this.embed.edit({
      embeds: [nowPlayingEmbed(track.info.title, track.info.artworkUrl)],
    });

    await this._interaction.deferReply();
    await this._interaction.deleteReply();
  }

  private async start() {
    const channels = this._interaction.guild?.channels;
    const channel = channels?.cache.find((c) => c.name === 'Concert');

    if (!channel) return;

    const manager = AudioManager.manager();
    await manager.join({
      guild: channel.guildId,
      channel: channel.id,
      node: '1',
    });

    const player = new AudioPlayer(
      channel.guildId,
      this._interaction.channelId,
    );
    RuntimeData.get().addPlayer(channel.guildId, player);

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
        option.setName('url').setDescription('Enter a spotify link'),
      );
  }
}
