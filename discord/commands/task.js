const Discord = require('discord.js');

const path = require('path');

module.exports = {
    name: 'task',
    description: 'reply to user hi' ,
    execute(message, args, client) {
        
        let task1 = [{
            author: "",
            name: "",
            description: "",
            startDate: Date.now,
            endDate: Date.now
        }];

        if(args.lenght != 3)
        {
            task1.author = message.author;
            task1.name = args[0];
            task1.description = args[1];
            task1.endDate = new Date(Date.prototype.getFullYear, Date.prototype.getMonth, Date.prototype.getDay, Date.prototype.getHours, Date.prototype.getMinutes, Date.prototype.getSeconds, Date.prototype.getMilliseconds);;
        }
        
    }
}

