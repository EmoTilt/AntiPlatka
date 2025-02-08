import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import BotClient from './Client';

export default abstract class Command {
    public abstract slash: SlashCommandBuilder;
    public abstract execute(
        client: BotClient,
        interaction: CommandInteraction,
    ): void;
}
