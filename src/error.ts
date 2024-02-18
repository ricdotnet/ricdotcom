import { CommandInteraction } from 'discord.js';

export async function sendError(
  interaction: CommandInteraction,
  msg: string = 'Something went wrong when using this command.',
) {
  await interaction.editReply(`❌ ${msg}`);
}
