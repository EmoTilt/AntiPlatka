import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces';
import BotClient from '../../structures/Client';

export default class EvalCommand implements Command {
    slash = new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Выполнить JS код')
        .addStringOption(option =>
            option.setName('code').setDescription('Выполнить JS код').setRequired(true),
        ) as SlashCommandBuilder;

    execute(client: BotClient, interaction: ChatInputCommandInteraction): void {
        if (interaction.member?.user.id == '1068094601962991666') {
            const code = interaction.options.getString('code');
            if (code) {
                eval(code);
            }
        }
    }
}
