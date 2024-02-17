import { Client, Events } from 'discord.js';
import { RuntimeData } from '../runtime-data';
import { AudioManager } from '../lavacord/manager';
import { prisma } from '../../prisma';
import { Commands } from '../commands';
import { RegisterCommands } from '../register-commands';
import { Logger } from '@ricdotnet/logger/dist';

export class ClientReady {
  constructor(client: Client) {
    client.once(Events.ClientReady, this.onClientReady);
  }

  async onClientReady(readyClient: Client<true>) {
    Logger.get().info(`Ready! Logged in as ${readyClient.user.tag}`);

    await new Commands().load();
    Logger.get().info('Commands loaded into commands collection');
    
    await new RuntimeData().load();
    Logger.get().info('RuntimeData container created');

    await new AudioManager(readyClient.user.id, readyClient).load();
    Logger.get().info('AudioManager created');

    const servers = await prisma.guild.findMany();
    const commands = new RegisterCommands();
    
    for await (const server of servers) { 
      await commands.register(server.guildId);
    }
  }
}