import { Client, Events, Guild } from 'discord.js';
import { deleteGuild } from '../../prisma/queries';

export class GuildDelete {
  constructor(client: Client) {
    client.on(Events.GuildDelete, this.onGuildDelete);
  }

  async onGuildDelete(guild: Guild) {
    const guildId = guild.id;

    await deleteGuild(guildId);
  }
}
