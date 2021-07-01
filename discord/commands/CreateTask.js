const dbJson = require('../models/databaseJson.js');
const Discord = require('discord.js');
const replyDs = require('../extras/replyMessages.js')
const config = require('../config.json');
const dayjs = require('dayjs')

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
            task1.endDate = dayjs().add(args[parseInt(1)], 'day').format('YYYY-MM-DD');

        //pull the task to the json document
            dbJson.pullDBJsonTask(task1)
                .then(()=>  {message.reply(""+replyDs.SuccessfulyAddTask(task1.name, task1.endDate))})
                .catch(err => message.reply(""+err));
                        
    }
}

