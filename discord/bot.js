// import discord.js librery
const Discord = require('discord.js');
const dbJson = require('../discord/models/databaseJson.js')
// import javascript files

const fs = require('fs')

// import config file
const config = require('./config.json');
const { Console } = require('console');

const collectorReaction = require('../discord/extras/emojiColector.js');
const {warnTaskIsUnderAWeek} = require('./extras/dateSnipshot.js');
const { getTasks } = require('../discord/models/databaseJson.js');

// creando el cliente de Discord
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module

    client.commands.set(command.name, command);
}


// when client is ready the code below will execute, only once time
client.once('ready', () => {
    console.log('Bot ready!');  
    dbJson.getTasksUnderAWeekDate().then(tasks=> {warnTaskIsUnderAWeek(tasks,client)});
    setInterval(() => {
        dbJson.getTasksUnderAWeekDate().then(tasks=> {warnTaskIsUnderAWeek(tasks,client)});
      },43200000);
});

// listening messages
client.on('message', message => {
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
    const command = args.shift().toLowerCase();
    if (command === 'createtask'||command === 'ctask'||command === 'ct') {
        client.commands.get('createtask').execute(message, args, client);
    }
    else if(command === 'gettasks'||command === 'gtask'||command === 'gt'){
        client.commands.get('gettasks').execute(message, args, client);
    }
    else if(command === 'removetask'||command === 'rtask'||command === 'rt'){
        client.commands.get('removetask').execute(message, args, client);
    }
    else if(command === 'gettask'||command === 'infotask'||command === 'gtask'||command === 'it'){
        client.commands.get('gettask').execute(message, args, client);
    }

});


// logeo del bot en Discord con el token de autenticacion
client.login(config.token);
