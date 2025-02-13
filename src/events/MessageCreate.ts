import { Events, Message, TextChannel } from 'discord.js';
import { Event } from '../interfaces';
import BotClient from '../structures/Client';

export default class ReadyEvent implements Event {
    name = Events.MessageCreate;
    once = false;

    execute(client: BotClient, message: Message): void {
        const channel = message.channel as TextChannel;
        if (channel.id == client.config.voteChannel) {
            if (message.reference) {
                message.delete().catch(error => client.logger.error(error));
            }
        }
    }
}
