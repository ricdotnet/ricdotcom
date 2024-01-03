import {REST, Routes, Snowflake} from "discord.js";
import {token, client_id} from '../config.json';
import * as path from "path";
import * as fs from "fs";
import {Commands} from "./commands";

export class RegisterCommands {
    private readonly rest: REST;
    private commands: any[] = [];

    private readonly guildId: Snowflake;

    constructor(guildId: string) {
        this.rest = new REST().setToken(token);
        this.guildId = guildId;
    }

    async load(): Promise<RegisterCommands> {
        const commandsPath = path.join(__dirname, 'commands');
        const files = fs.readdirSync(commandsPath);
        const commands = Commands.instance();

        for (let file of files) {
            const cmdFile = await import(path.join(commandsPath, file));
            const className = Object.keys(cmdFile)[0];
            const _class = new cmdFile[className];

            this.commands.push(_class.command().toJSON());
            commands.set(_class.command().name, cmdFile[className]);
        }

        return this;
    }

    async register() {
        try {
            console.log(`Started refreshing ${this.commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data: unknown = await this.rest.put(
                Routes.applicationGuildCommands(client_id, this.guildId),
                {body: this.commands},
            );

            // @ts-ignore
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    }
}
