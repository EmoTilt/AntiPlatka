import { ClientOptions, GatewayIntentBits } from 'discord.js';

class Config {
    private readonly _logChannel: string;
    private readonly _voteChannel: string;
    private readonly _role: string;
    private readonly _bannedchannel: string;

    private readonly _clientOptions: ClientOptions;

    constructor() {
        this._logChannel = process.env.LOGCHANNEL;
        this._voteChannel = process.env.VOTECHANNEL;
        this._role = process.env.ROLE;
        this._bannedchannel = process.env.BANNEDCHANNEL;

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

    get bannedchannel(): string {
        return this._bannedchannel;
    }

    get clientOptions(): ClientOptions {
        return this._clientOptions;
    }
}

export default Config;
