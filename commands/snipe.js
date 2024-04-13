const fs = require('fs');
const Discord = require('discord.js-selfbot-v13');
const chalk = require('chalk');
const path = require('path');
const config = require('../config.json');

module.exports = {
    name: 'snipe',
    description: 'snipe command',
    async execute(message, args) {
        const userID = message.author.id;

        const whitelistPath = path.join(__dirname, '../whitelist.json');
        const whitelist = JSON.parse(fs.readFileSync(whitelistPath, 'utf8'));

        if (!whitelist.allowedUsers.includes(userID) && userID !== config.owner) {
            return;
        }

        if (message.author.bot) return;

        const count = args.length > 0 ? parseInt(args[0]) : 1;

        if (isNaN(count) || count < 1) {
            return message.reply('取得するメッセージの数として、有効な正の整数を入力してください。');
        }

        const historyFilePath = `./history/${message.channel.id}.txt`;

        fs.readFile(historyFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading history file: ${err}`);
                return message.reply('削除されたメッセージの取得中にエラーが発生しました。');
            }

            const messages = data.trim().split('\n-----\n');

            if (messages.length < count) {
                return message.reply(`履歴には十分な削除されたメッセージがありません。(現在のカウント: ${messages.length})`);
            }

            const snipedMessage = messages[messages.length - count];

            message.reply(snipedMessage);
        });
    },
};
