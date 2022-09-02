// import discord.js librery
const Discord = require('discord.js');
const dbJson = require('../discord/models/databaseJson.js')
// import javascript files

const fs = require('fs')

// import config file
const config = require('./config.js');

const collectorReaction = require('../discord/extras/emojiColector.js');
const {warnTaskIsUnderAWeek} = require('./extras/dateSnipshot.js');
const { getTasks } = require('../discord/models/databaseJson.js');

// creando el cliente de Discord
const client = new Discord.Client();

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.help.name, command);
    command.help.aliases.forEach(alias => {
        client.aliases.set(alias, command.help.name);
    });
}


// when client is ready the code below will execute, only once time
client.once('ready', () => {
    console.log('Bot ready!');  
    client.user.setStatus('dnd');
    //client.user.
    client.user.setActivity(`${config.prefix}help < ct | gt | it >\n If the task end date is under a week the bot will warn you`, {
        type: 'PLAYING'
      });
    dbJson.getTasksUnderAWeekDate().then(tasks=> {warnTaskIsUnderAWeek(tasks,client)});
    setInterval(() => {
        dbJson.getTasksUnderAWeekDate().then(tasks=> {warnTaskIsUnderAWeek(tasks,client)});
      },43200000);
});

// listening messages
client.on('message', message => {
    // if the message is not a command or the author is a bot, return
    console.log(message.content);
    if(message.author.id == client.user.id && message.embeds.length != 0)
    {

        var embed = message.embeds[0];
        if(embed.title == "Tasks Manager")
        {
        message.react('◀️');
        message.react('▶️');
        collectorReaction.startCollectorNavegation(message);
        }else if(embed.title == "Info Task")
        {
            message.react('🇽');
            message.react('🆗');            
            message.channel.type === 'dm' ?
            collectorReaction.startCollectorTaskDm(message)
            :collectorReaction.startCollectorTask(message);
        }
        
    }  

    if(message.channel.type === 'dm')return;
    if(message.author.id == client.user.id && message.content[0] == '|')message.delete({timeout:3000})
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    let command;
    if(client.commands.has(commandName))
    {
            command = client.commands.get(commandName);
    }else{
        command = client.commands.get(client.aliases.get(commandName));
    }   
    if(command)command.execute(message, args, client);
   

});
//c

// logeo del bot en Discord con el token de autenticacion
client.login(config.token);
