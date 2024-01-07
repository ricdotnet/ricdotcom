import {DiscordPacket, Manager, Rest} from 'lavacord';
import {Client, GatewayDispatchEvents} from "discord.js";

// Define the nodes array as an example
const nodes = [
    {id: "1", host: "localhost", port: 2333, password: "youshallnotpass"}
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
        })

        client.ws.on(GatewayDispatchEvents.VoiceStateUpdate, (data) => {
            this.voiceStateUpdate(data);
        })

        AudioManager._instance = this;
    }

    static manager(): AudioManager {
        return this._instance;
    }

    getSong(song: string | null = null) {
        return Rest.load(this.idealNodes[0], song ?? 'https://open.spotify.com/track/7ofV2J7Ndzo2s5NBEgfpxl?si=2d571b763bc841ad');
    }

}
