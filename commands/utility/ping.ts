import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    cooldown: 5,
    data: new SlashCommandBuilder().setName('ping').setDescription("Renvoie le ping du bot"),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply("Pong !")
    }
}