import { Client, Events, Interaction } from 'discord.js';
import { Commands } from '../commands';
import { Command } from '../command';
import { Logger } from '@ricdotnet/logger/dist';
import { prisma } from '../../prisma';

export class CreateInteraction {
  constructor(client: Client) {
    client.on(Events.InteractionCreate, this.onInteractionCreate);
  }

  async onInteractionCreate(interaction: Interaction) {
    if (!interaction.isChatInputCommand() || !interaction.guildId) return;
    const commandName = interaction.commandName;
    const commandClass = Commands.instance().get(commandName);

    const log = {
      guildId: interaction.guildId,
      command: interaction.commandName,
      username: interaction.user.username,
      userId: interaction.user.id,
    }
    Logger.get().info(`Interaction incoming: ${JSON.stringify(log)}`);
    
    if (!commandClass) {
      interaction.reply('This command does not exist.');
      return;
    }

    const command: Command = new commandClass(interaction);

    try {
      await command.execute();
      await prisma.server.update({
        // @ts-ignore
        where: {
          guildId: interaction.guildId,
        },
        data: {
          lastCommand: new Date(),
        }
      });
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (err: any) {
      Logger.get().error(err);
    }
  }
}
