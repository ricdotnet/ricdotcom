import { Client, Events } from 'discord.js';
import { RuntimeData } from '../runtime-data';
import { AudioManager } from '../lavacord/manager';
import { prisma } from '../../prisma';
import { Commands } from '../commands';
import { RegisterCommands } from '../register-commands';

export class ClientReady {
  constructor(client: Client) {
    client.once(Events.ClientReady, this.onClientReady);
  }

  async onClientReady(readyClient: Client<true>) {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    await new Commands().load();
    console.log('Commands loaded into commands collection');
    
    await new RuntimeData().load();
    console.log('RuntimeData container created');

    await new AudioManager(readyClient.user.id, readyClient).load();
    console.log('AudioManager created');

    const servers = await prisma.server.findMany();
    const commands = new RegisterCommands();
    
    for await (const server of servers) { 
      await commands.register(server.guildId);
    }
  }
}