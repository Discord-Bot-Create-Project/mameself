const Discord = require('discord.js-selfbot-v13');

module.exports = {
    name: 'miq2',
    description: 'Send specified user information and message to miq-api (based on reply)',
    async execute(message) {
        if (message.author.bot || !message.reference) return;

        const repliedMessage = await message.channel.messages.fetch(message.reference.messageID);
        const user = repliedMessage.author;
        const name = user.nickname || user.username;

        const miqApiUrl = `https://miq-api.onrender.com/?type=color&name=${encodeURIComponent(name)}&id=${encodeURIComponent(user.tag)}&icon=${encodeURIComponent(user.displayAvatarURL({ format: 'png' }))}&content=${encodeURIComponent(repliedMessage.content)}`;

        message.channel.send(miqApiUrl);
    },
};
