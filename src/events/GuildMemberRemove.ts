import { Events, GuildMember, TextChannel } from 'discord.js';
import { Event } from '../interfaces';
import BotClient from '../structures/Client';

export default class GuildMemberRemove implements Event {
    name = Events.GuildMemberRemove;
    once = false;

    execute(client: BotClient, member: GuildMember): void {
        member.ban({ reason: 'Покинул сервер' }).catch(error => client.logger.error(error));
        const channel = client.channels.cache.get(client.config.bannedChannel) as TextChannel;

        channel
            .send(`${member.displayName} (${member.user.tag}) забанен. Причина: **покинул сервер**.`)
            .catch(error => client.logger.error(error));
    }
}
