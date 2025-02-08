import { Client, Collection } from 'discord.js';
import Handler from './Handler';
import Command from './Command';
import Logger from './Logger';
import Config from './Config';

export default class BotClient extends Client {
    commands: Collection<string, Command> = new Collection();
    config: Config = new Config();
    logger: Logger = new Logger(this, this.config.logChannel);

    constructor() {
        super(new Config().clientOptions);
        this.init().catch(error => this.logger.error(error));
    }

    private async init() {
        await new Handler(this).run();
        await this.login(process.env.TOKEN);
    }
}
