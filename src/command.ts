import { CommandInteraction, SlashCommandBuilder, Snowflake } from "discord.js";

export abstract class Command {
  protected readonly _interaction: CommandInteraction;

  protected constructor(interaction: CommandInteraction) {
    this._interaction = interaction;
  }

  async execute() {}

  guildId(): Snowflake {
    if (!this._interaction.guildId) {
      throw new Error('This interaction had no guild id set');
    }
    
    return this._interaction.guildId;
  }
}
