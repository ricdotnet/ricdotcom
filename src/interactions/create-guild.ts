import { Client, Events, Guild } from 'discord.js';
import { RegisterCommands } from '../register-commands';
import { prisma } from '../../prisma';

export class CreateGuild {
  constructor(client: Client) {
    client.on(Events.GuildCreate, this.onCreateGuild);
  }

  async onCreateGuild(guild: Guild) {
    console.log('Creating a discord bot for:', guild.id)
    
    const guildId = guild.id;
    const commands = new RegisterCommands();
    await commands.register(guildId);
    
    await prisma.server.create({
      data: {
        guildId: guildId,
      }
    });
  }
}