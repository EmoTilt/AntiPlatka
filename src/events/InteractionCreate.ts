import { Events, BaseInteraction, ChannelType } from 'discord.js';
import { Event } from '../interfaces';
import BotClient from '../structures/Client';

export default class InteractionCreate implements Event {
    name = Events.InteractionCreate;
    once = false;

    execute(client: BotClient, interaction: BaseInteraction): void {
        if (interaction.isChatInputCommand()) {
            if(!interaction.inGuild()) {
                interaction.reply({
                    content: "Команды недоступны в личных сообщениях.",
                    flags: 'Ephemeral'
                });
                return;
            };
            client.commands.get(interaction.commandName)?.execute(client, interaction);
            client.logger.send(`**${interaction.user.tag}** used the **/${interaction.commandName}** command.`);
        }
    }
}