import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export abstract class Command {
  protected readonly _interaction: CommandInteraction;

  protected constructor(interaction: CommandInteraction) {
    this._interaction = interaction;
  }

  async execute() {}
}
