const Discord = require('discord.js');


module.exports = {
    name: 'shoot',
    description: 'shoots any player' ,
    execute(message, args, client) {

        let embedMessage = "";
        if (args[0]) {
            const user = getUserFromMention(args[0], client);
            if (!user) {
                return message.reply('watch out! you could get hurt with that.');
            }
            embedMessage = `${message.author.username} shoots ${user.username}!`;
        }else
            embedMessage = `${message.author.username} Shoots you!`;

        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#a30000')
            .setAuthor(embedMessage)
            .setImage('')
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
