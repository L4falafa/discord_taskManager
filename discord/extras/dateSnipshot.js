const Discord = require('discord.js');
const dayjs = require('dayjs');

async function warnTaskIsUnderAWeek(tasks,client) {
    if(tasks.length<1)return;
    client.guilds.cache.forEach(guild =>{
        tasks.forEach((task)=>
        {  
            if(task.status != true){
                let user = guild.members.cache.get(task.author.trim());
                if(typeof user !== 'undefined'){
                    const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#E40505')
                    .setAuthor(user.username,user.user.avatarURL())
                    .setFooter(`${user.id}`)
                    .addField('Name', task.name)
                    .addField('Description:', task.description, false)
                    .addField('Start Date',dayjs(task.startDate).format('YYYY-MM-DD'), true)
                    .addField('End Date',dayjs(task.endDate).format('YYYY-MM-DD'), true)
                    .setTitle('Info Task');
    
                    user.send(exampleEmbed);   
            }                      
          }
        });
    });
}

module.exports = {
    warnTaskIsUnderAWeek
};
