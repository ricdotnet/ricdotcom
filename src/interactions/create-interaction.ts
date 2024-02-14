import { Client, Events, Interaction } from 'discord.js';
import { Commands } from '../commands';
import { Command } from '../command';

export class CreateInteraction {
  constructor(client: Client) {
    client.on(Events.InteractionCreate, this.onInteractionCreate);
  }

  async onInteractionCreate(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName;
    const commandClass = Commands.instance().get(commandName);

    if (!commandClass) {
      interaction.reply('This command does not exist.');
      return;
    }

    const command: Command = new commandClass(interaction);

    try {
      await command.execute();
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (err: any) {
      console.log(err.requestBody);
    }
  }
}
