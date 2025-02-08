import { Client, TextChannel } from 'discord.js';

export default class Logger {
    private client: Client;
    private logChannelId: string | null;

    constructor(client: Client, logChannelId: string | null = null) {
        this.client = client;
        this.logChannelId = logChannelId;
    }

    public async send(message: string): Promise<void> {
        console.log(message.replaceAll("**", ""));

        if (this.logChannelId) {
            const channel = this.client.channels.cache.get(this.logChannelId) as TextChannel | undefined;
            if (channel && channel.isTextBased()) {
                try {
                    await channel.send(message);
                } catch (error) {
                    console.error('Не удалось отправить сообщение в канал логов:', error);
                }
            }
        }
    }

    public async error(message: unknown): Promise<void> {
        console.error(`[ERROR] ${message}`);

        if (this.logChannelId) {
            const channel = this.client.channels.cache.get(this.logChannelId) as TextChannel | undefined;
            if (channel && channel.isTextBased()) {
                try {
                    await channel.send(`[ERROR] ${message}`);
                } catch (error) {
                    console.error('Не удалось отправить сообщение в канал логов:', error);
                }
            }
        }
    }
}