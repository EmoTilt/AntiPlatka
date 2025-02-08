import { Client, ClientOptions, Collection } from "discord.js";
import Handler from "./Handler";
import Command from "./Command";

export default class BotClient extends Client {
    commands: Collection<string, Command> = new Collection;

    constructor(options: ClientOptions) {
        super(options)
    }

    async init() {
        new Handler(this).run()
        this.login(process.env.TOKEN)
    }
}