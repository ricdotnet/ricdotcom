import { AudioPlayer } from './lavacord/audio-player';
import { Snowflake } from 'discord.js';

export class RuntimeData {
  private static _instance: RuntimeData;

  // @ts-ignore
  private audioPlayers: Map<Snowflake, AudioPlayer>;

  async load() {
    return new Promise((resolve, reject) => {
      if (RuntimeData._instance) {
        reject();
      }
      
      this.audioPlayers = new Map<Snowflake, AudioPlayer>();
      RuntimeData._instance = this;

      resolve(true);
    });
  }

  addPlayer(guildId: Snowflake, player: AudioPlayer) {
    this.audioPlayers.set(guildId, player);
  }

  getPlayer(guildId: Snowflake): AudioPlayer | undefined {
    return this.audioPlayers.get(guildId);
  }
  
  deletePlayer(guildId: Snowflake) {
    this.audioPlayers.delete(guildId);
  }

  static get() {
    return RuntimeData._instance;
  }
}