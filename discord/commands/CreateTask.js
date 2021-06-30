const dbJson = require('../models/databaseJson.js');
const Discord = require('discord.js');
const replyDs = require('../extras/replyMessages.js')
const config = require('../config.json');

//module command to the creation of a new task and save them
module.exports = {
    name: 'createtask',
    description: 'reply to user hi' ,
    execute(message, args, client) {
         
        //template to the task
        let task1 = {
            author: "",
            name: "",
            description: "",
            startDate: new Date(),
            endDate: new Date()
        };

        //checking if command is valid
        if(args.length < 3  || isNaN(args[1]))
        {
            message.reply(replyDs.BadSyntax(this.name));          
            return;
        };
        
        //change values of the template
            task1.author = message.author.id;
            task1.name = args[0];
            let indexStart =  args[0].length+args[1].length+message.content.trim().split(/ +/,1)[0].length+3;
            task1.description = message.content.slice(indexStart);
            task1.endDate = addDays(parseInt(args[1]),task1.endDate);
        
        //pull the task to the json document
            dbJson.pullDBJsonTask(task1)
                .then(()=>  {message.reply(""+replyDs.SuccessfulyAddTask(task1.name, `${task1.endDate.getDay()}/${task1.endDate.getMonth()}/${task1.endDate.getFullYear()}`))})
                .catch(err => message.reply(""+err));
                        
    }
}

//add days to the date
const addDays = (days, date)=>
{
Date.prototype.addDays = function (day) {
    let dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + day);
    return dat;
  }
  return date.addDays(days);
}

