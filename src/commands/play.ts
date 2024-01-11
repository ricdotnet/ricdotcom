import { SlashCommandBuilder } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
import { Command } from "../command";
import { AudioManager } from "../lavacord/manager";
import { AudioPlayer } from "../lavacord/audioPlayer";

export class Play extends Command {
    async execute() {
        const channels = this._interaction.guild?.channels;
        const channel = channels?.cache.find(c => c.name === 'Concert');

        if (!channel) return;

        const manager = AudioManager.manager();
        await manager.join({
            guild: channel.guildId,
            channel: channel.id,
            node: "1"
        });
        new AudioPlayer(channel.guildId, channel.id);

        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true,
        });

        await this._interaction.reply('Joined the Concert voice channel.');
    }

    command(): SlashCommandBuilder {
      return <SlashCommandBuilder>new SlashCommandBuilder()
        .setName('play')
        .setDescription('Join the Concert voice channel');
    }
}
