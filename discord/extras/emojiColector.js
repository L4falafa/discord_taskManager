const dbJson = require('../models/databaseJson.js');
const Discord = require('discord.js'); 
const replyDs = require('../extras/replyMessages.js')
const emojiUnicodeForward = '▶️';
const emojiUnicodeBackward = '◀️';
const emojiUnicodeCross = '🇽';

function startCollectorTask(message){
    var userId = message.embeds[0].footer.text.trim();
    const filter = (reaction, user) => {
        return (reaction.emoji.name === emojiUnicodeCross &&  user.id === userId);
    };
    
    const collector = message.createReactionCollector(filter, { time: 15000 });
    collector.on('collect', (reaction, user) => {
        message.reactions.resolve(emojiUnicodeCross).users.remove(userId.toString());
        dbJson.removeTask(user.id,message.embeds[0].fields[0].value.trim()).then(message.channel.send("|"+replyDs.SuccessfulyDeletedTask(message.embeds[0].fields[0].value.trim())));
    })
};

async function startCollectorNavegation(message){
    var userId = message.embeds[0].footer.text.trim().split('|')[1].trim().toString();
    const filter = (reaction, user) => {
        return (reaction.emoji.name === emojiUnicodeBackward || reaction.emoji.name === emojiUnicodeForward)&&  user.id === userId;
    };
    
    const collector = message.createReactionCollector(filter, { time: 60000 });
    collector.on('collect', async (reaction, user) => {
        var pageTask =  parseInt(message.embeds[0].footer.text.trim().split('|')[0].trim()[0]);
        message.reactions.resolve(emojiUnicodeBackward).users.remove(userId.toString());
        message.reactions.resolve(emojiUnicodeForward).users.remove(userId.toString());
        var userTasks = await dbJson.getTasks(userId);
        if(reaction.emoji.name === emojiUnicodeBackward && pageTask > 1)
        {
            pageTask--;

            let endIndex = 0;
            // pagina * 6  = index inicio --- index final =  pagin + 6 > arr.lenght ?  indexf = pagina+6 : indexf = pagina + arr.lengh % 6
             //slices the first page of userTaks endIndex = userTasks.length % 6 
            endIndex = pageTask == 1 && userTasks.length%6 != 0 && userTasks.length < 6  ?  userTasks.length % 6 : pageTask*6 ;
            //endIndex = ((pageTask-1)*6)+ userTasks.length%6 > userTasks.length ?  (pageTask *6) + (userTasks.length % 6) : pageTask*6;
            let pageOneTask = userTasks.slice((pageTask-1)*6,endIndex);

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
            .setAuthor(user.username,user.avatarURL())
            .setFooter(`${pageTask}-${Math.ceil(userTasks.length/6)} | ${userId}`)
            .addFields(embedFields)
            .setTitle('Tasks Manager');
            message.edit(embed);
        }else if(reaction.emoji.name === emojiUnicodeForward && Math.ceil(userTasks.length/6) != pageTask){
            pageTask++;
           
            //if(!(pageTask-1 *6)+userTasks.length%6 <=userTasks.length)console.log("xd");;
            let endIndex = 1;
            // pagina * 6  = index inicio --- index final =  pagin + 6 > arr.lenght ?  indexf = pagina+6 : indexf = pagina + arr.lengh % 6
             //slices the first page of tasks endIndex = userTasks.length % 6 
            endIndex = ((pageTask-1)*6)+ userTasks.length%6 > userTasks.length ?  (pageTask *6) + (userTasks.length % 6) : pageTask*6;
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
        const embed = new Discord.MessageEmbed()
            .setColor('#4A90E2')
            .setAuthor(user.username,user.avatarURL())
            .setFooter(`${pageTask}-${parseInt(Math.ceil(userTasks.length/6))} | ${userId}`)
            .addFields(embedFields)
            .setTitle('Tasks Manager');
            message.edit(embed);
        }


        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
    });
     
} 

module.exports = {
    startCollectorNavegation,
    startCollectorTask
};