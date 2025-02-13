import { GuildMember, Poll, TextChannel } from 'discord.js';
import { BasePoll } from './BasePoll';
import BotClient from './Client';

export class AddPoll extends BasePoll {
    protected get action(): string {
        return 'add';
    }

    protected get textVotePass(): string {
        return `<@${this.targetMember.id}> прошёл на сервер!`;
    }

    protected get textVoteFailed(): string {
        return `<@${this.targetMember.id}> не прошёл на сервер! Порог меньше 70%.`;
    }

    constructor(client: BotClient, targetMember: GuildMember, duration: number) {
        super(
            client,
            targetMember,
            duration,
            `<@${targetMember.id}>`,
            'На сервер зашёл новый участник. Давайте решим: стоит ли его принять в наш Discord сервер? Порог - 70% голосов "Да"',
        );
    }

    protected handleResults(poll: Poll): void {
        const yes = poll.answers.get(1)?.voteCount || 0;
        const no = poll.answers.get(2)?.voteCount || 0;
        const channel = this.client.channels.cache.get(this.client.config.bannedchannel) as TextChannel;

        if (this.validateResult(yes, no)) {
            this.targetMember.roles
                .add(this.client.config.role)
                .catch(error => this.client.logger.error(error));
        } else {
            this.targetMember
                .ban({ reason: 'Отвергли при заходе' })
                .catch(error => this.client.logger.error(error));

            channel
                .send(
                    `${this.targetMember.displayName} (${this.targetMember.user.tag}) забанен. Причина: **покинул сервер**.`,
                )
                .catch(error => this.client.logger.error(error));
        }

        this.client.db.userPoll
            .delete({
                where: {
                    id: this.targetMember.id,
                },
            })
            .catch(error => this.client.logger.error(error));

        this.finishPoll(yes, no);
    }
}
