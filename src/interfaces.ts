import { APIPollAnswer, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import BotClient from './structures/Client';

export interface Command {
    slash: SlashCommandBuilder;

    execute(client: BotClient, interaction: CommandInteraction): void;
}

export interface Event {
    name: string;
    once?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (...args: any[]) => void;
}

export interface OptionsPoll {
    question: string;
    duration: number;
}

export interface PollOptions {
    question: string;
    duration: number; // ms
    allowedAnswers?: APIPollAnswer[];
}
