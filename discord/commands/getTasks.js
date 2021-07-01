const dbJson = require('../models/databaseJson.js');
const Discord = require('discord.js'); 
const replyDs = require('../extras/replyMessages.js')
const dayjs = require('dayjs');
//module command to get first page of tasks and set the message to navigate trough
module.exports = {
    name: 'gettasks',
    description: 'reply to user hi' ,
    async execute(message, args, client) {

        if(args.length>0){message.reply(replyDs.BadSyntax(this.name));return;}
        let userTasks = [] 
        try {
            userTasks = await dbJson.getUserTasksById(message.author.id);
        }
        catch (err) {
            message.reply(""+err);
            return;
        }        

        let endIndex = 0;
        //slices the first page of tasks
        userTasks.length < 6 ? endIndex = userTasks.length % 6  : endIndex = 6;
        
        let pageOneTask = userTasks.slice(0,endIndex);

        //creates tasks fields
        let embedFields = [];
        pageOneTask.forEach(x=>
        {
            embedFields.push(field ={   
                name: x.name,
                value: `Start: **${dayjs(x.startDate).format('YYYY-MM-DD')}** \n End: **${dayjs(x.endDate).format('YYYY-MM-DD')}**`,
                inline: true
            })
        });
        //creates embed
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#4A90E2')
            .setAuthor(message.member.user.username,message.author.avatarURL())
            .setFooter(`1-${parseInt(Math.ceil(userTasks.length/6))} | ${message.author.id}`)
            .addFields(embedFields)
            .setTitle('Tasks Manager');
        
        //send embed to channel
        message.channel.send(exampleEmbed)             

        // pagina * 6  = index inicio --- index final =  pagin + 6 > arr.lenght ?  indexf = pagina+6 : indexf = pagina + arr.lengh % 6
        
    }
};