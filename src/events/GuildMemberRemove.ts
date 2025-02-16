import { Events, GuildMember, TextChannel } from 'discord.js';
import { Event } from '../interfaces';
import BotClient from '../structures/Client';

export default class GuildMemberRemove implements Event {
    name = Events.GuildMemberRemove;
    once = false;

    execute(client: BotClient, member: GuildMember): void {
        if (!member.roles.cache.get(client.config.role)) {
            member.ban({ reason: 'Вышел во время голосования' }).catch(error => client.logger.error(error));

            client.db.userPoll
                .findFirst({
                    where: { memberId: member.id },
                })
                .then(memberDb => {
                    if (memberDb) {
                        client.db.userPoll
                            .delete({
                                where: { memberId: member.id },
                            })
                            .catch(error => client.logger.error(error));
                        const voteChannel = client.channels.cache.get(client.config.voteChannel);
                        if (voteChannel && voteChannel instanceof TextChannel) {
                            voteChannel.messages
                                .fetch(memberDb.messageId)
                                .then(message => message.delete())
                                .catch(error => client.logger.error(error));
                        }
                    }
                })
                .catch(error => client.logger.error(error));

            const bannedChannel = client.channels.cache.get(client.config.bannedChannel) as TextChannel;

            bannedChannel
                .send(
                    `${member.displayName} (${member.user.tag}) забанен. Причина: **Вышел во время голосования**.`,
                )
                .catch(error => client.logger.error(error));
        }
    }
}
