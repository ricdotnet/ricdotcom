import { Client, GatewayIntentBits } from 'discord.js';
import { token } from '../config.json';
import { ClientReady, CreateInteraction, CreateGuild } from './interactions';
import { Logger } from '@ricdotnet/logger/dist';

const client: Client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

new ClientReady(client);
new CreateInteraction(client);
new CreateGuild(client);
new Logger({
  level: 'debug',
  logToFile: false,
});

// Log in to Discord with your client's token
client.login(token);
