declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            LOGCHANNEL: string;
            VOTECHANNEL: string;
            ROLE: string;
            BANNEDCHANNEL: string;
            OWNER: string;
            GUILD: string;
        }
    }
}
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
