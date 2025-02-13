import { ClientOptions, GatewayIntentBits } from 'discord.js';

class Config {
    private readonly _logChannel: string;
    private readonly _voteChannel: string;
    private readonly _role: string;

    private readonly _clientOptions: ClientOptions;

    constructor() {
        this._logChannel = '1337754499573350442';
        this._voteChannel = '1338504983166849044';
        this._role = '1338256303339868220';

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

    get voteChannel(): string {
        return this._voteChannel;
    }

    get role(): string {
        return this._role;
    }

    get clientOptions(): ClientOptions {
        return this._clientOptions;
    }
}

export default Config;
