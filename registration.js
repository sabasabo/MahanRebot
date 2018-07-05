const TeleBot = require('telebot');
const bot = new TeleBot('563240816:AAGh8uuIFfso91_r7Ium8na7TneorLoH6r8');
let registerationMap = new Map();
let unassignedMap = new Map();

// bot.on('text', (msg) => msg.reply.text(msg.text + ' hi'));


export class Registration {
    constructor(bot) {
        this.bot = bot;
        bot.on(['/start', '/hello'], this.registrationFunc);

        bot.on('newChatMembers', this.registrationFunc);

        bot.on(['/gaf_team'], (msg) => {
            let person = registerationMap.get(msg.from.id);
            if (person !== undefined) {
                person.gaf = msg.text.split(' ')[1];
                person.team = msg.text.split(' ')[2];
                // registerationMap.set(msg.from.id, person);
                msg.reply.text("welcom " + person.name + " from " + person.gaf + "/" + person.team);
            }
        });
    }

    registrationFunc(msg) {
        msg.reply.text('הכנס גף וצוות /gaf_team')
        let person = {};
        person.id = msg.from.id;
        person.name = msg.from.first_name + " " + msg.from.last_name;
        registerationMap.set(person.id, person);
    };
};

bot.start();

