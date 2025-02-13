import { Client, Collection } from 'discord.js';
import Handler from './Handler';
import { Command } from '../interfaces';
import Logger from './Logger';
import Config from './Config';
import { PrismaClient } from '@prisma/client';

export default class BotClient extends Client {
    commands: Collection<string, Command> = new Collection();
    config: Config;
    logger: Logger;
    db: PrismaClient;

    constructor(config: Config) {
        super(config.clientOptions);

        this.config = config;
        this.logger = new Logger(this, this.config.logChannel);
        this.db = new PrismaClient();
        this.init().catch(error => this.logger.error(error));
    }

    private async init() {
        await new Handler(this).events();
        await this.login(process.env.TOKEN);
        await new Handler(this).commands();
    }
}
