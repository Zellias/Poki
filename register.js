function register(){
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require("./data.json")


const commands = [];
const commandFolders = fs.readdirSync('./commands')


for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}/`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        commands.push(command.data.toJSON());
        console.log(`+ Registered ${file} from ${folder}`)
    }
}
const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands("940820484637982720","940820287828660264"), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
}
module.exports = { register }