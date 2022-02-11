const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')



module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkup')
        .setDescription('The Poki analyzes the server and gives You an score between 1 to 10'),
    async execute(interaction) {
	    let owner = await interaction.guild.fetchOwner()
        if(interaction.user.id === owner.id || interaction.user.id ==="937377363346473030") {
		
        let roleprm = '';
        let unbots = '';
        let unwebs = '';
        let rolesco = 0
        let botsco = 0
        let websco = 0
        let totalsco = 10
        let embedse = []
        let pokiAppId = '941210071172534365'
        let pokiUserId = '940820484637982720'
        interaction.guild.roles.cache.forEach(role => {
            if (role.id == pokiAppId) return;
            if (role.permissions.serialize().ADMINISTRATOR || role.permissions.serialize().KICK_MEMBERS || role.permissions.serialize().BAN_MEMBERS || role.permissions.serialize().MANAGE_CHANNELS || role.permissions.serialize().MANAGE_GUILD || role.permissions.serialize().MENTION_EVERYONE || role.permissions.serialize().MANAGE_ROLES || role.permissions.serialize().MANAGE_WEBHOOKS || role.permissions.serialize().MODERATE_MEMBERS) {
                rolesco++

            }
            if (role.permissions.serialize().ADMINISTRATOR) {
                return roleprm = `${roleprm}${role} Have Administrator Permission And Have All dangerous permissions\n`
            }
            if (role.permissions.serialize().KICK_MEMBERS) {
                roleprm = `${roleprm}${role} Have Kick Permission And can kick members or prune members\n`
            }
            if (role.permissions.serialize().BAN_MEMBERS) {
                roleprm = `${roleprm}${role} Have Ban Permission And can ban members or unban them\n`
            }
            if (role.permissions.serialize().MANAGE_CHANNELS) {
                roleprm = `${roleprm}${role} Have Manage channels Permission And  Can [Update/Delete/Create] Channels\n`
            }
            if (role.permissions.serialize().MANAGE_GUILD) {
                roleprm = `${roleprm}${role} Have Manage server Permission And  Can Change server setting\n`
            }
            if (role.permissions.serialize().MENTION_EVERYONE) {
                roleprm = `${roleprm}${role} Have mention everyone  Permission And  Can Ping All Users\n`
            }
            if (role.permissions.serialize().MANAGE_ROLES) {
                roleprm = `${roleprm}${role} Have Manage Roles Permission And  And  Can [Update/Delete/Create] Roles\n`
            }
            if (role.permissions.serialize().MANAGE_WEBHOOKS) {
                roleprm = `${roleprm}${role} Have Manage Webhooks Permission And  And  Can [Update/Delete/Create] Webhooks\n`
            }
            if (role.permissions.serialize().MODERATE_MEMBERS) {
                roleprm = `${roleprm}${role} Have TimeOut/Moderate member permission and can time out members\n`
            }

        })
        interaction.guild.members.cache.filter(member => member.user.bot).forEach(m => {
            if (m.user.id == pokiUserId) return;
            if (m.user.flags) return;
            unbots = `${unbots} ${m}  `
            botsco++
        })
        let webhooks = await (interaction.guild.fetchWebhooks())
        webhooks.forEach(webhook => {
            unwebs = `${unwebs}${webhook.name} In <#${webhook.channelId}>\n`
            websco++

        })
        console.log(unwebs)

        const roleprmembed = new MessageEmbed()
            .setTitle('Role Dangerous Perms :')
            .setDescription(roleprm)

        const botprmembed = new MessageEmbed()
            .setTitle('UnVerified Bots :')
            .setDescription(unbots)

        const unUsedWebhooks = new MessageEmbed()
            .setTitle('Webhooks :')
            .setDescription(unwebs)

            if(rolesco > 0) totalsco -= 5
            if(botsco > 0) totalsco -= 3
            if(websco > 0) totalsco -= 2
            console.log(totalsco)
        if(roleprm !== '') embedse.push(roleprmembed)
        if(unbots !== '') embedse.push(botprmembed)
        if(unwebs !== '') embedse.push(unUsedWebhooks)
        embedse.join(',')
        
        if(totalsco < 10){
            interaction.reply({ content: `\`📩 Your Score Is ${totalsco}\``, embeds: embedse })
        }else if(totalsco == 10){
            interaction.reply({ content: `\`📩 Your Score Is ${totalsco}\` And No Problem was Found`, embeds: embedse })
        }

    }else{
        return await interaction.reply({content:'You Are Not guildOwner !', ephemeral: true })
    } 




    },
};
