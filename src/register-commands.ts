import { REST, Routes, Snowflake } from 'discord.js';
import { token, client_id } from '../config.json';
import { Commands } from './commands';
import { Logger } from '@ricdotnet/logger/dist';

type RestResponse = {
  [key: string]: string | number | boolean | null;
};

export class RegisterCommands {
  private readonly rest: REST;

  constructor() {
    this.rest = new REST().setToken(token);
  }

  async register(guildId: Snowflake) {
    const commands = Commands.instance().getCommands();
    
    try {
      Logger.get().info(
        `Started refreshing ${commands.length} application (/) commands for: ${guildId}`,
      );

      // The put method is used to fully refresh all commands in the guild with the current set
      const data: RestResponse = (await this.rest.put(
        Routes.applicationGuildCommands(client_id, guildId),
        { body: commands },
      )) as RestResponse;

      Logger.get().info(
        `Successfully reloaded ${data.length} application (/) commands for: ${guildId}`,
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  }
}
