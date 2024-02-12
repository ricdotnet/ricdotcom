import { AudioManager } from './manager';

export type TTrackData = {
  encoded: string;
  info: {
    author: string;
    title: string;
    artworkUrl: string;
  };
  pluginInfo: object;
  userData: object;
  tracks?: TTrackData[];
};

export type TTrackLoadingResult = {
  loadType: 'track' | 'playlist';
  data: TTrackData;
};

export class AudioPlayer {
  private readonly songs: TTrackData[] = [];
  private readonly guildId: string | undefined;
  private readonly channelId: string | undefined;

  private static instance: AudioPlayer | null;

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
    return AudioPlayer.instance;
  }

  static destroy() {
    console.log('Closing the player...');
    AudioPlayer.instance = null;
  }

  async start(url: string): Promise<TTrackData | undefined> {
    if (!this.guildId) {
      throw new Error('GuildId is not set');
    }

    const manager = AudioManager.manager();
    const _player = manager.players.get(this.guildId);

    if (!_player) {
      return;
    }

    _player.once('error', (error) => {
      console.error(error);
      AudioPlayer.destroy();
    });
    _player.on('end', (data) => {
      if (data.type === 'TrackEndEvent' && data.reason === 'replaced') return;
      this.next();
    });

    // if (!track) {
    //   await this.stop();
    //   return;
    // }

    const trackData = (await manager.getSong(url)) as TTrackLoadingResult;

    if (trackData.loadType === 'playlist') {
      if (!trackData.data.tracks) {
        return;
        // return 'No tracks on this playlist...';
      }

      this.songs.push(...trackData.data.tracks);

      const track = this.songs.shift();

      if (track) {
        await _player.play(track.encoded);
      }

      return track;
    }

    await _player.play(trackData.data.encoded);

    return trackData.data;
  }

  async stop() {
    if (!this.guildId) {
      throw new Error('GuildId is not set');
    }

    const manager = AudioManager.manager();
    await manager.leave(this.guildId);

    AudioPlayer.destroy();
  }

  add(track: TTrackData) {
    this.songs.push(track);
  }

  async next() {
    if (!this.guildId) {
      throw new Error('GuildId is not set');
    }

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

    await _player.play(track.encoded);

    return track;
  }

  list() {
    return this.songs;
  }
}
