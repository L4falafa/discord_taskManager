const dbJson = require('../database/databaseJson.js');
const Discord = require('discord.js');

//import * as dbJson from 'C:/Users/antuS/Desktop/JS/Discord/discord_taskManager/discord/database/databaseJson.js';

module.exports = {
    name: 'task',
    description: 'reply to user hi' ,
    execute(message, args, client) {
         
        
        let task1 = {
            author: "",
            name: "",
            description: "",
            startDate: new Date(),
            endDate: new Date()
        };

        if(args.lenght != 3)
        {  
            task1.author = message.author.id;
            task1.name = args[0];      
            let indexStart =  args[0].length+args[1].length+8;
            task1.description = (message.content).substring(indexStart);           
            task1.endDate = addDays(parseInt(args[1]),task1.endDate);
            //task1.endDate = new Date(Date.prototype.getFullYear, Date.prototype.getMonth, Date.prototype.getDay, Date.prototype.getHours, Date.prototype.getMinutes, Date.prototype.getSeconds, Date.prototype.getMilliseconds);
        }
        dbJson.getTasks().then(value => console.log(value));

    }
}
/*  dbdJson.pullDBJsonTask(task1); */
const addDays = (days, date)=>
{
Date.prototype.addDays = function (day) {
    let dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + day);
    return dat;
  }
  return date.addDays(days);
}

