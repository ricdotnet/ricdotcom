import { DiscordPacket, Manager, Rest } from 'lavacord';
import { Client, GatewayDispatchEvents } from 'discord.js';
import { lavalink_host, lavalink_pass } from '../../config.json';

// Define the nodes array as an example
const nodes = [
  { id: '1', host: lavalink_host, port: 2333, password: lavalink_pass },
];

export class AudioManager extends Manager {
  private static _instance: AudioManager;

  constructor(clientId: string, client: Client) {
    super(nodes, {
      user: clientId,
      send: (packet: DiscordPacket) => {
        const guild = client.guilds.cache.get(packet.d.guild_id);
        guild?.shard.send(packet);
      },
    });

    this.connect().then(() => {
      console.log('Connected to lavalink...');
    });

    this.on('error', (error, node) => {
      console.log(error);
      console.log(node.id);
    });

    client.ws.on(GatewayDispatchEvents.VoiceServerUpdate, (data) => {
      this.voiceServerUpdate(data);
    });

    client.ws.on(GatewayDispatchEvents.VoiceStateUpdate, (data) => {
      this.voiceStateUpdate(data);
    });

    AudioManager._instance = this;
  }

  static manager(): AudioManager {
    return AudioManager._instance;
  }

  getSong(song: string) {
    return Rest.load(this.idealNodes[0], song);
  }
}
