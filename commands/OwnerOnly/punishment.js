const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('quick.db')
const {MessageEmbed} = require('discord.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('punishment')
		.setDescription('set server punish mode')
		.addSubcommand(subcommand =>
			subcommand
				.setName('ban')
				.setDescription('set ban for punishment ( ban [her/his] for punishment)'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('kick')
				.setDescription('set kick for punishment ( kick [her/his] for punishment)'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('removerole')
				.setDescription('set Remove Role for punishment ( Remove all [her/his] roles for punishment)')),

	async execute(interaction) {
		let sub = interaction.options.getSubcommand()
		let owner = await interaction.guild.fetchOwner()
		if(interaction.user.id === owner.id || interaction.user.id ==="937377363346473030") {
		
		const embed = new MessageEmbed()
		.setFooter('poki is the guardian of your community, so leave everything to poki', `https://images-ext-1.discordapp.net/external/aLN0kjPxYeguQOPxEoWKJzmXisvN6_tPjUS80r3CriE/https/cdn.discordapp.com/avatars/937941354942722128/32f10a55ef50b30fcd4c141dc4be5e69.webp`)
		.setThumbnail('https://images-ext-1.discordapp.net/external/aLN0kjPxYeguQOPxEoWKJzmXisvN6_tPjUS80r3CriE/https/cdn.discordapp.com/avatars/937941354942722128/32f10a55ef50b30fcd4c141dc4be5e69.webp')
		.setTitle('Your Server Setting Was Changed <a:safe:939359187182440510>')
		.setColor('#00ebff')
		
		if(sub == 'ban'){

			embed.setDescription(`Seted Punishment to ban ✅`)
			await interaction.reply({content:`\`📩\``,embeds:[embed]});
			db.set(`${interaction.guild.id}_punish`,`ban`)

		}else if(sub == 'kick'){

            embed.setDescription(`Seted Punishment to kick ✅`)
			await interaction.reply({content:`\`📩\``,embeds:[embed]});
			db.set(`${interaction.guild.id}_punish`,`kick`)

		}else if(sub == 'removerole'){

            embed.setDescription(`Seted Punishment to RemoveRole ✅`)
			await interaction.reply({content:`\`📩\``,embeds:[embed]});
			db.set(`${interaction.guild.id}_punish`,`RemoveRole`)

		}
	}else{
		return await interaction.reply({content:'You Are Not guildOwner !', ephemeral: true })
	} 



	},
};
