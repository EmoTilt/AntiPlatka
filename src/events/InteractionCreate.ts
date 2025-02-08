import { Events, BaseInteraction } from 'discord.js';
import { Event } from '../interfaces';
import BotClient from '../structures/Client';

export default class InteractionCreate implements Event {
    name = Events.InteractionCreate;
    once = false;

    execute(client: BotClient, interaction: BaseInteraction): void {
        if (interaction.isChatInputCommand()) {
            client.commands.get(interaction.commandName)?.execute(client, interaction);
            client.logger.send(`**${interaction.user.tag}** used the **/${interaction.commandName}** command.`)
        }
    }
}