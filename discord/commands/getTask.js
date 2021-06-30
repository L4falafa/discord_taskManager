const dbJson = require('../models/databaseJson.js');
const Discord = require('discord.js'); 
const replyDs = require('../extras/replyMessages.js')

//module command to get first page of tasks and set the message to navigate trough
module.exports = {
    name: 'gettask',
    description: 'reply to user hi' ,
    async execute(message, args, client) {

        if(args.length != 1){message.reply(replyDs.BadSyntax(this.name));return;}
        let task;
        try {
            task = await dbJson.getTaskByName(message.author.id,args[0]);
        }
        catch (err) {
            message.reply(""+err);
            return;
        }        
        //creates embed
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#4A90E2')
            .setAuthor(message.member.user.username,message.author.avatarURL())
            .setFooter(`${message.author.id}`)
            .addField('Name', task.name)
            .addField('Description:', task.description, false)
            .addField('Start Date',`${new Date(task.startDate).getDay()}/${new Date(task.startDate).getMonth()}/${new Date(task.startDate).getFullYear()}`, true)
            .addField('End Date',`${new Date(task.endDate).getDay()}/${new Date(task.endDate).getMonth()}/${new Date(task.endDate).getFullYear()}`, true)
            .setTitle('Info Task');
        
        //send embed to channel
        message.channel.send(exampleEmbed);             
        
    }
};