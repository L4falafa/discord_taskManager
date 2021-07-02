const dbJson = require('../models/databaseJson.js');
const Discord = require('discord.js'); 
const replyDs = require('../extras/replyMessages.js')
const dayjs = require('dayjs');

const emojiUnicodeForward = '▶️';
const emojiUnicodeBackward = '◀️';
const emojiUnicodeCross = '🇽';
const emojiOk = '🆗';

function startCollectorTask(message){
    var userId = message.embeds[0].footer.text.trim();
    const filter = (reaction, user) => {
        return ((reaction.emoji.name === emojiUnicodeCross || reaction.emoji.name === emojiOk) &&  user.id === userId);
    };
    const collector = message.createReactionCollector(filter, { time: 15000 });
    collector.on('collect', (reaction, user) => { 
        var taskName = message.embeds[0].fields[0].value.trim();
        if(reaction.emoji.name == emojiUnicodeCross) 
        { 
            message.reactions.resolve(emojiUnicodeCross).users.remove(userId.toString());
            dbJson.removeTask(userId,taskName).then(message.channel.send("|"+replyDs.SuccessfulyDeletedTask(taskName)));
        }else if(reaction.emoji.name == emojiOk){ 

            message.reactions.resolve(emojiOk).users.remove(userId.toString());
    
            dbJson.getTaskByName(userId,taskName).then((task)=>{ 
                task.status = true; 
                dbJson.removeTask(userId,taskName)
                .then(()=>{ 
                    dbJson.pullDBJsonTask(task);
                    message.edit(message.embeds[0].setColor('17D100'))
                });
            });

           

        }
    })  
};

function startCollectorTaskDm(message){
    var userId = message.embeds[0].footer.text.trim();
    const filter = (reaction, user) => {
        return ((reaction.emoji.name === emojiUnicodeCross || reaction.emoji.name === emojiOk) &&  user.id === userId);
    }; 
    const collector = message.createReactionCollector(filter, { time: 30000 });
    collector.on('collect', (reaction, user) => {
        var taskName = message.embeds[0].fields[0].value.trim();
        if(reaction.emoji.name == emojiUnicodeCross) 
        {    
            dbJson.removeTask(userId,taskName).then(user.send("|"+replyDs.SuccessfulyDeletedTask(taskName)));
        }else if(reaction.emoji.name == emojiOk){ 
            dbJson.getTaskByName(userId,taskName).then((task)=>{ 
                task.status = true; 
                dbJson.removeTask(userId,taskName)
                .then(()=>{ 
                    dbJson.pullDBJsonTask(task);
                    message.edit(message.embeds[0].setColor('17D100'))
                });
            }); 

           

        }
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
                    name: `${x.status ? '🟩': dayjs(x.endDate).diff(new Date(), 'day') <= 7?'🟥':'🟨'} ${x.name}`,
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
                    name: `${x.status ? '🟩': dayjs(x.endDate).diff(new Date(), 'day') <= 7?'🟥':'🟨'} ${x.name}`,
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
    startCollectorTask,
    startCollectorTaskDm    
};