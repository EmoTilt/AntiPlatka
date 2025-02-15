import { GuildMember } from 'discord.js';
import BotClient from '../Client';

export type PollConstructorParams = {
    client: BotClient;
    targetMember: GuildMember;
    duration: number;
    content?: string;
    question?: string;
    isRestored?: boolean;
};
