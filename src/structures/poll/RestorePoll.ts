import { TextChannel } from 'discord.js';
import BotClient from '../Client';
import { AddPoll } from './AddPoll';
import { BasePoll } from './BasePoll';

export default async function restorePolls(client: BotClient): Promise<void> {
    try {
        const polls = await client.db.userPoll.findMany();

        for (const pollRecord of polls) {
            const channel = client.channels.cache.get(client.config.voteChannel);
            if (!(channel instanceof TextChannel)) continue;
            try {
                const message = await channel.messages.fetch(pollRecord.messageId);
                if (!message) {
                    await client.db.userPoll.delete({
                        where: { messageId: pollRecord.messageId, memberId: pollRecord.memberId },
                    });
                    continue;
                }

                const guild = client.guilds.cache.get(client.config.guild);
                if (!guild) continue;

                const targetMember = await guild.members.fetch(pollRecord.memberId);
                let poll: BasePoll;

                switch (pollRecord.action) {
                    case 'add':
                        // isRestored = true
                        poll = new AddPoll({
                            client: client,
                            targetMember: targetMember,
                            duration: 1,
                            isRestored: true,
                        });
                        break;
                    default:
                        continue;
                }

                poll.pollMessage = message;
                const remainingTime = Number(pollRecord.date) - Date.now();

                // :]
                if (remainingTime <= 0) {
                    await poll['fetchAndProcessResults']();
                } else {
                    await poll['startTimer'](remainingTime);
                }
            } catch (error) {
                client.logger.error(`Ошибка восстановления голосования: ${error}`);
                await client.db.userPoll.delete({
                    where: { messageId: pollRecord.messageId, memberId: pollRecord.memberId },
                });
            }
        }
    } catch (error) {
        client.logger.error(`Ошибка восстановления голосований: ${error}`);
    }
}
