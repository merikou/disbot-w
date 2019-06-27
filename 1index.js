const botconfig = require("./botconfig.json");
const Discord = require('discord.js');
const Canvas = require('canvas');
const fs = require("fs");

const bot = new Discord.Client({disableEveryone: true})

// Uses Discord.Collection() mostly for the helpers like `map()`, to be honest.
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
// Load the contents of the `/cmd/` folder and each file in it.
fs.readdir(`./commands/`, (err, files) => {
  if(err) console.error(err);
  console.log(`Loading a total of ${files.length} commands.`);
  // Loops through each file in that folder
  files.forEach(f =>{
    // require the file itself in memory
    let props = require(`./commmands/${f}`);
    console.log(`${f} loaded!`);
    // add the command to the Commands Collection
    bot.commands.set(props.help.name, props);
    // Loops through each Alias in that command
    props.conf.aliases.forEach(alias => {
      // add the alias to the Aliases Collection
      bot.aliases.set(alias, props.help.name);
    });
  });
});

bot.on('message', msg => {
    // Ignore message with no prefix for performance reasons
    if(!msg.content.startsWith(config.prefix)) return;
    // Get the command by getting the first part of the message and removing  the prefix.
    var command = msg.content.split(" ")[0].slice(config.prefix.length);
    // Get the params in an array of arguments to be used in the bot
    var params = msg.content.split(" ").slice(1);
    // run the `elevation` function to get the user's permission level
    let perms = bot.elevation(msg);
    let cmd;
    // Check if the command exists in Commands
    if (bot.commands.has(command)) {
      // Assign the command, if it exists in Commands
      cmd = bot.commands.get(command)
    // Check if the command exists in Aliases
    } else if (bot.aliases.has(command)) {
      // Assign the command, if it exists in Aliases
      cmd = bot.commands.get(bot.aliases.get(command));
    }
  
    if(cmd) {
      // Check user's perm level against the required level in the command
      if (perms < cmd.conf.permLevel) return;
      // Run the `exports.run()` function defined in each command.
      cmd.run(bot, msg, params);
    }
  });

  bot.login(botconfig.token);