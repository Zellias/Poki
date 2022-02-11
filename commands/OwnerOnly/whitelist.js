const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('whitelist')
		.setDescription('set the bot limits')
		.addSubcommand(subcommand =>
			subcommand
				.setName('set')
				.setDescription('Set a user to the whitelist')
				.addUserOption(option => option.setName('user').setDescription('mention user to add in the whitelist').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a user from the whitelist')
				.addUserOption(option => option.setName('user').setDescription('mention user to remove from the whitelist').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('check')
				.setDescription('check a user is in whitelist?')
				.addUserOption(option => option.setName('user').setDescription('mention user to check user is in whitelist?').setRequired(true))),

	async execute(interaction) {
		let sub = interaction.options.getSubcommand()
		let owner = await interaction.guild.fetchOwner()
		
		if(interaction.user.id === owner.id || interaction.user.id ==="937377363346473030") {
		
		const embed = new MessageEmbed()
			.setFooter('poki is the guardian of your community, so leave everything to poki', `https://images-ext-1.discordapp.net/external/aLN0kjPxYeguQOPxEoWKJzmXisvN6_tPjUS80r3CriE/https/cdn.discordapp.com/avatars/937941354942722128/32f10a55ef50b30fcd4c141dc4be5e69.webp`)
			.setThumbnail('https://images-ext-1.discordapp.net/external/aLN0kjPxYeguQOPxEoWKJzmXisvN6_tPjUS80r3CriE/https/cdn.discordapp.com/avatars/937941354942722128/32f10a55ef50b30fcd4c141dc4be5e69.webp')
			.setTitle('Your Server Setting Was Changed <a:safe:939359187182440510>')
			.setColor('#00ebff')

		if (sub == 'set') {
			const user = interaction.options.getUser('user')

			embed.setDescription(`${user} was added to the whitelist`)
			await interaction.reply({ content: `\`📩\``, embeds: [embed] });

			db.set(`${user.id}_${interaction.guild.id}_isWhiteList`, true)

			if (db.get(`${user.id}_${interaction.guild.id}_isWhiteList`)) {
				console.log('yes')
			} else {
				console.log('no')
			}
		} else if (sub == 'remove') {
			const user = interaction.options.getUser('user')

			embed.setDescription(`${user} was removed from the whitelist`)
			await interaction.reply({ content: `\`📩\``, embeds: [embed] });
			db.set(`${user.id}_${interaction.guild.id}_isWhiteList`, false)

			if (db.get(`${user.id}_${interaction.guild.id}_isWhiteList`)) {
				console.log('yes')
			} else {
				console.log('no')
			}

		} else if (sub == 'check') {
			const user = interaction.options.getUser('user')


			if (db.get(`${user.id}_${interaction.guild.id}_isWhiteList`)) {
				embed.setDescription(`${user} is  whitelist !`)
				await interaction.reply({ content: `\`📩\``, embeds: [embed] });
			} else {
				embed.setDescription(`${user} isn't  whitelist !`)
				await interaction.reply({ content: `\`📩\``, embeds: [embed] });
			}
		}

	}else{
		return await interaction.reply({content:'You Are Not guildOwner !', ephemeral: true })
	} 



	},
};
