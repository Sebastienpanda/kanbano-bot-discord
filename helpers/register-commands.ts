import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Collection, REST, Routes } from "discord.js";
import { readdirSync } from "node:fs";
import 'dotenv/config';
import { ClientWithCommands } from "../types/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const clientId = process.env.CLIENT_ID!;
const guildId = process.env.GUILD_ID!;


export const registerCommands = async (client: ClientWithCommands): Promise<void> => {
    client.commands = new Collection();
    client.cooldowns = new Collection();
    
    const commandFolders = readdirSync(join(__dirname, "..", "commands"), {
        withFileTypes: true,
    })
        .filter((folder) => folder.isDirectory())
        .map((dirent) => dirent.name);


    for (const folder of commandFolders) {
        const commandFiles = readdirSync(
            join(__dirname, "..", "commands", folder)
        ).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
        for (const file of commandFiles) {
            const filePath = join(__dirname, "..", "commands", folder, file);
            try {
                const {default: command} = await import(`file://${filePath}`);
                if (command && "data" in command && "execute" in command) {
                    client.commands.set(command.data.name, command);
                }
            } catch (error) {
                console.error(`[ERROR] Unable to load command ${filePath}: ${error}`);
            }
        }
    }
    const commands = client.commands.map((cmd) => cmd.data);
    const commandNames = client.commands.map((command) => command.data.name);
    try {
        console.log(
            `Found ${commands.length} command${commands.length === 1 ? "" : "s"}.`
        );
        console.log(`Commands: ${commandNames}`);
        const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            {body: commands}
        ) as unknown[];
        console.log(
            `Successfully reloaded ${data.length} application (/) command${
                data.length === 1 ? "" : "s"
            }.`
        );
    } catch (error) {
        console.error(error);
    }
};