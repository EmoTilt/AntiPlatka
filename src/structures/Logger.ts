/* eslint-disable no-console */
import { TextChannel } from 'discord.js';
import BotClient from './Client';

export default class Logger {
    private client: BotClient;
    private logChannelId: string | null;

    constructor(client: BotClient, logChannelId: string | null = null) {
        this.client = client;
        this.logChannelId = logChannelId;
    }

    public send(message: string): void {
        console.log(message.replaceAll('**', ''));

        if (this.logChannelId) {
            const channel = this.client.channels.cache.get(this.logChannelId) as TextChannel | undefined;
            if (channel && channel.isTextBased()) {
                channel
                    .send(message)
                    .catch(error => console.error('Не удалось отправить сообщение в канал логов:', error));
            }
        }
    }

    public async error(message: unknown): Promise<void> {
        console.error(`@everyone **[ERROR]** ${message}`);

        if (this.logChannelId) {
            const channel = this.client.channels.cache.get(this.logChannelId) as TextChannel | undefined;
            if (channel && channel.isTextBased()) {
                try {
                    await channel.send(`**[ERROR]** ${message}`);
                } catch (error) {
                    console.error('Не удалось отправить сообщение в канал логов:', error);
                }
            }
        }
    }
}
