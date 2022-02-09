const { SlashCommandBuilder } = require('@discordjs/builders');
const quickonline = require("quickonline"); // Requiring our package.

const server = {
  url: "https://nodejs-gy4hd8.chabk.ir/", // Our database URL for connecting.
  username: "quick", // Username credentials.
  password: "online", // Password credentials.
};

const db = new quickonline.bot(server);
const { MessageEmbed } = require('discord.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setlimit')
		.setDescription('set the bot limits')
		.addSubcommand(subcommand =>
			subcommand
				.setName('channel')
				.setDescription('Set Channel [Creation / Deletion / Update] Limit')
				.addStringOption(option => option.setName('limit_number').setDescription('Set Limit Number').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('role')
				.setDescription('Set Role [Creation / Deletion / Update] Limit')
				.addStringOption(option => option.setName('limit_number').setDescription('Set Limit Number').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('ban')
				.setDescription('Set [Ban / Kick] Limit')
				.addStringOption(option => option.setName('limit_number').setDescription('Set Limit Number').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('emoji')
				.setDescription('Set Emoji [add / remove] Limit')
				.addStringOption(option => option.setName('limit_number').setDescription('Set Limit Number').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('kick')
				.setDescription('Set Kick Limit')
				.addStringOption(option => option.setName('limit_number').setDescription('Set Limit Number').setRequired(true))),
	async execute(interaction) {
		let sub = interaction.options.getSubcommand()
		let owner = await interaction.guild.fetchOwner()
		if (interaction.user.id !== owner.id) {
			return await interaction.reply({content:'You Are Not guildOwner !', ephemeral: true })
		}
		const embed = new MessageEmbed()
			.setFooter('poki is the guardian of your community, so leave everything to poki', `https://images-ext-1.discordapp.net/external/aLN0kjPxYeguQOPxEoWKJzmXisvN6_tPjUS80r3CriE/https/cdn.discordapp.com/avatars/937941354942722128/32f10a55ef50b30fcd4c141dc4be5e69.webp`)
			.setThumbnail('https://images-ext-1.discordapp.net/external/aLN0kjPxYeguQOPxEoWKJzmXisvN6_tPjUS80r3CriE/https/cdn.discordapp.com/avatars/937941354942722128/32f10a55ef50b30fcd4c141dc4be5e69.webp')
			.setTitle('Your Server Setting Was Changed <a:safe:939359187182440510>')
			.setColor('#00ebff')

		if (sub == 'channel') {
			const limit = interaction.options.getString('limit_number')
			
			embed.setDescription(`Seted Channel [Creation / Deletion / Update] Limit to ${limit} ✅`)
			await interaction.reply({ content: `\`📩\``, embeds: [embed] });
			db.set(`${interaction.guild.id}_channelLimit`, `${limit}`)

		} else if (sub == 'role') {
			const limit = interaction.options.getString('limit_number')
			
			embed.setDescription(`Seted Role [Creation / Deletion / Update] Limit to ${limit} ✅`)
			await interaction.reply({ content: `\`📩\``, embeds: [embed] });
			db.set(`${interaction.guild.id}_roleLimit`, `${limit}`)



		} else if (sub == 'ban') {

			const limit = interaction.options.getString('limit_number')
			
			embed.setDescription(`Seted [Ban / Unban] Limit to ${limit} ✅`)
			await interaction.reply({ content: `\`📩\``, embeds: [embed] });
			db.set(`${interaction.guild.id}_banLimit`, `${limit}`)

		} else if (sub == 'kick') {

			const limit = interaction.options.getString('limit_number')
			
			embed.setDescription(`Seted Kick Limit to ${limit} ✅`)
			await interaction.reply({ content: `\`📩\``, embeds: [embed] });
			db.set(`${interaction.guild.id}_kickLimit`, `${limit}`)

		} else if (sub == 'emoji') {

			const limit = interaction.options.getString('limit_number')
			
			embed.setDescription(`Seted Emoji [add/remove] Limit to ${limit} ✅`)
			await interaction.reply({ content: `\`📩\``, embeds: [embed] });
			db.set(`${interaction.guild.id}_emojiLimit`, `${limit}`)

		}




	},
};
