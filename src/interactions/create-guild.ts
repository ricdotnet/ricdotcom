import { Client, Events, Guild } from 'discord.js';
import { RegisterCommands } from '../register-commands';

export class CreateGuild {
  constructor(client: Client) {
    client.on(Events.GuildCreate, this.onCreateGuild);
  }

  async onCreateGuild(guild: Guild) {
    console.log('creating a discord bot for:', guild.id)
    
    const guildId = guild.id;
    const commands = new RegisterCommands(guildId);
    await commands.load();
    await commands.register();
  }
}