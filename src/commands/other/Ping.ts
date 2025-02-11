import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../structures/Command';
import BotClient from '../../structures/Client';

export default class PingCommand implements Command {
    slash = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Пинг - понг!');

    execute(client: BotClient, interaction: ChatInputCommandInteraction): void {
        interaction
            .reply(`👆 Подначить!`)
            .catch(error => client.logger.error(error));
    }
}
