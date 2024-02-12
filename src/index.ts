import {
	Client,
	Events,
	GatewayIntentBits,
	Guild,
	Interaction,
} from "discord.js";
import { token, guild_id } from "../config.json";
import { RegisterCommands } from "./registerCommands";
import { Commands } from "./commands";
import { Command } from "./command";
import { AudioManager } from "./lavacord/manager";
import { RuntimeData } from "./runtime-data";

const client: Client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once(Events.ClientReady, (readyClient: Client<true>) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	new RuntimeData();
	new AudioManager(readyClient.user.id, readyClient);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const commandName = interaction.commandName;
	const commandClass = Commands.instance().get(commandName);

	if (!commandClass) {
		interaction.reply("This command does not exist.");
		return;
	}

	const command: Command = new commandClass(interaction);
	await command.execute();
});

(async () => {
	new Commands();
	const commands = new RegisterCommands(guild_id);
	await commands.load();
	await commands.register();
})();

// Log in to Discord with your client's token
client.login(token);

// TODO: update this
client.on(Events.GuildCreate, async (guild: Guild) => {
	const guildId = guild.id;
	const commands = new RegisterCommands(guildId);
	await commands.load();
	await commands.register();
});
