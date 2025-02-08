import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import Command from "../../structures/Command";

export default class PingCommand implements Command {
    slash = new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Пинг - понг!");

    execute(client: Client, interaction: ChatInputCommandInteraction): void {
        interaction.reply(`🏓 Понг!`);
    }
}