import { Client, GatewayIntentBits } from 'discord.js';
import { token } from '../config.json';
import { ClientReady, InteractionCreate, GuildCreate, GuildDelete } from './handlers';
import { Logger } from '@ricdotnet/logger/dist';

const client: Client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

new ClientReady(client);
new InteractionCreate(client);
new GuildCreate(client);
new GuildDelete(client);

new Logger({
  level: 'debug',
  logToFile: false,
});

// Log in to Discord with your client's token
client.login(token);
