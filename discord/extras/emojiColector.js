const dbJson = require('../models/databaseJson.js');
const Discord = require('discord.js'); 
const replyDs = require('../extras/replyMessages.js')

async function startCollector(message){
    console.log(message.embeds[0].footer.text.trim().split('|')[1].trim());
    var userId = message.embeds[0].footer.text.trim().split('|')[1].trim().toString();
    var pageTask = parseInt(message.embeds[0].footer.text.trim().split('|')[0].trim()[0]);
    const filter = (reaction, user) => {
        return (reaction.emoji.name === '◀️' || reaction.emoji.name === '▶️')&&  user.id === userId;
    };
    
    const collector = message.createReactionCollector(filter, { time: 60000 });
    collector.on('collect', async (reaction, user) => {
        pageTask =  parseInt(message.embeds[0].footer.text.trim().split('|')[0].trim()[0]);
        message.reactions.resolve('◀️').users.remove(userId.toString());
        message.reactions.resolve('▶️').users.remove(userId.toString());
        console.log("testxd");
        console.log(userId);
        if(reaction.emoji.name === '◀️' && pageTask > 1)
        {
            let userTasks = await dbJson.getTasks(userId);

            let endIndex = 0;
            // pagina * 6  = index inicio --- index final =  pagin + 6 > arr.lenght ?  indexf = pagina+6 : indexf = pagina + arr.lengh % 6
             //slices the first page of userTaks endIndex = userTasks.length % 6 
            userTasks.length- (pageTask*6) <= 6 ? endIndex = userTasks.length % 6 : endIndex = pageTask*6;
        
            let pageOneTask = userTasks.slice(--pageTask*6,endIndex);

            //creates tasks fields
            let embedFields = [];
            pageOneTask.forEach(x=>
                {
                embedFields.push(field ={
                    name: x.name,
                    value: `Start: **${new Date(x.startDate).getDay()}/${new Date(x.startDate).getMonth()}/${new Date(x.startDate).getFullYear()}** \n End: **${new Date(x.endDate).getDay()}/${new Date(x.endDate).getMonth()}/${new Date(x.endDate).getFullYear()}**`,
                    inline: true
                })
            });
        //creates embed
        const embed = new Discord.MessageEmbed()
            .setColor('#4A90E2')
            .setAuthor(message.member.user.username,message.author.avatarURL())
            .setFooter(`${pageTask++}-${parseInt(userTasks.length/6)} | ${userId}`)
            .addFields(embedFields)
            .setTitle('Tasks Manager');
            message.edit(embed);
        }else if(reaction.emoji.name === '▶️'){
            let userTasks = await dbJson.getTasks(userId);
            console.log(userTasks.length);
            //if(!(pageTask-1 *6)+userTasks.length%6 <=userTasks.length)console.log("xd");;
            console.log(pageTask);
            let endIndex = 1;
            // pagina * 6  = index inicio --- index final =  pagin + 6 > arr.lenght ?  indexf = pagina+6 : indexf = pagina + arr.lengh % 6
             //slices the first page of tasks endIndex = userTasks.length % 6 
            pageTask+6 > userTasks.length%6+pageTask ? endIndex = (pageTask *6) + (userTasks.length % 6) : endIndex = pageTask*6;
            let pageOneTask = userTasks.slice((pageTask - 1)*6,endIndex);

            //creates tasks fields
            let embedFields = [];
            pageOneTask.forEach(x=>
                {
                embedFields.push(field ={
                    name: x.name,
                    value: `Start: **${new Date(x.startDate).getDay()}/${new Date(x.startDate).getMonth()}/${new Date(x.startDate).getFullYear()}** \n End: **${new Date(x.endDate).getDay()}/${new Date(x.endDate).getMonth()}/${new Date(x.endDate).getFullYear()}**`,
                    inline: true
                })
            });
        //creates embed
        console.log(pageTask);
        console.log(`${pageTask}`);
        const embed = new Discord.MessageEmbed()
            .setColor('#4A90E2')
            .setAuthor(message.member.user.username,message.author.avatarURL())
            .setFooter(`${pageTask + 1}-${parseInt(userTasks.length/6)} | ${userId}`)
            .addFields(embedFields)
            .setTitle('Tasks Manager');
            message.edit(embed);
        }


        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
    });
     
    collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
    });
} 

module.exports = {
    startCollector
};