const Discord = require('discord.js');


module.exports = {
    name: 'hi',
    description: 'reply to user hi' ,
    execute(message, args, client) {



        let embedMessage = "";
        if (args[0]) {
            const user = getUserFromMention(args[0], client);
            if (!user) {
                return message.reply('who is that?');
            }
            embedMessage = `${message.author.username} says hi to ${user.username}!`;
        }else
            embedMessage = `${message.author.username} says hi to everyone!`;

        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#00e8e8')
            .setAuthor(embedMessage)
            .setImage('https://pa1.narvii.com/7563/1f4ae477b3f73a0d8ac475e510e28714a327ec4ar1-480-204_hq.gif')
            // .setTitle('Some title')
            // .setURL('')
            // .setDescription()
            // .setThumbnail('https://i.imgur.com/wSTFkRM.png')
            // .setTimestamp()
            .setFooter('ApexCommunityBot');

        message.channel.send(exampleEmbed);
    }
}

function getUserFromMention(mention, client) {
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(/^<@!?(\d+)>$/);

    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches) return;

    // However the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    const id = matches[1];

    return client.users.cache.get(id);
}
