/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// я ебал типизировать это

import { ApplicationCommandDataResolvable } from 'discord.js';
import BotClient from './Client';
import path from 'node:path';
import fs from 'node:fs';
import { Command } from '../interfaces';
import { Event } from '../interfaces';

export default class Handler {
    client: BotClient;

    constructor(client: BotClient) {
        this.client = client;
    }

    async commands() {
        const commands: ApplicationCommandDataResolvable[] = [];
        const foldersPath = path.join(__dirname, '../commands');
        const commandFolders = fs.readdirSync(foldersPath);

        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs
                .readdirSync(commandsPath)
                .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command: Command = new (await import(filePath)).default();
                if ('slash' in command && 'execute' in command) {
                    this.client.commands.set(command.slash.name, command);
                    commands.push(command.slash.toJSON());
                } else {
                    this.client.logger.send(
                        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
                    );
                }
            }

            this.slashLoader(commands);
        }
    }

    async events() {
        const eventsPath = path.join(__dirname, '../events');
        const eventFiles = fs
            .readdirSync(eventsPath)
            .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event: Event = new (await import(filePath)).default();

            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(this.client, ...args));
            } else {
                this.client.on(event.name, (...args) => event.execute(this.client, ...args));
            }
        }
    }

    private slashLoader(commands: ApplicationCommandDataResolvable[]) {
        this.client.guilds.cache.forEach(guild => {
            guild.commands.set([]).catch(error => this.client.logger.error(error));
            this.client.logger.send(`Successfully reloaded ${commands.length} guild (/) commands.`);
        });
        this.client.logger.send(`Successfully reloaded ${commands.length} application (/) commands.`);
    }
}
