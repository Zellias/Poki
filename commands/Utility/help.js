const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed,MessageActionRow, MessageSelectMenu} = require('discord.js')



module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Show All Command\'s'),
	async execute(interaction) {

		
		
	
		const row = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId('select')
				.setPlaceholder('Nothing selected')
				.addOptions([
					{
						label: 'Abilities',
						description: 'Bot abilities are options can help your server be more secure than before !',
						value: 'one_main',
						emoji:'941682848467918888',
					},
					{
						label: 'Limit',
						description: 'With limit option you can track all dangerous activity and defend them !',
						value: 'two_main',
						emoji:'941682992198336542',
					},
					{
						label: 'Punishment',
						description: 'With this option you can set punishment for who reach Limits',
						value: 'three_main',
						emoji:'941683129582776351',
					},
					{
						label: '2 Factor',
						description: 'Wanna add Moderator? You need first active this option to add bot moderator  !',
						value: 'four_main',
						emoji:'941683196280586241',
					},
					{
						label: 'Whitelist',
						description: 'Add your trusted users to your server whitelist',
						value: 'five_main',
						emoji:'941683269324394526',
					},
					
				]),
		);
		const embed = new MessageEmbed()
		.setColor('#fff2f2')
		.setTitle('PoKi Options <:exclamation:941682171838595103>')
		.setDescription(`
		> <:White_1:941682848467918888> **Abilities**
 <:shield:941681612159062026> Bot abilities are options can help your server be more secure than before !
> <:White_2:941682992198336542> **Limit**
 <:shield:941681612159062026> With limit option you can track all dangerous activity and defend them !
> <:White_3:941683129582776351> **Punishment**
 <:shield:941681612159062026> With this option you can set punishment for who reach **Limit**s
> <:White_4:941683196280586241> **2 Factor**
<:shield:941681612159062026> Wanna add Moderator? You need first active this option to add bot moderator  !
> <:White_5:941683269324394526> **Whitelist**
<:shield:941681612159062026> Add your trusted users to your server whitelist
		`);
		

		
	await interaction.reply({ ephemeral:true, embeds: [embed], components: [row] });

		  
		
	},
};
