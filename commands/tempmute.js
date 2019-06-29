const Discord = require("discord.js")

const ms = require("ms");

module.exports = {
    name: `tempmute`,
    description: `tempute user s/m/h/d`,
    execute(message, args){
    //prefix tempute @user s/m/h/d

    let tomute = message.mentions.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(`!tomute`) return message.reply("Couldn't find user.");
    if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute.")
    let muterole = message.guild.roles.find(`name`, "muted");
    if(`!muterole`){
        try{
            muterole = message.guild.createRole({
                name: "muted",
                color: "#000000",
                permissions:[]
            })
            message.guild.channels.forEach((channel, id) => {
                channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    SEND_TTS_MESSAGES: false,
                    ATTACH_FILES: false,
                    USE_EXTERNAL_EMOJIS: false,
                    ADD_REACTIONS: false
                });
            });
        }catch(e){
            console.log(e.stack);
        }
    }
    let mutetime = args[1];
    if(`!mutetime`) return message.reply("No time.");

    (tomute.addRole(muterole.id));
    message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}!`)
    
    setTimeout(function(){
        tomute.removeRole(muterole.id);
        message.channel.send(`<@${tomute.id}> unmuted!`);
    }, ms(mutetime));
}};

/*exports.help = function () {
    return "tempmute";
}*/