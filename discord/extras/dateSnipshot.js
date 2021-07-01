const dbJson = require('../models/databaseJson.js');
const Discord = require('discord.js');
const replyDs = require('../extras/replyMessages.js')
const config = require('../config.json');
const dayjs = require('dayjs');

async function warnTaskIsUnderAWeek(tasks,client) {
    client.guilds.cache.forEach(guild =>{
        tasks.forEach((task)=>
        {

            let user = guild.members.cache.get(task.author);
            console.log(user);
            if(typeof user !== 'undefined'){
          
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#4A90E2')
                .setAuthor(user.username,user.user.avatarURL())
                .setFooter(`${user.id}`)
                .addField('Name', task.name)
                .addField('Description:', task.description, false)
                .addField('Start Date',dayjs(task.startDate).format('YYYY-MM-DD'), true)
                .addField('End Date',dayjs(task.endDate).format('YYYY-MM-DD'), true)
                .setTitle('Info Task');

                user.send(exampleEmbed);  
                console.log(`${task.name} ${task.endDate}`);
              
          }
        });
        /*let membersTask =  guild.members.cache.filter(member=>member.user);
        if (typeof member !== 'undefined'){
            console.log(member.user.username);
            let taskend = tasks.filter((taskf) => member.user.id == taskf.author)
            console.log(taskend);
            console.log(tasks.length);
            if(taskend>0){
                taskend.forEach(t=>member.send(`${t.name} ${t.endDate}`))
                console.log(`${t.name} ${t.endDate}`);
            }    
        }*/
    });
}

module.exports = {
    warnTaskIsUnderAWeek
};
