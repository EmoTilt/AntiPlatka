import BotClient from './structures/Client';
import * as dotenv from "dotenv";
dotenv.config();

const client = new BotClient();

client.init();