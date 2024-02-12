import { AudioPlayer } from './lavacord/audio-player';
import { Snowflake } from 'discord.js';

export class RuntimeData {
  private static _instance: RuntimeData;

  // @ts-ignore
  private audioPlayers: Map<Snowflake, AudioPlayer>;

  constructor() {
    if (!RuntimeData._instance) {
      this.audioPlayers = new Map<Snowflake, AudioPlayer>();
      
      console.log('Opened a RuntimeData container');

      RuntimeData._instance = this;
    }
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