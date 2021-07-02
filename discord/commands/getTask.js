const dbJson = require('../models/databaseJson.js');
const Discord = require('discord.js'); 
const replyDs = require('../extras/replyMessages.js');
const dayjs = require('dayjs');

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
            .setColor(`#${task.status == true ? '17D100': dayjs(task.endDate).diff(new Date(), 'day') <= 7?'BE0000':'CAD100'}`)
            .setAuthor(message.member.user.username,message.author.avatarURL())
            .setFooter(`${message.author.id}`)
            .addField('Name', task.name)
            .addField('Description:', task.description, false)
            .addField('Start Date',dayjs(task.startDate).format('YYYY-MM-DD'), true)
            .addField('End Date',dayjs(task.endDate).format('YYYY-MM-DD'), true)
            .setTitle('Info Task');
        
        //send embed to channel
        message.channel.send(exampleEmbed);             
        
    }
};