import { GuildMember, TextChannel, Message, Poll, MessageCreateOptions, EmbedBuilder } from 'discord.js';
import BotClient from '../Client';
import { PollConstructorParams } from './PollTypes';

export abstract class BasePoll {
    public pollMessage!: Message;
    private timeout!: Timer;
    channel: TextChannel;
    client: BotClient;
    targetMember: GuildMember;
    duration: number;
    content: string;
    question: string;
    isRestored: boolean;

    protected abstract get action(): string;
    protected abstract get textVotePass(): string;
    protected abstract get textVoteFailed(): string;

    constructor(params: PollConstructorParams) {
        if (params.duration <= 0) throw new Error('Продолжительность должна быть положительным числом');
        if (params.question && params.question.length > 300)
            throw new Error('Вопрос опроса превышает 300 символов');

        this.client = params.client;
        this.targetMember = params.targetMember;
        this.duration = params.duration;
        this.content = params.content ?? `@everyone - ${params.targetMember.toString()}`;
        this.question = params.question ?? '';
        this.isRestored = params.isRestored ?? false;

        const channel = this.client.channels.cache.get(this.client.config.voteChannel);
        if (!(channel instanceof TextChannel)) {
            throw new Error('Канал голосования не является текстовым каналом.');
        }
        this.channel = channel;
    }

    public async send(): Promise<void> {
        try {
            const options: MessageCreateOptions = {
                content: this.content,
                poll: {
                    question: { text: this.question },
                    duration: this.duration,
                    answers: [
                        { text: 'Да', emoji: '✅' },
                        { text: 'Нет', emoji: '❌' },
                    ],
                    allowMultiselect: false,
                },
            };

            this.pollMessage = await this.channel.send(options);
            await this.startTimer();
        } catch (error) {
            this.client.logger.error(`Не удалось отправить голосование: ${error}`);
            throw error;
        }
    }

    private async startTimer(remainingTime?: number): Promise<void> {
        const timeoutDuration = remainingTime || this.duration * 60 * 60 * 1000;
        try {
            this.timeout = setTimeout(() => {
                void (async () => {
                    try {
                        await this.fetchAndProcessResults();
                    } catch (error) {
                        this.client.logger.error(`Обработка голосования не удалась: ${error}`);
                    }
                })();
            }, timeoutDuration);

            if (!this.isRestored) {
                await this.client.db.userPoll.create({
                    data: {
                        memberId: this.targetMember.id,
                        messageId: this.pollMessage.id,
                        date: Date.now() + this.duration * 60 * 60 * 1000,
                        action: this.action,
                    },
                });
            }
        } catch (error) {
            clearTimeout(this.timeout);
            this.client.logger.error(`Не удалось запустить отсчёт опроса: ${error}`);
            throw error;
        }
    }

    private async fetchAndProcessResults(): Promise<void> {
        try {
            const fetchedMessage = await this.pollMessage.fetch(true);
            if (!fetchedMessage?.poll) {
                this.client.logger.error('Сообщение голосования не найдено.');
                return;
            }

            await this.handleResults(fetchedMessage.poll);
        } catch (error) {
            this.client.logger.error(`Не удалось обработать результаты голосования: ${error}`);
        } finally {
            clearTimeout(this.timeout);
        }
    }
    protected async finishPoll(yes: number, no: number): Promise<void> {
        try {
            await this.pollMessage.delete();
        } catch (error) {
            this.client.logger.error(`Не удалось удалить голосование: ${error}`);
        }

        const total = yes + no;
        const yesPercentage = total > 0 ? (yes / total) * 100 : 0;
        const resultEmbed = new EmbedBuilder()
            .setTitle('Результат')
            .setColor('#397b44')
            // .setAuthor({
            //     name: this.targetMember.displayName,
            //     iconURL: this.targetMember.avatarURL() || '',
            // })
            .addFields(
                { name: '✅ За', value: `**${yes}** (${yesPercentage.toFixed(1)}%)`, inline: false },
                {
                    name: '❌ Против',
                    value: `**${no}** (${(100 - yesPercentage).toFixed(1)}%)`,
                    inline: false,
                },
            );
        await this.channel.send({
            content: this.validateResult(yes, no) ? this.textVotePass : this.textVoteFailed,
            embeds: [resultEmbed],
        });

        try {
            await this.client.db.userPoll.delete({
                where: { messageId: this.pollMessage.id },
            });
        } catch (error) {
            this.client.logger.error(`Failed to clean up poll record: ${error}`);
        }
    }

    public validateResult(yes: number, no: number): boolean {
        const total = yes + no;
        return total > 0 && (yes / total) * 100 >= 70;
    }

    protected abstract handleResults(poll: Poll): Promise<void>;
}
