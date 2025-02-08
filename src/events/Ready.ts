import { Events, Client } from 'discord.js';
import { Event } from '../interfaces';

export default class ReadyEvent implements Event {
    name = Events.ClientReady;
    once = true;

    execute(client: Client): void {
        console.log(`Ready! Logged in as ${client.user?.tag}`);
    }
}