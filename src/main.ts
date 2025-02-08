import { GatewayIntentBits } from 'discord.js';
import BotClient from './structures/Client';
import * as dotenv from "dotenv";
dotenv.config();

const client = new BotClient({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]});

client.init()