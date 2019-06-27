const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const Canvas = require('canvas');

const bot = new Discord.Client({disableEveryone: true})

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
});

bot.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.find(ch => ch.name === 'member-log');
    if (!channel) return;
    channel.send(`Welcome to our server ${member}, Once you have read the rules type ${prefix}accept to gain access to the rest of the server!`);
  });

bot.on(`guildMemberAdd`, async member => {
  guild.createChannel(`Members ${guild.memberCount}`, {
    type: 'voice',
    permissionOverwrites: [{
      id: guild.id,
      deny: ['CONNECT']
    }]
  })
    .then(console.log)
    .catch(console.error);
})

bot.on('message', async message => {
	if (message.content === '!join') {
		bot.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
	}
});

bot.on("message", async message => {
  if(message.author.bot) return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);


  if(cmd === `${prefix}report`){
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Where u at??");
    let reason = args.join(" ").slice(22);

    return;
  }

  if(cmd === `${prefix}letter`){
    guild.createChannel(`letter-${author}`, {
      type: 'text',
      permissionOverwrites: [{
        id: guild.id,
        deny: ['MANAGE_MESSAGES'],
        allow: ['SEND_MESSAGES']
      }]
    })
    return;
  }


  if(cmd === `${prefix}serverinfo`){

    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("Server Information")
    .setColor(000000)
    .setThumbnail(sicon)
    .addField("Server Name", message.guild.name)
    .addField("You Joined", message.member.joinedAt)
    .addField("Total Members", message.guild.memberCount);

    return message.channel.send(serverembed);

  }

  if(cmd === `${prefix}botinfo`){

    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription("Bot Information")
    .setColor(000000)
    .setThumbnail(bicon)
    .addField("Bot Name", bot.user.username)
    .addField("Created On", bot.user.createdAt);

    return message.channel.send(botembed);
  }
})

bot.login(botconfig.token);
