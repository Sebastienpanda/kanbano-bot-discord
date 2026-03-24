import { readdir } from "fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Client } from "discord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const eventsPath = join(__dirname, "..", "events");

export const registerEvents = async (client: Client): Promise<void> => {
    const eventFolders = await readdir(eventsPath, {withFileTypes: true});
    for (const folder of eventFolders) {
        if (!folder.isDirectory()) continue;
        const eventFiles = await readdir(join(eventsPath, folder.name));

        for (const file of eventFiles) {
            if (!file.endsWith(".js") && !file.endsWith(".ts")) continue;

            const eventPath = join(eventsPath, folder.name, file);
            const eventModule = await import(`file://${eventPath}`);
            const event = eventModule.default;
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
};