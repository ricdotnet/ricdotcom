import { DiscordPacket, Manager, Rest } from 'lavacord';
import { Client, GatewayDispatchEvents } from 'discord.js';
import { lavalink_host, lavalink_pass } from '../../config.json';

// Define the nodes array as an example
const nodes = [
  { id: '1', host: lavalink_host, port: 2333, password: lavalink_pass },
];

export class AudioManager extends Manager {
  private static _instance: AudioManager;
  private readonly _client: Client;

  constructor(clientId: string, client: Client) {
    super(nodes, {
      user: clientId,
      send: (packet: DiscordPacket) => {
        const guild = client.guilds.cache.get(packet.d.guild_id);
        guild?.shard.send(packet);
      },
    });
    
    this._client = client;
  }

  async load() {
    return new Promise((resolve, _) => {
      this.on('error', (error, node) => {
        console.log(error);
        console.log(node.id);
      });

      this._client.ws.on(GatewayDispatchEvents.VoiceServerUpdate, (data) => {
        this.voiceServerUpdate(data);
      });

      this._client.ws.on(GatewayDispatchEvents.VoiceStateUpdate, (data) => {
        this.voiceStateUpdate(data);
      });

      AudioManager._instance = this;
      
      this.connect().then(() => {
        resolve(true);
      });
    });
  }

  static manager(): AudioManager {
    return AudioManager._instance;
  }

  getSong(song: string) {
    return Rest.load(this.idealNodes[0], song);
  }

  getClient() {
    return this._client;
  }
}
