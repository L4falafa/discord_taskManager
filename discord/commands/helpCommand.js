const dbJson = require('../models/databaseJson.js');

const replyDs = require('../extras/replyMessages.js');
const config = require('../config.json');

//module command to get first page of tasks and set the message to navigate trough
module.exports = {
    name: 'helpcommand',
    description: 'Gets info from a command' ,
    execute(message, args, client) {
        if(args.length != 1){message.reply(replyDs.BadSyntax(this.name));return;}
        let commandName = args[0];
        let command; 
        if(client.commands.has(commandName))
        {
                command = client.commands.get(commandName);
        }else{
            command = client.commands.get(client.aliases.get(commandName));
        }       
        console.log(command.name);
        message.reply(command.description);
        
    }
};

module.exports.help = {
    name: "helpcommand",
    aliases: ['hp', 'help'],
}