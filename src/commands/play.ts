import {SlashCommandBuilder} from "discord.js";
import {joinVoiceChannel} from "@discordjs/voice";
import {Command} from "../command";
import {AudioManager} from "../lavacord/manager";
import {Player} from "lavacord";

export class Play extends Command {
    async execute() {
        const channels = this._interaction.guild?.channels;
        const channel = channels?.cache.find(c => c.name === 'Concert');

        if (!channel) return;

        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true,
        });

        const manager = AudioManager.manager();
        const track = await manager.getSong();

        const player: Player = await manager.join({
            guild: channel.guildId,
            channel: channel.id,
            node: "1"
        });

        // @ts-ignore
        await player.play(track.data.encoded);

        player.once("error", error => console.error(error));
        player.once("end", data => {
            if (data.type === "TrackEndEvent") {
                this.next();
            }
        });

        await this._interaction.reply('Joined voice channel.');
    }

    async next() {
        const manager = AudioManager.manager();
        const track = await manager.getSong('https://open.spotify.com/track/3anbfgm7kUTIdLibJmQnkk?si=b88f29d930c84767');
        // @ts-ignore
        manager.players.get('1')?.play(track.data.encoded);
    }

    command(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName('play')
            .setDescription('play a song from spotify or youtube');
    }
}
