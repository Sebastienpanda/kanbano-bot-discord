import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import { registerEvents } from "./helpers/register-events.js";

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: false,
    }
})

const bootstrap = async () => {
    await registerEvents(client);
    await client.login(process.env.DISCORD_TOKEN);
};

void bootstrap();