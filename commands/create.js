const fs = require('fs');
const Discord = require('discord.js-selfbot-v13');
const fetch = require('node-fetch');
const path = require('path');
const config = require('../config.json');

module.exports = {
    name: 'create',
    description: 'create command',
    async execute(message, args) {
        if (message.author.bot) return;

        const userIdentifier = args[0];
        const contentImage = args.slice(1).join(' ');

        let user;

        if (userIdentifier.startsWith('<@') && userIdentifier.endsWith('>')) {
            user = message.mentions.users.first() || await message.client.users.fetch(userIdentifier.slice(2, -1)).catch(() => null);
        } else if (/^\d+$/.test(userIdentifier)) {
            user = await message.client.users.fetch(userIdentifier).catch(() => null);
        } else if (message.guild) {
            const member = message.guild.members.cache.find((m) => m.user.tag === userIdentifier);
            user = member ? member.user : null;
        }

        if (!user) {
            return message.reply('指定されたユーザーが見つかりません。');
        }

        const name = user.displayName;
        const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + process.env.apikey,
                },
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": [{
                        "role": "user",
                        "content": `${name}が言いそうな${contentImage}一言`
                    }]
                })
            });

            const data = await response.json();

            const replyText = data.choices && data.choices.length > 0 ? data.choices[0].message.content.trim() : 'OpenAI API のレスポンスが空です。';

            if (replyText !== '') {
                const content = replyText;
                const miqApiUrl = `https://miq-api.onrender.com/?type=color&name=${encodeURIComponent(name)}&id=${encodeURIComponent(user.tag)}&icon=${encodeURIComponent(avatarURL)}&content=${encodeURIComponent(content)}`;
                message.reply(miqApiUrl);
            } else {
                console.error('GPT-3 API response is not in the expected format:', data);
                message.reply('エラーが発生しました。後でもう一度やり直してください。');
            }
    },
};
