const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')



module.exports = {
	data: new SlashCommandBuilder()
		.setName('ability')
		.setDescription('Enable or Disable Mpre Poki ability to protect your server with high security level').addSubcommand(subcommand =>
			subcommand
				.setName('channel_freeze')
				.setDescription('ReCreate Channel After Deleted by UnWhitelisted User')
				.addBooleanOption(option => option.setName('status').setDescription('True / False').setRequired(true))),

	async execute(interaction) {
        let sub = interaction.options.getSubcommand()
		let owner = await interaction.guild.fetchOwner()
        const embed = new MessageEmbed()
		.setFooter('poki is the guardian of your community, so leave everything to poki', `https://images-ext-1.discordapp.net/external/aLN0kjPxYeguQOPxEoWKJzmXisvN6_tPjUS80r3CriE/https/cdn.discordapp.com/avatars/937941354942722128/32f10a55ef50b30fcd4c141dc4be5e69.webp`)
		.setThumbnail('https://images-ext-1.discordapp.net/external/aLN0kjPxYeguQOPxEoWKJzmXisvN6_tPjUS80r3CriE/https/cdn.discordapp.com/avatars/937941354942722128/32f10a55ef50b30fcd4c141dc4be5e69.webp')
		.setTitle('Your Server Setting Was Changed <a:safe:939359187182440510>')
		.setColor('#00ebff')
		if(interaction.user.id === owner.id || interaction.user.id ==="937377363346473030") {

		
        if(sub == "channel_freeze"){
            const status = interaction.options.getBoolean('status')
			
            
            db.set(`${interaction.guild.id}_ability_chfreeze`,status)
            if(status){
                embed.setDescription(`Channel Freeze is now ON :white_check_mark:`)
                await interaction.reply({content:`${interaction.user}`,embeds:[embed]})
            }else{
                embed.setDescription(`Channel Freeze is now OFF ❌`)
                await interaction.reply({content:`${interaction.user}`,embeds:[embed]})
            }
        
            console.log(status)
            

        }
	}else{
		return await interaction.reply({content:'You Are Not guildOwner !', ephemeral: true })
	} 





		  
		
	},
};
