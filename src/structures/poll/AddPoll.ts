import { Poll, TextChannel } from 'discord.js';
import { BasePoll } from './BasePoll';
import { PollConstructorParams } from './PollTypes';

export class AddPoll extends BasePoll {
    protected get action(): string {
        return 'add';
    }

    protected get textVotePass(): string {
        return `Участник ${this.targetMember} принят на сервер!`;
    }

    protected get textVoteFailed(): string {
        return `Участник ${this.targetMember.id} не прошёл голосование. Требуется 70% голосов "За".`;
    }

    constructor(params: PollConstructorParams) {
        super({
            ...params,
            question:
                'Принять нового участника на сервер? Давайте решим: стоит ли его принять в наш Discord сервер? Порог - 70% голосов "Да"',
        });
    }

    protected async handleResults(poll: Poll): Promise<void> {
        const yes = poll.answers.get(1)?.voteCount || 0;
        const no = poll.answers.get(2)?.voteCount || 0;

        try {
            if (this.validateResult(yes, no)) {
                await this.targetMember.roles.add(this.client.config.role);
            } else {
                await this.targetMember.ban({ reason: 'Отклонено голосованием' });
                const bannedChannel = this.client.channels.cache.get(this.client.config.bannedChannel);
                if (bannedChannel instanceof TextChannel) {
                    try {
                        await bannedChannel.send(
                            `${this.targetMember.user.tag} (${this.targetMember.id}) забанен. Причина: **отклонён голосованием**.`,
                        );
                    } catch (error) {
                        this.client.logger.error(`Не удалось отправить сообщение о бане в канал: ${error}`);
                    }
                }
            }
        } catch (error) {
            this.client.logger.error(`Ошибка при обработке результатов голосования: ${error}`);
        } finally {
            await this.finishPoll(yes, no);
        }
    }
}
