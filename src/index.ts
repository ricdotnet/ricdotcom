import { Client, Events, GatewayIntentBits, Guild } from 'discord.js';
import { token, guild_id } from '../config.json';
import { RegisterCommands } from './register-commands';
import { Commands } from './commands';
import { ClientReady, CreateInteraction, CreateGuild } from './interactions';

const client: Client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

new ClientReady(client);
new CreateInteraction(client);
new CreateGuild(client);

// TODO: if allowing multiple guilds, this does not need to be here,
// however, good for restarts,
// so maybe look in the db for what guilds have added
(async () => {
  new Commands();
  const commands = new RegisterCommands(guild_id);
  await commands.load();
  await commands.register();
})();

// Log in to Discord with your client's token
client.login(token);
