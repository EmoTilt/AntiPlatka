import { GuildMember, TextChannel, Message, Poll, MessageCreateOptions, EmbedBuilder } from 'discord.js';
import BotClient from './Client';

export abstract class BasePoll {
    public pollMessage!: Message;
    private timeout!: Timer;
    channel: TextChannel;

    constructor(
        protected client: BotClient,
        protected targetMember: GuildMember,
        private duration: number,
        private action: 'add' | 'ban',
        private content: string,
        private question: string,
    ) {
        this.channel = client.channels.cache.get(client.config.voteChannel) as TextChannel;
    }

    public async send(): Promise<void> {
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
        this.startTimer().catch(error => this.client.logger.error(error));
    }

    private async startTimer(): Promise<void> {
        this.timeout = setTimeout(
            () => {
                this.fetchAndProcessResults().catch(error => this.client.logger.error(error));
            },
            this.duration * 60 * 60 * 1000,
        );

        await this.client.db.userPoll.create({
            data: {
                id: this.targetMember.id,
                message: this.pollMessage.id,
                date: Date.now() + this.duration * 60 * 60 * 1000,
                action: this.action,
            },
        });
    }

    private async fetchAndProcessResults(): Promise<void> {
        const fetchedMessage = await this.pollMessage.fetch();
        if (!fetchedMessage) return;
        const poll = fetchedMessage.poll!;

        this.handleResults(poll);

        clearTimeout(this.timeout);
    }

    protected finishPoll(yes: number, no: number) {
        this.pollMessage.delete().catch(error => this.client.logger.error(error));
        const lines = {
            add: {
                true: `<@${this.targetMember.id}> прошёл на сервер!`,
                false: `<@${this.targetMember.id}> не прошёл на сервер! Порог меньше 70%.`,
            },
            ban: {
                true: `<@${this.targetMember.id}> был забанен на этом сервере.`,
                false: `<@${this.targetMember.id}> пощадили на этом сервере.`,
            },
        };
        const percent = (yes / (yes + no)) * 100;
        if (this.validateResult(yes, no)) {
            this.channel
                .send({
                    content: lines[this.action].true,
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#008000')
                            .setTitle('Результат:')
                            .addFields({
                                name: '✅ За',
                                value: `**${percent}%**`,
                            }),
                    ],
                })
                .catch(error => this.client.logger.error(error));
        } else {
            this.channel
                .send({
                    content: lines[this.action].false,
                    embeds: [
                        new EmbedBuilder().setColor('#008000').addFields({
                            name: '✅ За',
                            value: percent.toString(),
                        }),
                    ],
                })
                .catch(error => this.client.logger.error(error));
        }
    }

    public validateResult(yes: number, no: number) {
        const total = yes + no;

        if (yes === 0 && no === 0) {
            return false;
        }

        const yesPercentage = (yes / total) * 100;

        if (yesPercentage > 70) {
            return true;
        } else {
            return false;
        }
    }

    protected abstract handleResults(poll: Poll): void;
}
