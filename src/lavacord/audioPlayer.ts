import { AudioManager } from "./manager";

type TTrackData = {
  encoded: string;
  info: {
    title: string;
  };
  pluginInfo: object;
  userData: object;
}

type TTrackLoadingResult = {
  loadType: 'track' | 'playlist';
  data: TTrackData;
}

export class AudioPlayer {
  // @ts-ignore
  private readonly songs: string[];
  // @ts-ignore
  private readonly guildId: string;
  // @ts-ignore
  private readonly channelId: string;

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

  async start() {
    const manager = AudioManager.manager();
    const _player = manager.players.get(this.guildId);

    if (!_player) {
      return;
    }

    const track = this.songs.shift();

    if (!track) {
      await this.stop();
      return;
    }

    const trackData = await manager.getSong(track) as TTrackLoadingResult;

    await _player.play(trackData.data.encoded);

    _player.once("error", error => console.error(error));
    _player.once("end", data => {
      if (data.type === "TrackEndEvent" && data.reason === "replaced") return;
      this.next();
    });

    return trackData.data.info.title;
  }

  async stop() {
    const manager = AudioManager.manager();

    await manager.leave(this.guildId);
  }

  add(track: string) {
    this.songs.push(track);
  }

  async next() {
    const manager = AudioManager.manager();
    const _player = manager.players.get(this.guildId);

    if (!_player) {
      return;
    }

    const track = this.songs.shift();

    if (!track) {
      await this.stop();
      return;
    }

    const trackData = await manager.getSong(track) as TTrackLoadingResult;

    await _player.play(trackData.data.encoded);

    return trackData.data.info.title;
  }

  list() {
    return this.songs;
  }
}
