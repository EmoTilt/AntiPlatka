import { ClientOptions, GatewayIntentBits } from 'discord.js';

class Config {
    private readonly _logChannel: string;
    private readonly _clientOptions: ClientOptions;

    constructor() {
        this._logChannel = '1337754499573350442';

        this._clientOptions = {
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
        };
    }

    get logChannel(): string {
        return this._logChannel;
    }

    get clientOptions(): ClientOptions {
        return this._clientOptions;
    }
}

export default Config;
