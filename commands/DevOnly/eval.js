const { SlashCommandBuilder } = require('@discordjs/builders');
const { inspect } = require('util');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('evaluate a command')
		.addStringOption(option => option.setName('code').setDescription('Enter Code ro Evaluate').setRequired(true)),
	async execute(interaction) {
		if (interaction.user.id !== '937377363346473030') return;
    
    let evaled;
    try {
      evaled = await eval(interaction.options.getString('code'));
      await interaction.reply(inspect(evaled));
      console.log(inspect(evaled));
    }
    catch (error) {
      console.error(error);
      interaction.reply('there was an error during evaluation.');
    }
		
	},
};