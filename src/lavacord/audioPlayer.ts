import { AudioManager } from "./manager";
import { Message } from "discord.js";

type TTrackData = {
  encoded: string;
  info: {
    title: string;
  };
  pluginInfo: object;
  userData: object;
  tracks?: TTrackData[];
}

export type TTrackLoadingResult = {
  loadType: 'track' | 'playlist';
  data: TTrackData;
}

export class AudioPlayer {
  private readonly songs: TTrackData[] = [];
  private readonly guildId: string | undefined;
  private readonly channelId: string | undefined;
  private _embedMessage: Message | undefined;

  private static instance: AudioPlayer;

  constructor(guildId: string, channelId: string) {
    if (!AudioPlayer.instance) {
      this.songs = [];

      this.guildId = guildId;
      this.channelId = channelId;

      console.log('Opened an audio player.');

      AudioPlayer.instance = this;
    }
  }

  static get() {
    return this.instance;
  }

  async start(url: string) {
    const manager = AudioManager.manager();
    const _player = manager.players.get(this.guildId!);

    if (!_player) {
      return;
    }

    _player.once('error', error => console.error(error));
    _player.on('end', data => {
      if (data.type === 'TrackEndEvent' && data.reason === 'replaced') return;
      this.next();
    });

    // if (!track) {
    //   await this.stop();
    //   return;
    // }

    const trackData = await manager.getSong(url) as TTrackLoadingResult;

    if (trackData.loadType === 'playlist') {
      if (!trackData.data.tracks) {
        return 'No tracks on this playlist...';
      }

      this.songs.push(...trackData.data.tracks);

      const track = this.songs.shift();

      if (track) {
        await _player.play(track.encoded);
      }

      return track?.info.title;
    }

    await _player.play(trackData.data.encoded);

    return trackData.data.info.title;
  }

  async stop() {
    const manager = AudioManager.manager();

    await manager.leave(this.guildId!);
  }

  add(track: TTrackData) {
    this.songs.push(track);
  }

  async next() {
    const manager = AudioManager.manager();
    const _player = manager.players.get(this.guildId!);

    if (!_player) {
      return;
    }

    const track = this.songs.shift();

    if (!track) {
      await this.stop();
      return;
    }

    await _player.play(track.encoded);

    return track.info.title;
  }

  list() {
    return this.songs;
  }

  set embedMessage(message: Message) {
    this._embedMessage = message;
  }

  get embedMessage(): Message | void {
    if (!this._embedMessage) {
      console.log('There is no embed message to update.');
      return;
    }
    return this._embedMessage;
  }
}
