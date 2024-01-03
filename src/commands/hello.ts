import {SlashCommandBuilder} from "discord.js";
import {Command} from "../command";

export class Hello extends Command {
    async execute() {
        await this._interaction.reply('world');
    }

    command(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName('hello')
            .setDescription('replies with world');
    }
}
