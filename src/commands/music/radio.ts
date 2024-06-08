import { Command } from '../../command';
import { SlashCommandBuilder } from 'discord.js';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { Readable } from 'stream';
import { radio_fm } from '../../../config.json';
import { Logger } from '@ricdotnet/logger/dist';

export class Radio extends Command {
  async execute() {
    await this._interaction.deferReply();

    if (!radio_fm) {
      this._interaction.editReply(
        'Something went wrong when trying to play radio.',
      );
      Logger.get().info(
        'The "radio_fm" property is missing from the config file.',
      );
      return;
    }

    const response = await fetch(radio_fm);
    if (!response.body) return;

    // @ts-ignore
    const resource = createAudioResource(Readable.fromWeb(response.body));

    const player = createAudioPlayer();
    if (!player) {
      this._interaction.editReply(
        'There was an error trying to create an audio player to play radio in.',
      );
      return;
    }

    // TODO: setting for the default channel to join, or join the current voice if none is set

    const channels = this._interaction.guild?.channels;
    let channel = channels?.cache.find((c) => c.name === 'Concert');

    if (!channel) {
      // @ts-ignore
      channel = this._interaction.channel;

      // if (channel?.isTextBased) {
      //   this._interaction.editReply('This is a text channel. Please use /radio in a voice channel.');
      //   return;
      // }
    }

    if (!channel) {
      this._interaction.editReply('Could not find a channel to play on.');
      return;
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guildId,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    connection.subscribe(player);
    connection.on(VoiceConnectionStatus.Ready, () => player.play(resource));

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      this._interaction.editReply(
        `Disconnected from ${this._interaction.channel?.id}`,
      );
    });

    player.on('error', (error) => {
      console.log(error);
      this._interaction.editReply(
        'Something went wrong with the radio player.',
      );
    });

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('The audio player has started playing!');
    });

    player.on(AudioPlayerStatus.Idle, () => {
      console.log('Idle... trying to play again');
    });

    await this._interaction.editReply('Start listening to the radio (RFM)');
  }

  command(): SlashCommandBuilder {
    return <SlashCommandBuilder>(
      new SlashCommandBuilder()
        .setName('radio')
        .setDescription('Start listening to the radio (RFM)')
    );
  }
}
