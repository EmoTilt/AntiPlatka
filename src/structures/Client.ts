import { Client, ClientOptions, Collection } from "discord.js";
import Handler from "./Handler";
import Command from "./Command";
import Logger from "./Logger";

export default class BotClient extends Client {
    commands: Collection<string, Command> = new Collection;
    logger: Logger = new Logger(this, "1337754499573350442")

    constructor(options: ClientOptions) {
        super(options)
    }

    async init() {
        new Handler(this).run()
        this.login(process.env.TOKEN)
    }
}