import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import BotClient from '../../structures/Client';
import { Command } from '../../interfaces';

function huify(name) {
    var i = 0;

    while ('бвгджзйклмнпрстфхцчшщ'.includes(name[i]) && (i < name.length)) i += 1;

    console.log(i);
    if (i >= name.length - 1) {
        return 'ху' + name.slice(1);
    }
    else {
        name = name.slice(i);

        if ('аоуыэ'.includes(name[0])) {

            const letters = new Map([['а', 'я'], ['о', 'ё'], ['ы', 'и'], ['э', 'e'], ['у', 'ю']]);
            return 'ху' + letters.get(name[0]) + name.slice(1);

        }
        else return 'ху' + name;
    }
}

export default class HuifyCommand implements Command {
    slash = new SlashCommandBuilder()
        .setName('huify')
        .setDescription('Имя - хуимя')
        .addStringOption(option =>
            option.setName('name').setDescription('Имя чтобы сделать хуимя').setRequired(true),
        ) as SlashCommandBuilder;

    execute(client: BotClient, interaction: ChatInputCommandInteraction): void {
        const name = interaction.options.getString('name');

        interaction.reply(name + ` - ` + huify(name)).catch(error => client.logger.error(error));
    }
}
