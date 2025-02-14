import { ClientOptions, GatewayIntentBits } from 'discord.js';

class Config {
    private readonly _logChannel: string;
    private readonly _voteChannel: string;
    private readonly _role: string;
    private readonly _bannedChannel: string;
    private readonly _owner: string;

    private readonly _clientOptions: ClientOptions;

    constructor() {
        this._logChannel = process.env.LOGCHANNEL;
        this._voteChannel = process.env.VOTECHANNEL;
        this._role = process.env.ROLE;
        this._bannedChannel = process.env.BANNEDCHANNEL;
        this._owner = process.env.OWNER;

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

    get bannedChannel(): string {
        return this._bannedChannel;
    }

    get owner(): string {
        return this._owner;
    }

    get clientOptions(): ClientOptions {
        return this._clientOptions;
    }
}

export default Config;
