import { ActivityType, Events } from "discord.js";
import { registerCommands } from "../../helpers/register-commands.js";
import { ClientWithCommands } from "../../types/client.js";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: ClientWithCommands) {
        if (!client.user) return;
        console.log(`Bot connecté ${client.user.tag}`);
        client.user.setActivity("Kanbano", {
            type: ActivityType.Watching
        })
        try {
            await registerCommands(client)
        } catch (error) {
            console.log(error)
        }
    }
}