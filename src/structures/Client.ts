import { Client, Collection } from 'discord.js';
import Handler from './Handler';
import { Command } from '../interfaces';
import Logger from './Logger';
import Config from './Config';
import { PrismaClient } from '@prisma/client';
import restorePolls from './poll/RestorePoll';
import { BasePoll } from './poll/BasePoll';

export default class BotClient extends Client {
    currentPolls: Set<BasePoll>;

    commands: Collection<string, Command> = new Collection();
    config: Config;
    logger: Logger;
    db: PrismaClient;

    get properMembersCount(): number | undefined {
        const p = this.guilds.cache.get(this.config.guild)?.roles.cache.get(this.config.role)?.members.size;
        if (p === undefined) {
            this.logger.error('Unable to fetch proper members count');
        }
        return p;
    }

    constructor(config: Config) {
        super(config.clientOptions);

        this.currentPolls = new Set();
        this.config = config;
        this.logger = new Logger(this, this.config.logChannel);
        this.db = new PrismaClient();
        this.init().catch(error => this.logger.error(error));
    }

    private async init() {
        await new Handler(this).events();
        await this.login(process.env.TOKEN);
        await new Handler(this).commands();
        await restorePolls(this);
        await this.guilds.fetch();
        await this.guilds.cache.get(this.config.guild)?.roles.fetch();
        await this.guilds.cache.get(this.config.guild)?.members.fetch();
        const client = this;
        function eternity() {
            let properMembersCount = client.properMembersCount;
            if (properMembersCount === undefined) {
                return;
            }
            if (properMembersCount) {
                for (const i of client.currentPolls) {
                    i.closeIfClosable();
                }
            }
        }
        setInterval(eternity, 5000);
    }
}
