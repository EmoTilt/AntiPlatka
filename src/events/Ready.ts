import { Events, Client } from 'discord.js';
import { Event } from '../interfaces';
import BotClient from '../structures/Client';

export default class ReadyEvent implements Event {
    name = Events.ClientReady;
    once = true;

    execute(client: BotClient): void {
        client.logger.send(`Ready! Logged in as ${client.user?.tag}`);
    }
}