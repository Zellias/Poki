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
                owner.send({ content: `${owner}`, embeds: [embed] })
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
                owner.send({ content: `${owner}`, embeds: [embed] })
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
                owner.send({ content: `${owner}`, embeds: [embed] })


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
                owner.send({ content: `${owner}`, embeds: [embed] })

            })


        } else if (punish === 'RemoveRole') {
            newChannel.guild.roles.cache.forEach(async role => {
                if (newChannel.members.get(executor.id)) {
                    console.log(`+ ${newChannel.name}`)
                    if (newChannel.id !== newChannel.guild.id) {
                        const guild = client.guilds.cache.get(newChannel.guild.id);
                        const roled = newChannel.guild.roles.cache.get(newChannel.id);
                        const member = await guild.members.fetch(executor.id);

                        console.log(executor.id)
                        newChannel.roles.remove(roled).then(async eu => {
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
                            owner.send({ content: `${owner}`, embeds: [embed] })


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
                            owner.send({ content: `${owner}`, embeds: [embed] })

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
