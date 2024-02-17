import { Client, Events, Guild } from 'discord.js';
import { RegisterCommands } from '../register-commands';
import { Logger } from '@ricdotnet/logger/dist';
import { createGuild } from '../../prisma/queries';

export class GuildCreate {
  constructor(client: Client) {
    client.on(Events.GuildCreate, this.onGuildCreate);
  }

  async onGuildCreate(guild: Guild) {
    Logger.get().info(`Creating a discord bot for: ${guild.id}`);
    
    const guildId = guild.id;
    const commands = new RegisterCommands();
    await commands.register(guildId);
    
    await createGuild(guildId);
  }
}