const botconfig = require("./botconfig.json");
const Discord = require('discord.js');
const Canvas = require('canvas');
const fs = require("fs");

const bot = new Discord.Client({disableEveryone: true})

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
	if(err) console.log(err);
	console.log(`Loading a total of ${files.length} commands.`);

	let jsfile = files.filter(f => f.split(".").pop() === "js")
	if(jsfile.length <= 0){
		console.log("No command.");
		return;
	}

	jsfile.forEach((f, i) =>{
		if (!f.endsWith(".js")) return;
		let props = require(`./commands/${f}`);
		console.log(`${f} loaded!`);
		bot.commands.set(props.help, props);
	})
})

bot.once("ready", () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity('to Mistress Meri!', { type: 'LISTENING' });
});

bot.on("message", async message => {
	let prefix = botconfig.prefix;
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	
	console.log("Logged command attempt: " + message.content);
	
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	let commandfile = command.slice(prefix.length);

	/*let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);
	let commandfile = cmd.slice(prefix.length);*/
	
	/*bot.commands.forEach(function(value, key) {
		console.log('Found bot command with ' + key + '=' + value);*/
	
	if (bot.commands.has(commandfile)) {
		// Assign the command, if it exists in Commands
		console.log("Bot commands has command: " + commandfile);
		cmd = bot.commands.get(commandfile)
	  // Check if the command exists in Aliases
	  } else if (bot.aliases.has(commandfile)) {
		// Assign the command, if it exists in Aliases
		console.log("Bot aliases has command: " + commandfile);
		cmd = bot.commands.get(bot.aliases.get(commandfile));
	  };
});

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

bot.on('guildMemberAdd', async member => {
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./temp.png');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Welcome to our server,', canvas.width / 2.5, canvas.height / 3.5);

	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

  channel.send(`Welcome ${member}!`, attachment);
});

bot.on('message', async message => {
	if (message.content === '!join') {
		bot.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
	}
});

bot.login(botconfig.token);