const TeleBot = require('telebot');
const bot = new TeleBot('608711787:AAHkJ1FOUYL6l7ZwDUXczklraWt77jJSN70');

bot.on('text', (msg) => msg.reply.text(msg.text));

bot.start();

