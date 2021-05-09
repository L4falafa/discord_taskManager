// import discord.js librery
const Discord = require('discord.js');
const dbJson = require('../discord/database/databaseJson.js')
// import javascript files

const fs = require('fs')

// import config file
const config = require('./config.json');

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

// cuando el cliente esta ready, ejecuta este codigo
// este evento se va a ejecutar una sola vez al inciarse el bot
client.once('ready', () => {
    console.log('Bot ready!');
    createDbJsonFirstTime();
});

// escuchando mensajes
client.on('message', message => {
    console.log(message.content);
    
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    

    if (command === 'task') {
        client.commands.get('task').execute(message, args, client);
    }
    else if (command === 'shoot') {
        client.commands.get('shoot').execute(message, args);
    }
    else if (command === 'punch') {
        client.commands.get('punch').execute(message, args);
    }
});

const createDbJsonFirstTime = () =>{
    if(fs.existsSync('../discord/database/dbdTasks.json'))return;
    
    let task1Template = [{
        author: "317332505168707594",
        name: "Tarea1",
        description: "Example of a Task",
        startDate: "10/4/2021",
        endDate: "17/4/2021"
    }];
    var stringToJson = JSON.stringify(task1Template);
    dbJson.createJsonFile('../discord/database','dbdTasks',stringToJson);
    
};
// logeo del bot en Discord con el token de autenticacion
client.login(config.token);
