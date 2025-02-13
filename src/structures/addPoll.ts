import { GuildMember, Poll, TextChannel } from 'discord.js';
import { BasePoll } from './BasePoll';
import BotClient from './Client';

export class addPoll extends BasePoll {
    constructor(client: BotClient, targetMember: GuildMember, duration: number) {
        super(
            client,
            targetMember,
            duration,
            'add',
            `<@${targetMember.id}>`,
            'На сервер зашёл новый участник. Давайте решим: стоит ли его принять в наш Discord сервер? Порог - 70% голосов "Да"',
        );
    }

    protected handleResults(poll: Poll): void {
        const yes = poll.answers.get(1)?.voteCount || 0;
        const no = poll.answers.get(2)?.voteCount || 0;
        const channel = this.client.channels.cache.get('1339382880094261248') as TextChannel;

        if (this.win(yes, no)) {
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
