import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../command';

export class Ping extends Command {
  async execute() {
    await this._interaction.reply('pong');
  }

  command(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName('ping')
      .setDescription('replies with pong');
  }
}
