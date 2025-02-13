import { Events, GuildMember, TextChannel } from 'discord.js';
import { Event } from '../interfaces';
import BotClient from '../structures/Client';
import { addPoll } from '../structures/addPoll';

export default class GuildMemberAdd implements Event {
    name = Events.GuildMemberAdd;
    once = false;

    execute(client: BotClient, member: GuildMember): void {
        const channel = client.channels.cache.get(client.config.voteChannel) as TextChannel;
        if (!channel) return;
        const poll = new addPoll(client, member, 8);
        poll.send().catch(error => client.logger.error(error));
    }
}
