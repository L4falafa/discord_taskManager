const dbJson = require('../models/databaseJson.js');
const replyDs = require('../extras/replyMessages.js')

//module command to the remove of a task
module.exports = {
    name: 'removetask',
    description: 'removes task' ,
    async execute(message, args, client) {
        console.log("xd");
        if(args.length!=1){message.reply(""+replyDs.BadSyntax(this.name));return;}

            dbJson.removeTask(message.author.id, args[0])
            .then(()=>message.reply(replyDs.SuccessfulyDeletedTask(args[0])))
            .catch(err=>message.reply(""+err));      

        // pagina * 6  = index inicio --- index final =  pagin + 6 > arr.lenght ?  indexf = pagina+6 : indexf = pagina + arr.lengh % 6
        
    }
};

module.exports.help = {
    name: "removetask",
    aliases: ['rt', 'rtask'],
}