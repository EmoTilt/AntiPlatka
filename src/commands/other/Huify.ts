import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../structures/Command';
import BotClient from '../../structures/Client';

export default class HuifyCommand implements Command {
    slash = new SlashCommandBuilder()
        .setName('huify')
        .setDescription('Имя - хуимя')
        .addStringOption(option =>
            option.setName('Имя')
                .setDescription('Имя чтобы сделать хуимя')
                .setRequired(true));

    execute(client: BotClient, interaction: ChatInputCommandInteraction): void {
        const name = interaction.options.getString('Имя');

        interaction
            .reply(name + ` - ху` + name.slice(1))
            .catch(error => client.logger.error(error));
    }
}

