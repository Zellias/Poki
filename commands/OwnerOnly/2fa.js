const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageAttachment} = require('discord.js')
const speakeasy = require('speakeasy')

const Canvas = require('canvas');
const QRCode = require("qrcode");
const db = require('quick.db')
const { createCanvas, loadImage } = require("canvas");


async function create(dataForQRcode, center_image, width, cwidth) {
	const canvas = createCanvas(width, width);
	QRCode.toCanvas(
	  canvas,
	  dataForQRcode,
	  {
		errorCorrectionLevel: "H",
		margin: 1,
		color: {
		  dark: "#1F2B8F",
		  light: "#ffffff",
		},
	  }
	);
  
	const ctx = canvas.getContext("2d");
	const img = await loadImage(center_image);
	const center = (width - cwidth) / 2;
	ctx.drawImage(img, center, center, cwidth, cwidth);
	return canvas.toBuffer();
  }






module.exports = {
	data: new SlashCommandBuilder()
		.setName('2fa')
		.setDescription('Set Your One Time Password')
        .addSubcommand(subcommand =>
			subcommand
				.setName('get')
				.setDescription('Get 2Factor authentication QRcode !'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('verify')
				.setDescription('verify code [ the code you get from the application]')
				.addIntegerOption(option => option.setName('code').setDescription('one time code you get from authentication app'))),
	async execute(interaction) {
        let owner = await interaction.guild.fetchOwner()
		if(interaction.user.id !== owner.id) {
			return await interaction.reply({content:'You Are Not guildOwner !', ephemeral: true })
		}
        let sub = interaction.options.getSubcommand()
		
			if(sub == 'get'){
                var secret = speakeasy.generateSecret({length: 20});
				var url = speakeasy.otpauthURL({ secret: secret.ascii, label: `${interaction.guild.name} Server | PokiBot 2FA`, algorithm: 'sha512' });
                db.set(`${interaction.user.id}_2fa_secret`,secret)
            const qrCode = await create(
				url,
					
                    "https://media.discordapp.net/attachments/939338555254272040/939762929706864671/1474b1e6fe07542a3d081a2cb5be6129.png",
                    230,
                    75
                );
			const attachment = new MessageAttachment(qrCode, 'QRcode.png');
            await interaction.reply({ content:'Check Your Dm', ephemeral: true }).then(async eu =>{
                await interaction.user.send({ content:'Scan This QRcode in your 2Factor Authentication App And Use \`/2fa verify code[ the code you get from the application]\`', files: [attachment] });
               
            })
        }else if(sub == 'verify'){
            const number = interaction.options.getInteger('code')
            let secret = db.get(`${interaction.user.id}_2fa_secret`)
            var token = speakeasy.totp({
                secret: secret.base32,
                encoding: 'base32'
              });
              console.log(token)
              if(number == token){
                  await interaction.reply({content:'Correct :tada: , You Succsesfully Verify Your Self ! :white_check_mark: ', ephemeral: true })
                  db.set(`${interaction.guild.id}_2fa_verify`,true)
              }else{
                await interaction.reply({content:'InCorrect , Try Again :angry: ', ephemeral: true })
              }
        }
        
            





		  
		
	},
};
