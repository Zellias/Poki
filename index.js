const { Client, Intents, Collection, Permissions, MessageEmbed } = require("discord.js");
const fs = require("fs");

const allIntents = new Intents(32767);
const client = new Client({ intents: new Intents(32767), partials: ["GUILD_MEMBER"] });
const { token } = require("./data.json")
const { register } = require('./register')
const quickonline = require("quickonline"); // Requiring our package.
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
const server = {
  url: "https://nodejs-gy4hd8.chabk.ir/", // Our database URL for connecting.
  username: "quick", // Username credentials.
  password: "online", // Password credentials.
};

const db = new quickonline.bot(server);
client.login(token)
const http = require('http')
//register()
client.commands = new Collection();

 
const commandFolders = fs.readdirSync('./commands')
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}/`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
        console.log(`Loaded ${file} from ${folder}`)
    }
}
client.on('guildCreate', async function (guild) {
    const channel = client.guilds.channels.cache.get('940763198552932373')
    const embed = new MessageEmbed()
     .setTitle(`Bot Added to ${guild.name} Server`)
    .setThumbnail(guild.icon)
    .addField(`Members :`,`${guild.memberCount}`)

})
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }

});
client.on('ready', () => {
    client.user.setPresence({ activities: [{ name: 'Watching Users Action ⚠️' }] });
})
client.on("channelCreate", async function (channel) {
    let limit = db.get(`${channel.guild.id}_channelLimit`)
    if (!limit) {
        return;
    }

    if (!channel.guild) return;

    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_CREATE',
    });

    const deletionLog = fetchedLogs.entries.first();


    if (!deletionLog) return console.log(`Not Found`);

    const { executor } = deletionLog;
    if (executor.id == client.user.id) return console.log(`bot is whitelist`)
    console.log(`channel ${channel.name} Created by ${executor.tag}.`);
    db.add(`${executor.id}_${channel.guild.id}_channelLimit`, 1)
    let userLimit = db.get(`${executor.id}_${channel.guild.id}_channelLimit`)
    console.log(db.get(`${executor.id}_${channel.guild.id}_channelLimit`))
    if (limit == userLimit) {
        db.set(`${executor.id}_${channel.guild.id}_channelLimit`, 0)

        if (db.get(`${executor.id}_${channel.guild.id}_isWhiteList`) || executor.id == (await channel.guild.fetchOwner()).id) {
            return console.log('in whitelist');
        } else {
            let punish = db.get(`${channel.guild.id}_punish`)
            if (!punish) return;
            if (punish === 'ban') {

                channel.guild.members.ban(executor.id).then().catch(err => { })
                await channel.guild.bans.fetch(executor).then(async un => {
                    const owner = client.users.cache.get((await channel.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                        **Hello ${channel.guild.name} Owner <a:crown:939352514455797881> ,**
                        ${executor.tag} Was Created ${limit} Channel's And i punished Him !
                        `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                        **Hello ${channel.guild.name} Owner <a:crown:939352514455797881> ,**
                        ${executor.tag} Was Created ${limit} Channel's ,and I don't have permissions and I can't punish  ${executor.tag}
                        `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await channel.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                });

            } else if (punish === 'kick') {
                channel.guild.members.kick(executor.id).then(async eu => {
                    const owner = client.users.cache.get((await channel.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                        **Hello ${channel.guild.name} Owner <a:crown:939352514455797881> ,**
                        ${executor.tag} Was Created ${limit} Channel's And i punished Him !
                        `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                    **Hello ${channel.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Created ${limit} Channel's ,and I don't have permissions and I can't punish  ${executor.tag}
                    `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await channel.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                })


            } else if (punish === 'RemoveRole') {
                channel.guild.roles.cache.forEach(async role => {
                    if (role.members.get(executor.id)) {
                        console.log(`+ ${role.name}`)
                        if (role.id !== channel.guild.id) {
                            const guild = client.guilds.cache.get(channel.guild.id);
                            const roled = channel.guild.roles.cache.get(role.id);
                            const member = await guild.members.fetch(executor.id);

                            console.log(executor.id)
                            member.roles.remove(roled).then(async eu => {
                                const owner = client.users.cache.get((await channel.guild.fetchOwner()).user.id)
                                const embed = new MessageEmbed()
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                                    .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                                    .setDescription(`
                                    **Hello ${channel.guild.name} Owner <a:crown:939352514455797881> ,**
                                    ${executor.tag} Was Created ${limit} Channel's And i punished Him !
                                    `)
                                    .setColor('#00ebff')
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                            }).catch(async err => {
                                const embed = new MessageEmbed()
                                    .setColor('ffff00')
                                    .setDescription(`
                                **Hello ${channel.guild.name} Owner <a:crown:939352514455797881> ,**
                                ${executor.tag} Was Created ${limit} Channel's ,and I don't have permissions and I can't punish  ${executor.tag}
                                `)
                                    .setTitle('Alert  <:Alert:939351669341323264> ')
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                const owner = client.users.cache.get((await channel.guild.fetchOwner()).user.id)
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                            })
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                })


            }



        }

    }
});
client.on("channelDelete", async function (channel) {
    let limit = db.get(`${channel.guild.id}_channelLimit`)
    if (!limit) {
        return;
    }

    if (!channel.guild) return;

    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_DELETE',
    });

    const deletionLog = fetchedLogs.entries.first();


    if (!deletionLog) return console.log(`Not Found`);

    const { executor } = deletionLog;
    if (executor.id == client.user.id) return console.log(`bot is whitelist`)
    console.log(`channel ${channel.name} Deleted by ${executor.tag}.`);
    db.add(`${executor.id}_${channel.guild.id}_channelLimit`, 1)
    let userLimit = db.get(`${executor.id}_${channel.guild.id}_channelLimit`)
    console.log(db.get(`${executor.id}_${channel.guild.id}_channelLimit`))
    if (limit == userLimit) {
        db.set(`${executor.id}_${channel.guild.id}_channelLimit`, 0)
        if (db.get(`${executor.id}_${channel.guild.id}_isWhiteList`) || executor.id == (await channel.guild.fetchOwner()).id) {
            return console.log('in whitelist');
        } else {
            let punish = db.get(`${channel.guild.id}_punish`)
            if (!punish) return;
            if (punish === 'ban') {

                channel.guild.members.ban(executor.id).then().catch(err => { })
                await channel.guild.bans.fetch(executor).then(async un => {
                    const owner = client.users.cache.get((await channel.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                        **Hello ${channel.guild.name} Owner <a:crown:939352514455797881> ,**
                        ${executor.tag} Was Deleted ${limit} Channel's And i punished Him !
                        `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                        **Hello ${channel.guild.name} Owner <a:crown:939352514455797881> ,**
                        ${executor.tag} Was Deleted ${limit} Channel's ,and I don't have permissions and I can't punish  ${executor.tag}
                        `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await channel.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                });

            } else if (punish === 'kick') {
                channel.guild.members.kick(executor.id).then(async eu => {
                    const owner = client.users.cache.get((await channel.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                        **Hello ${channel.guild.name} Owner <a:crown:939352514455797881> ,**
                        ${executor.tag} Was Deleted ${limit} Channel's And i punished Him !
                        `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                    **Hello ${channel.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Deleted ${limit} Channel's ,and I don't have permissions and I can't punish  ${executor.tag}
                    `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await channel.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                })


            } else if (punish === 'RemoveRole') {
                channel.guild.roles.cache.forEach(async role => {
                    if (role.members.get(executor.id)) {
                        console.log(`+ ${role.name}`)
                        if (role.id !== channel.guild.id) {
                            const guild = client.guilds.cache.get(channel.guild.id);
                            const roled = channel.guild.roles.cache.get(role.id);
                            const member = await guild.members.fetch(executor.id);

                            console.log(executor.id)
                            member.roles.remove(roled).then(async eu => {
                                const owner = client.users.cache.get((await channel.guild.fetchOwner()).user.id)
                                const embed = new MessageEmbed()
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                                    .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                                    .setDescription(`
                                    **Hello ${channel.guild.name} Owner <a:crown:939352514455797881> ,**
                                    ${executor.tag} Was Deleted ${limit} Channel's And i punished Him !
                                    `)
                                    .setColor('#00ebff')
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                            }).catch(async err => {
                                const embed = new MessageEmbed()
                                    .setColor('ffff00')
                                    .setDescription(`
                                **Hello ${channel.guild.name} Owner <a:crown:939352514455797881> ,**
                                ${executor.tag} Was Deleted ${limit} Channel's ,and I don't have permissions and I can't punish  ${executor.tag}
                                `)
                                    .setTitle('Alert  <:Alert:939351669341323264> ')
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                const owner = client.users.cache.get((await channel.guild.fetchOwner()).user.id)
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                            })
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                })


            }



        }

    }



});
client.on("roleDelete", async function (role) {
    let limit = db.get(`${role.guild.id}_roleLimit`)
    if (!limit) {
        return;
    }

    if (!role.guild) return;

    const fetchedLogs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: 'ROLE_DELETE',
    });

    const deletionLog = fetchedLogs.entries.first();


    if (!deletionLog) return console.log(`Not Found`);

    const { executor } = deletionLog;
    if (executor.id == client.user.id) return console.log(`bot is whitelist`)
    console.log(`Role ${role.name} Deleted by ${executor.tag}.`);
    db.add(`${executor.id}_${role.guild.id}_roleLimit`, 1)
    let userLimit = db.get(`${executor.id}_${role.guild.id}_roleLimit`)
    console.log(db.get(`${executor.id}_${role.guild.id}_roleLimit`))
    if (limit == userLimit) {
        db.set(`${executor.id}_${role.guild.id}_roleLimit`, 0)
        if (db.get(`${executor.id}_${role.guild.id}_isWhiteList`) || executor.id == (await role.guild.fetchOwner()).id) {
            return console.log('in whitelist');
        } else {
            let punish = db.get(`${role.guild.id}_punish`)
            if (!punish) return;
            if (punish === 'ban') {

                role.guild.members.ban(executor.id).then().catch(err => { })
                await role.guild.bans.fetch(executor).then(async un => {
                    const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                    **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Deleted ${limit} Roles And i punished Him !
                    `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                    **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Deleted ${limit} Roles ,and I don't have permissions and I can't punish  ${executor.tag}
                    `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                });

            } else if (punish === 'kick') {
                role.guild.members.kick(executor.id).then(async eu => {
                    const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                    **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Deleted ${limit} Roles And i punished Him !
                    `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                ${executor.tag} Was Deleted ${limit} Roles ,and I don't have permissions and I can't punish  ${executor.tag}
                `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                })


            } else if (punish === 'RemoveRole') {
                role.guild.roles.cache.forEach(async role => {
                    if (role.members.get(executor.id)) {
                        console.log(`+ ${role.name}`)
                        if (role.id !== role.guild.id) {
                            const guild = client.guilds.cache.get(role.guild.id);
                            const roled = role.guild.roles.cache.get(role.id);
                            const member = await guild.members.fetch(executor.id);

                            console.log(executor.id)
                            member.roles.remove(roled).then(async eu => {
                                const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                                const embed = new MessageEmbed()
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                                    .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                                    .setDescription(`
                                **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                                ${executor.tag} Was Deleted ${limit} Roles And i punished Him !
                                `)
                                    .setColor('#00ebff')
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                            }).catch(async err => {
                                const embed = new MessageEmbed()
                                    .setColor('ffff00')
                                    .setDescription(`
                            **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                            ${executor.tag} Was Deleted ${limit} Roles ,and I don't have permissions and I can't punish  ${executor.tag}
                            `)
                                    .setTitle('Alert  <:Alert:939351669341323264> ')
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                            })
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                })


            }



        }

    }
});
client.on("roleCreate", async function (role) {
    let limit = db.get(`${role.guild.id}_roleLimit`)
    if (!limit) {
        return;
    }

    if (!role.guild) return;

    const fetchedLogs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: 'ROLE_CREATE',
    });

    const deletionLog = fetchedLogs.entries.first();


    if (!deletionLog) return console.log(`Not Found`);

    const { executor } = deletionLog;
    if (executor.id == client.user.id) return console.log(`bot is whitelist`)
    console.log(`Role ${role.name} Created by ${executor.tag}.`);
    db.add(`${executor.id}_${role.guild.id}_roleLimit`, 1)
    let userLimit = db.get(`${executor.id}_${role.guild.id}_roleLimit`)
    console.log(db.get(`${executor.id}_${role.guild.id}_roleLimit`))
    if (limit == userLimit) {
        db.set(`${executor.id}_${role.guild.id}_roleLimit`, 0)
        if (db.get(`${executor.id}_${role.guild.id}_isWhiteList`) || executor.id == (await role.guild.fetchOwner()).id) {
            return console.log('in whitelist');
        } else {
            let punish = db.get(`${role.guild.id}_punish`)
            if (!punish) return;
            if (punish === 'ban') {

                role.guild.members.ban(executor.id).then().catch(err => { })
                await role.guild.bans.fetch(executor).then(async un => {
                    const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                        **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                        ${executor.tag} Was Created ${limit} Roles And i punished Him !
                        `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                        **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                        ${executor.tag} Was Created ${limit} Roles ,and I don't have permissions and I can't punish  ${executor.tag}
                        `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                });

            } else if (punish === 'kick') {
                role.guild.members.kick(executor.id).then(async eu => {
                    const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                        **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                        ${executor.tag} Was Created ${limit} Roles And i punished Him !
                        `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                    **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Created ${limit} Roles ,and I don't have permissions and I can't punish  ${executor.tag}
                    `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                })


            } else if (punish === 'RemoveRole') {
                role.guild.roles.cache.forEach(async role => {
                    if (role.members.get(executor.id)) {
                        console.log(`+ ${role.name}`)
                        if (role.id !== role.guild.id) {
                            const guild = client.guilds.cache.get(role.guild.id);
                            const roled = role.guild.roles.cache.get(role.id);
                            const member = await guild.members.fetch(executor.id);

                            console.log(executor.id)
                            member.roles.remove(roled).then(async eu => {
                                const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                                const embed = new MessageEmbed()
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                                    .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                                    .setDescription(`
                                    **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                                    ${executor.tag} Was Created ${limit} Roles And i punished Him !
                                    `)
                                    .setColor('#00ebff')
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                            }).catch(async err => {
                                const embed = new MessageEmbed()
                                    .setColor('ffff00')
                                    .setDescription(`
                                **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                                ${executor.tag} Was Created ${limit} Roles ,and I don't have permissions and I can't punish  ${executor.tag}
                                `)
                                    .setTitle('Alert  <:Alert:939351669341323264> ')
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                            })
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                })


            }



        }

    }
});
client.on("emojiCreate", async function (emoji) {
    let limit = db.get(`${emoji.guild.id}_emojiLimit`)
    if (!limit) {
        return;
    }
    if (!emoji.guild) return;

    const fetchedLogs = await emoji.guild.fetchAuditLogs({
        limit: 1,
        type: 'EMOJI_CREATE',
    });

    const deletionLog = fetchedLogs.entries.first();


    if (!deletionLog) return console.log(`Not Found`);

    const { executor } = deletionLog;
    if (executor.id == client.user.id) return console.log(`bot is whitelist`)
    console.log(`Emoji ${emoji.name} Created by ${executor.tag}.`);
    db.add(`${executor.id}_${emoji.guild.id}_emojiLimit`, 1)
    let userLimit = db.get(`${executor.id}_${emoji.guild.id}_emojiLimit`)
    console.log(db.get(`${executor.id}_${emoji.guild.id}_emojiLimit`))
    if (limit == userLimit) {
        db.set(`${executor.id}_${emoji.guild.id}_emojiLimit`, 0)
        if (db.get(`${executor.id}_${emoji.guild.id}_isWhiteList`) || executor.id == (await emoji.guild.fetchOwner()).id) {
            return console.log('in whitelist');
        } else {
            let punish = db.get(`${emoji.guild.id}_punish`)
            if (!punish) return;
            if (punish === 'ban') {

                emoji.guild.members.ban(executor.id).then().catch(err => { })
                await emoji.guild.bans.fetch(executor).then(async un => {
                    const owner = client.users.cache.get((await emoji.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                    **Hello ${emoji.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Added ${limit} Emoji And i punished Him !
                    `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                    **Hello ${emoji.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Added ${limit} Emoji ,and I don't have permissions and I can't punish  ${executor.tag}
                    `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await emoji.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                });

            } else if (punish === 'kick') {
                emoji.guild.members.kick(executor.id).then(async eu => {
                    const owner = client.users.cache.get((await emoji.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                    **Hello ${emoji.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Added ${limit} Emoji And i punished Him !
                    `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                **Hello ${emoji.guild.name} Owner <a:crown:939352514455797881> ,**
                ${executor.tag} Was Added ${limit} Emoji ,and I don't have permissions and I can't punish  ${executor.tag}
                `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await emoji.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                })


            } else if (punish === 'RemoveRole') {
                emoji.guild.roles.cache.forEach(async role => {
                    if (emoji.members.get(executor.id)) {
                        console.log(`+ ${emoji.name}`)
                        if (emoji.id !== emoji.guild.id) {
                            const guild = client.guilds.cache.get(emoji.guild.id);
                            const roled = emoji.guild.roles.cache.get(emoji.id);
                            const member = await guild.members.fetch(executor.id);

                            console.log(executor.id)
                            member.roles.remove(roled).then(async eu => {
                                const owner = client.users.cache.get((await emoji.guild.fetchOwner()).user.id)
                                const embed = new MessageEmbed()
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                                    .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                                    .setDescription(`
                                **Hello ${emoji.guild.name} Owner <a:crown:939352514455797881> ,**
                                ${executor.tag} Was Added ${limit} Emoji And i punished Him !
                                `)
                                    .setColor('#00ebff')
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                            }).catch(async err => {
                                const embed = new MessageEmbed()
                                    .setColor('ffff00')
                                    .setDescription(`
                            **Hello ${emoji.guild.name} Owner <a:crown:939352514455797881> ,**
                            ${executor.tag} Was Added ${limit} Emoji ,and I don't have permissions and I can't punish  ${executor.tag}
                            `)
                                    .setTitle('Alert  <:Alert:939351669341323264> ')
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                const owner = client.users.cache.get((await emoji.guild.fetchOwner()).user.id)
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                            })
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                })


            }



        }

    }

});
client.on("emojiDelete", async function (emoji) {
    let limit = db.get(`${emoji.guild.id}_emojiLimit`)
    if (!limit) {
        return;
    }
    if (!emoji.guild) return;

    const fetchedLogs = await emoji.guild.fetchAuditLogs({
        limit: 1,
        type: 'EMOJI_DELETE',
    });

    const deletionLog = fetchedLogs.entries.first();


    if (!deletionLog) return console.log(`Not Found`);

    const { executor } = deletionLog;
    if (executor.id == client.user.id) return console.log(`bot is whitelist`)
    console.log(`Emoji ${emoji.name} Deleted by ${executor.tag}.`);
    db.add(`${executor.id}_${emoji.guild.id}_emojiLimit`, 1)
    let userLimit = db.get(`${executor.id}_${emoji.guild.id}_emojiLimit`)
    console.log(db.get(`${executor.id}_${emoji.guild.id}_emojiLimit`))
    if (limit == userLimit) {
        db.set(`${executor.id}_${emoji.guild.id}_emojiLimit`, 0)
        if (db.get(`${executor.id}_${emoji.guild.id}_isWhiteList`) || executor.id == (await emoji.guild.fetchOwner()).id) {
            return console.log('in whitelist');
        } else {
            let punish = db.get(`${emoji.guild.id}_punish`)
            if (!punish) return;
            if (punish === 'ban') {

                emoji.guild.members.ban(executor.id).then().catch(err => { })
                await emoji.guild.bans.fetch(executor).then(async un => {
                    const owner = client.users.cache.get((await emoji.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                    **Hello ${emoji.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Removed ${limit} Emoji And i punished Him !
                    `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                    **Hello ${emoji.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Removed ${limit} Emoji ,and I don't have permissions and I can't punish  ${executor.tag}
                    `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await emoji.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                });

            } else if (punish === 'kick') {
                emoji.guild.members.kick(executor.id).then(async eu => {
                    const owner = client.users.cache.get((await emoji.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                    **Hello ${emoji.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Removed ${limit} Emoji And i punished Him !
                    `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                **Hello ${emoji.guild.name} Owner <a:crown:939352514455797881> ,**
                ${executor.tag} Was Removed ${limit} Emoji ,and I don't have permissions and I can't punish  ${executor.tag}
                `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await emoji.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                })


            } else if (punish === 'RemoveRole') {
                emoji.guild.roles.cache.forEach(async role => {
                    if (emoji.members.get(executor.id)) {
                        console.log(`+ ${emoji.name}`)
                        if (emoji.id !== emoji.guild.id) {
                            const guild = client.guilds.cache.get(emoji.guild.id);
                            const roled = emoji.guild.roles.cache.get(emoji.id);
                            const member = await guild.members.fetch(executor.id);

                            console.log(executor.id)
                            member.roles.remove(roled).then(async eu => {
                                const owner = client.users.cache.get((await emoji.guild.fetchOwner()).user.id)
                                const embed = new MessageEmbed()
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                                    .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                                    .setDescription(`
                                **Hello ${emoji.guild.name} Owner <a:crown:939352514455797881> ,**
                                ${executor.tag} Was Removed ${limit} Emoji And i punished Him !
                                `)
                                    .setColor('#00ebff')
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                            }).catch(async err => {
                                const embed = new MessageEmbed()
                                    .setColor('ffff00')
                                    .setDescription(`
                            **Hello ${emoji.guild.name} Owner <a:crown:939352514455797881> ,**
                            ${executor.tag} Was Removed ${limit} Emoji ,and I don't have permissions and I can't punish  ${executor.tag}
                            `)
                                    .setTitle('Alert  <:Alert:939351669341323264> ')
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                const owner = client.users.cache.get((await emoji.guild.fetchOwner()).user.id)
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                            })
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                })


            }



        }

    }

});
client.on('guildMemberRemove', async member => {
    let limit = db.get(`${member.guild.id}_kickLimit`)
    if (!limit) {
        return;
    }
    const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_KICK',
    });

    const kickLog = fetchedLogs.entries.first();

    if (!kickLog) return console.log(`${member.user.tag} left the guild, most likely of their own will.`);


    const { executor, target } = kickLog;


    if (target.id === member.id) {
        console.log(`${member.user.tag} left the guild; kicked by ${executor.tag}?`);


        db.add(`${executor.id}_${member.guild.id}_kickLimit`, 1)
        let userLimit = db.get(`${executor.id}_${member.guild.id}_kickLimit`)
        console.log(db.get(`${executor.id}_${member.guild.id}_kickLimit`))
        if (limit == userLimit) {
            db.set(`${executor.id}_${member.guild.id}_kickLimit`, 0)
            if (db.get(`${executor.id}_${member.guild.id}_isWhiteList`) || executor.id == (await member.guild.fetchOwner()).id) {
                return console.log('in whitelist');
            } else {
                let punish = db.get(`${member.guild.id}_punish`)
                if (!punish) return;
                if (punish === 'ban') {

                    member.guild.members.ban(executor.id).then().catch(err => { })
                    await member.guild.bans.fetch(executor).then(async un => {
                        const owner = client.users.cache.get((await member.guild.fetchOwner()).user.id)
                        const embed = new MessageEmbed()
                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                            .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                            .setDescription(`
                            **Hello ${member.guild.name} Owner <a:crown:939352514455797881> ,**
                            ${executor.tag} Was Kicked ${limit} User And i punished Him !
                            `)
                            .setColor('#00ebff')
                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                    }).catch(async err => {
                        const embed = new MessageEmbed()
                            .setColor('ffff00')
                            .setDescription(`
                            **Hello ${member.guild.name} Owner <a:crown:939352514455797881> ,**
                            ${executor.tag} Was Kicked ${limit} User ,and I don't have permissions and I can't punish  ${executor.tag}
                            `)
                            .setTitle('Alert  <:Alert:939351669341323264> ')
                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        const owner = client.users.cache.get((await member.guild.fetchOwner()).user.id)
                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                    });

                } else if (punish === 'kick') {
                    member.guild.members.kick(executor.id).then(async eu => {
                        const owner = client.users.cache.get((await member.guild.fetchOwner()).user.id)
                        const embed = new MessageEmbed()
                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                            .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                            .setDescription(`
                            **Hello ${member.guild.name} Owner <a:crown:939352514455797881> ,**
                            ${executor.tag} Was Kicked ${limit} User And i punished Him !
                            `)
                            .setColor('#00ebff')
                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                    }).catch(async err => {
                        const embed = new MessageEmbed()
                            .setColor('ffff00')
                            .setDescription(`
                        **Hello ${member.guild.name} Owner <a:crown:939352514455797881> ,**
                        ${executor.tag} Was Kicked ${limit} User ,and I don't have permissions and I can't punish  ${executor.tag}
                        `)
                            .setTitle('Alert  <:Alert:939351669341323264> ')
                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        const owner = client.users.cache.get((await member.guild.fetchOwner()).user.id)
                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                    })


                } else if (punish === 'RemoveRole') {
                    member.guild.roles.cache.forEach(async role => {
                        if (member.members.get(executor.id)) {
                            console.log(`+ ${member.name}`)
                            if (member.id !== member.guild.id) {
                                const guild = client.guilds.cache.get(member.guild.id);
                                const roled = member.guild.roles.cache.get(member.id);
                                const member = await guild.members.fetch(executor.id);

                                console.log(executor.id)
                                member.roles.remove(roled).then(async eu => {
                                    const owner = client.users.cache.get((await member.guild.fetchOwner()).user.id)
                                    const embed = new MessageEmbed()
                                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                                        .setDescription(`
                                        **Hello ${member.guild.name} Owner <a:crown:939352514455797881> ,**
                                        ${executor.tag} Was Kicked ${limit} User And i punished Him !
                                        `)
                                        .setColor('#00ebff')
                                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                                }).catch(async err => {
                                    const embed = new MessageEmbed()
                                        .setColor('ffff00')
                                        .setDescription(`
                                    **Hello ${member.guild.name} Owner <a:crown:939352514455797881> ,**
                                    ${executor.tag} Was Kicked ${limit} User ,and I don't have permissions and I can't punish  ${executor.tag}
                                    `)
                                        .setTitle('Alert  <:Alert:939351669341323264> ')
                                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                    const owner = client.users.cache.get((await member.guild.fetchOwner()).user.id)
                                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                                })
                            } else {
                                return;
                            }
                        } else {
                            return;
                        }
                    })


                }



            }

        }
    } else {
        return;
    }
});
client.on('guildBanAdd', async ban => {
    let limit = db.get(`${ban.guild.id}_banLimit`)
    if (!limit) {
        return;
    }
    const fetchedLogs = await ban.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_BAN_ADD',
    });

    const banLog = fetchedLogs.entries.first();


    if (!banLog) return console.log(`${ban.user.tag} was banned from ${ban.guild.name} but no audit log could be found.`);


    const { executor, target } = banLog;


    if (target.id === ban.user.id) {

        db.add(`${executor.id}_${ban.guild.id}_banLimit`, 1)
        let userLimit = db.get(`${executor.id}_${ban.guild.id}_banLimit`)
        console.log(db.get(`${executor.id}_${ban.guild.id}_banLimit`))
        if (limit == userLimit) {
            db.set(`${executor.id}_${ban.guild.id}_banLimit`, 0)
            if (db.get(`${executor.id}_${ban.guild.id}_isWhiteList`) || executor.id == (await ban.guild.fetchOwner()).id) {
                return console.log('in whitelist');
            } else {
                let punish = db.get(`${ban.guild.id}_punish`)
                if (!punish) return;
                if (punish === 'ban') {

                    ban.guild.members.ban(executor.id).then().catch(err => { })
                    await ban.guild.bans.fetch(executor).then(async un => {
                        const owner = client.users.cache.get((await ban.guild.fetchOwner()).user.id)
                        const embed = new MessageEmbed()
                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                            .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                            .setDescription(`
                            **Hello ${ban.guild.name} Owner <a:crown:939352514455797881> ,**
                            ${executor.tag} Was Banned ${limit} User And i punished Him !
                            `)
                            .setColor('#00ebff')
                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                    }).catch(async err => {
                        const embed = new MessageEmbed()
                            .setColor('ffff00')
                            .setDescription(`
                            **Hello ${ban.guild.name} Owner <a:crown:939352514455797881> ,**
                            ${executor.tag} Was Banned ${limit} User ,and I don't have permissions and I can't punish  ${executor.tag}
                            `)
                            .setTitle('Alert  <:Alert:939351669341323264> ')
                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        const owner = client.users.cache.get((await ban.guild.fetchOwner()).user.id)
                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                    });

                } else if (punish === 'kick') {
                    ban.guild.members.kick(executor.id).then(async eu => {
                        const owner = client.users.cache.get((await ban.guild.fetchOwner()).user.id)
                        const embed = new MessageEmbed()
                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                            .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                            .setDescription(`
                            **Hello ${ban.guild.name} Owner <a:crown:939352514455797881> ,**
                            ${executor.tag} Was Banned ${limit} User And i punished Him !
                            `)
                            .setColor('#00ebff')
                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                    }).catch(async err => {
                        const embed = new MessageEmbed()
                            .setColor('ffff00')
                            .setDescription(`
                        **Hello ${ban.guild.name} Owner <a:crown:939352514455797881> ,**
                        ${executor.tag} Was Banned ${limit} User ,and I don't have permissions and I can't punish  ${executor.tag}
                        `)
                            .setTitle('Alert  <:Alert:939351669341323264> ')
                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        const owner = client.users.cache.get((await ban.guild.fetchOwner()).user.id)
                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                    })


                } else if (punish === 'RemoveRole') {
                    ban.guild.roles.cache.forEach(async role => {
                        if (role.members.get(executor.id)) {
                            console.log(`+ ${role.name}`)
                            if (role.id !== ban.guild.id) {
                                const guild = client.guilds.cache.get(ban.guild.id);
                                const roled = ban.guild.roles.cache.get(role.id);
                                const member = await guild.members.fetch(executor.id);

                                console.log(executor.id)
                                member.roles.remove(roled).then(async eu => {
                                    const owner = client.users.cache.get((await ban.guild.fetchOwner()).user.id)
                                    const embed = new MessageEmbed()
                                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                                        .setDescription(`
                                        **Hello ${ban.guild.name} Owner <a:crown:939352514455797881> ,**
                                        ${executor.tag} Was Banned ${limit} User And i punished Him !
                                        `)
                                        .setColor('#00ebff')
                                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                                }).catch(async err => {
                                    const embed = new MessageEmbed()
                                        .setColor('ffff00')
                                        .setDescription(`
                                    **Hello ${ban.guild.name} Owner <a:crown:939352514455797881> ,**
                                    ${executor.tag} Was Banned ${limit} User ,and I don't have permissions and I can't punish  ${executor.tag}
                                    `)
                                        .setTitle('Alert  <:Alert:939351669341323264> ')
                                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                    const owner = client.users.cache.get((await ban.guild.fetchOwner()).user.id)
                                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                                })
                            } else {
                                return;
                            }
                        } else {
                            return;
                        }
                    })


                }



            }

        }
    } else {
        return;
    }
});
client.on('guildBanRemove', async ban => {
    let limit = db.get(`${ban.guild.id}_banLimit`)
    if (!limit) {
        return;
    }
    const fetchedLogs = await ban.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_BAN_REMOVE',
    });

    const banLog = fetchedLogs.entries.first();


    if (!banLog) return console.log(`${ban.user.tag} was banned from ${ban.guild.name} but no audit log could be found.`);


    const { executor, target } = banLog;


    if (target.id === ban.user.id) {
        db.add(`${executor.id}_${ban.guild.id}_banLimit`, 1)
        let userLimit = db.get(`${executor.id}_${ban.guild.id}_banLimit`)
        console.log(db.get(`${executor.id}_${ban.guild.id}_banLimit`))
        if (limit == userLimit) {
            db.set(`${executor.id}_${ban.guild.id}_banLimit`, 0)
            if (db.get(`${executor.id}_${ban.guild.id}_isWhiteList`) || executor.id == (await ban.guild.fetchOwner()).id) {
                return console.log('in whitelist');
            } else {
                let punish = db.get(`${ban.guild.id}_punish`)
                if (!punish) return;
                if (punish === 'ban') {

                    ban.guild.members.ban(executor.id).then().catch(err => { })
                    await ban.guild.bans.fetch(executor).then(async un => {
                        const owner = client.users.cache.get((await ban.guild.fetchOwner()).user.id)
                        const embed = new MessageEmbed()
                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                            .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                            .setDescription(`
                    **Hello ${ban.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was UnBanned ${limit} User And i punished Him !
                    `)
                            .setColor('#00ebff')
                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                    }).catch(async err => {
                        const embed = new MessageEmbed()
                            .setColor('ffff00')
                            .setDescription(`
                    **Hello ${ban.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was UnBanned ${limit} User ,and I don't have permissions and I can't punish  ${executor.tag}
                    `)
                            .setTitle('Alert  <:Alert:939351669341323264> ')
                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        const owner = client.users.cache.get((await ban.guild.fetchOwner()).user.id)
                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                    });

                } else if (punish === 'kick') {
                    ban.guild.members.kick(executor.id).then(async eu => {
                        const owner = client.users.cache.get((await ban.guild.fetchOwner()).user.id)
                        const embed = new MessageEmbed()
                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                            .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                            .setDescription(`
                    **Hello ${ban.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was UnBanned ${limit} User And i punished Him !
                    `)
                            .setColor('#00ebff')
                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                    }).catch(async err => {
                        const embed = new MessageEmbed()
                            .setColor('ffff00')
                            .setDescription(`
                **Hello ${ban.guild.name} Owner <a:crown:939352514455797881> ,**
                ${executor.tag} Was UnBanned ${limit} User ,and I don't have permissions and I can't punish  ${executor.tag}
                `)
                            .setTitle('Alert  <:Alert:939351669341323264> ')
                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        const owner = client.users.cache.get((await ban.guild.fetchOwner()).user.id)
                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                    })


                } else if (punish === 'RemoveRole') {
                    ban.guild.roles.cache.forEach(async role => {
                        if (role.members.get(executor.id)) {
                            console.log(`+ ${role.name}`)
                            if (role.id !== ban.guild.id) {
                                const guild = client.guilds.cache.get(ban.guild.id);
                                const roled = ban.guild.roles.cache.get(role.id);
                                const member = await guild.members.fetch(executor.id);

                                console.log(executor.id)
                                member.roles.remove(roled).then(async eu => {
                                    const owner = client.users.cache.get((await ban.guild.fetchOwner()).user.id)
                                    const embed = new MessageEmbed()
                                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                                        .setDescription(`
                                **Hello ${ban.guild.name} Owner <a:crown:939352514455797881> ,**
                                ${executor.tag} Was UnBanned ${limit} User And i punished Him !
                                `)
                                        .setColor('#00ebff')
                                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                                }).catch(async err => {
                                    const embed = new MessageEmbed()
                                        .setColor('ffff00')
                                        .setDescription(`
                            **Hello ${ban.guild.name} Owner <a:crown:939352514455797881> ,**
                            ${executor.tag} Was UnBanned ${limit} User ,and I don't have permissions and I can't punish  ${executor.tag}
                            `)
                                        .setTitle('Alert  <:Alert:939351669341323264> ')
                                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                    const owner = client.users.cache.get((await ban.guild.fetchOwner()).user.id)
                                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                                })
                            } else {
                                return;
                            }
                        } else {
                            return;
                        }
                    })


                }



            }

        }
    } else {

    }
});
client.on("channelUpdate", async function (oldChannel, newChannel) {
    let limit = db.get(`${newChannel.guild.id}_channelLimit`)
    if (!limit) {
        return;
    }
    const fetchedLogs = await newChannel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_UPDATE',
    });

    const banLog = fetchedLogs.entries.first();


    if (!banLog) return console.log(` no audit log could be found.`);


    const { executor } = banLog;

    console.log(`${oldChannel.name} Updated by ${executor.tag}`)
    db.add(`${executor.id}_${newChannel.guild.id}_channelLimit`, 1)
    let userLimit = db.get(`${executor.id}_${newChannel.guild.id}_channelLimit`)
    console.log(db.get(`${executor.id}_${newChannel.guild.id}_channelLimit`))
    if (limit == userLimit) {
        db.set(`${executor.id}_${newChannel.guild.id}_channelLimit`, 0)
        if (db.get(`${executor.id}_${newChannel.guild.id}_isWhiteList`)) {
            return console.log('in whitelist');
        } else {
            let punish = db.get(`${newChannel.guild.id}_punish`)
            if (!punish) return;
            if (punish === 'ban') {

                newChannel.guild.members.ban(executor.id).then().catch(err => { })
                await newChannel.guild.bans.fetch(executor).then(async un => {
                    const owner = client.users.cache.get((await newChannel.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                    **Hello ${newChannel.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Updated Channel's ${limit} Time ! And i punished Him !
                    `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                    **Hello ${newChannel.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Updated Channel's ${limit} Time ! ,and I don't have permissions and I can't punish  ${executor.tag}
                    `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await newChannel.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                });

            } else if (punish === 'kick') {
                newChannel.guild.members.kick(executor.id).then(async eu => {
                    const owner = client.users.cache.get((await newChannel.guild.fetchOwner()).user.id)
                    const embed = new MessageEmbed()
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                        .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                        .setDescription(`
                    **Hello ${newChannel.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Was Updated Channel's ${limit} Time ! And i punished Him !
                    `)
                        .setColor('#00ebff')
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                }).catch(async err => {
                    const embed = new MessageEmbed()
                        .setColor('ffff00')
                        .setDescription(`
                **Hello ${newChannel.guild.name} Owner <a:crown:939352514455797881> ,**
                ${executor.tag} Was Updated Channel's ${limit} Time ! ,and I don't have permissions and I can't punish  ${executor.tag}
                `)
                        .setTitle('Alert  <:Alert:939351669341323264> ')
                        .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                        .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                    const owner = client.users.cache.get((await newChannel.guild.fetchOwner()).user.id)
                    owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                })


            } else if (punish === 'RemoveRole') {
                newChannel.guild.roles.cache.forEach(async role => {
                    if (role.members.get(executor.id)) {
                        console.log(`+ ${role.name}`)
                        if (role.id !== newChannel.guild.id) {
                            const guild = client.guilds.cache.get(newChannel.guild.id);
                            const roled = newChannel.guild.roles.cache.get(role.id);
                            const member = await guild.members.fetch(executor.id);

                            console.log(executor.id)
                            member.roles.remove(roled).then(async eu => {
                                const owner = client.users.cache.get((await newChannel.guild.fetchOwner()).user.id)
                                const embed = new MessageEmbed()
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                                    .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                                    .setDescription(`
                                **Hello ${newChannel.guild.name} Owner <a:crown:939352514455797881> ,**
                                ${executor.tag} Was Updated Channel's ${limit} And i punished Him !
                                `)
                                    .setColor('#00ebff')
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                            }).catch(async err => {
                                const embed = new MessageEmbed()
                                    .setColor('ffff00')
                                    .setDescription(`
                            **Hello ${newChannel.guild.name} Owner <a:crown:939352514455797881> ,**
                            ${executor.tag} Was Updated Channel's ${limit} ,and I don't have permissions and I can't punish  ${executor.tag}
                            `)
                                    .setTitle('Alert  <:Alert:939351669341323264> ')
                                    .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                                    .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                const owner = client.users.cache.get((await newChannel.guild.fetchOwner()).user.id)
                                owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                            })
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                })


            }


        }

    }

});
// Channel Guard
client.on('channelDelete', async (channel) => {
    if (!channel.guild) return;

    const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_DELETE',
    });

    const deletionLog = fetchedLogs.entries.first();


    if (!deletionLog) return console.log(`Not Found`);

    const { executor } = deletionLog;
    if (executor.id == client.user.id) return console.log(`bot is whitelist`)
    let status = db.get(`${channel.guild.id}_ability_chfreeze`)
    if (status) {
        if (db.get(`${executor.id}_${channel.guild.id}_isWhiteList`)) {
            return console.log('in whitelist');
        } else {
            channel.clone()
        }
    } else {
        return console.log('0')
    }

})

client.on("roleUpdate", async function (oldRole, newRole) {

    if (oldRole.permissions !== newRole.permissions) {
        const oldPerms = oldRole.permissions.serialize();
        const newPerms = newRole.permissions.serialize();

        const permUpdated = [];

        for (const [key, element] of Object.entries(oldPerms)) {
            if (newPerms[key] !== element) permUpdated.push(key);
        }

        if (oldRole.permissions > newRole.permissions) {


            console.log(`${newRole.toString()} has lost the ${permUpdated.join(", ")} permission`)

        } else if (oldRole.permissions < newRole.permissions) {


            if (permUpdated.join(", ").includes('ADMINISTRATOR') || permUpdated.join(", ").includes('KICK_MEMBERS') || permUpdated.join(", ").includes('BAN_MEMBERS') || permUpdated.join(", ").includes('MANAGE_GUILD') || permUpdated.join(", ").includes('MANAGE_WEBHOOKS') || permUpdated.join(", ").includes('MANAGE_ROLES') || permUpdated.join(", ").includes('MANAGE_CHANNELS')) {
                console.log('1')
                const fetchedLogs = await newRole.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'ROLE_UPDATE',
                });

                const banLog = fetchedLogs.entries.first();


                if (!banLog) return console.log(` no audit log could be found.`);


                const { executor } = banLog;

                console.log(`${executor.tag} Give Dangerus perm to ${oldRole.name}`)

                newRole.setPermissions(oldRole.permissions)




                // 
                if (db.get(`${executor.id}_${newRole.guild.id}_isWhiteList`) || executor.id == (await oldRole.guild.fetchOwner()).id) {
                    return console.log('in whitelist');
                } else {
                    let punish = db.get(`${newRole.guild.id}_punish`)
                    if (!punish) return;
                    if (punish === 'ban') {

                        newRole.guild.members.ban(executor.id).then().catch(err => { })
                        await newRole.guild.bans.fetch(executor).then(async un => {
                            const owner = client.users.cache.get((await newRole.guild.fetchOwner()).user.id)
                            const embed = new MessageEmbed()
                                .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                                .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                                .setDescription(`
            **Hello ${newRole.guild.name} Owner <a:crown:939352514455797881> ,**
            ${executor.tag} Try to give dangerous permission to ${oldRole.name} , I remove dangerous permission  And i punished Him !
            `)
                                .setColor('#00ebff')
                            owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                        }).catch(async err => {
                            const embed = new MessageEmbed()
                                .setColor('ffff00')
                                .setDescription(`
            **Hello ${newRole.guild.name} Owner <a:crown:939352514455797881> ,**
            ${executor.tag}  ${executor.tag} Try to give dangerous permission to ${oldRole.name} , I remove dangerous permission ,and I don't have permissions and I can't punish  ${executor.tag}
            `)
                                .setTitle('Alert  <:Alert:939351669341323264> ')
                                .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                                .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                            const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                            owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})
                        });

                    } else if (punish === 'kick') {
                        newRole.guild.members.kick(executor.id).then(async eu => {
                            const owner = client.users.cache.get((await newRole.guild.fetchOwner()).user.id)
                            const embed = new MessageEmbed()
                                .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                                .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                                .setDescription(`
            **Hello ${newRole.guild.name} Owner <a:crown:939352514455797881> ,**
            ${executor.tag} Try to give dangerous permission to ${oldRole.name} , I remove dangerous permission And i punished Him !
            `)
                                .setColor('#00ebff')
                            owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                        }).catch(async err => {
                            const embed = new MessageEmbed()
                                .setColor('ffff00')
                                .setDescription(`
        **Hello ${newRole.guild.name} Owner <a:crown:939352514455797881> ,**
        ${executor.tag} Try to give dangerous permission to ${oldRole.name} , I remove dangerous permission ,and I don't have permissions and I can't punish  ${executor.tag}
        `)
                                .setTitle('Alert  <:Alert:939351669341323264> ')
                                .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                                .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                            const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                            owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                        })


                    } else if (punish === 'RemoveRole') {
                        newRole.guild.roles.cache.forEach(async role => {
                            if (role.members.get(executor.id)) {
                                console.log(`+ ${role.name}`)
                                if (role.id !== role.guild.id) {
                                    const guild = client.guilds.cache.get(role.guild.id);
                                    const roled = role.guild.roles.cache.get(role.id);
                                    const member = await guild.members.fetch(executor.id);

                                    console.log(executor.id)
                                    member.roles.remove(roled).then(async eu => {
                                        const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                                        const embed = new MessageEmbed()
                                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939359432477904897/1f6e1.png')
                                            .setTitle('Don\'t Worry  <a:safe:939359187182440510>')
                                            .setDescription(`
                        **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                        ${executor.tag} Try to give dangerous permission to ${oldRole.name} , I remove dangerous permission And i punished Him !
                        `)
                                            .setColor('#00ebff')
                                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})


                                    }).catch(async err => {
                                        const embed = new MessageEmbed()
                                            .setColor('ffff00')
                                            .setDescription(`
                    **Hello ${role.guild.name} Owner <a:crown:939352514455797881> ,**
                    ${executor.tag} Try to give dangerous permission to ${oldRole.name} , I remove dangerous permission ,and I don't have permissions and I can't punish  ${executor.tag}
                    `)
                                            .setTitle('Alert  <:Alert:939351669341323264> ')
                                            .setThumbnail('https://media.discordapp.net/attachments/939338555254272040/939351355842252850/broken-glass-warning-sign-vector-14988285.png?width=454&height=384')
                                            .setFooter('poki is the guardian of your community, so leave everything to poki', client.user.avatarURL({ dynamic: true }))
                                        const owner = client.users.cache.get((await role.guild.fetchOwner()).user.id)
                                        owner.send({ content: `${owner}`, embeds: [embed] }).then().catch(err=>{})

                                    })
                                } else {
                                    return;
                                }
                            } else {
                                return;
                            }
                        })


                    }



                }
            } else {
                console.log('0')
            }

        }
    }

});
