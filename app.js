const TeleBot = require('telebot');
const bot = new TeleBot('608711787:AAHkJ1FOUYL6l7ZwDUXczklraWt77jJSN70');

const registrationMap = new Map();

// 9:00
const HOUR_TO_SEND_STATUS_PROMPT = 16;
const MINUTE_TO_SEND_STATUS_PROMPT = 41;
const SECONDS_TO_SEND_STATUS_PROMPT = 0;

let registrationFunc = (msg) => {
    msg.reply.text('הכנס גף וצוות /gaf_team');
    let person = {};
    person.id = msg.from.id;
    person.name = msg.from.first_name + " " + msg.from.last_name;
    registrationMap.set(person.id, person);
};

let sendFormAtSpecifiedTime = () => {
    setInterval(() => {
        registrationMap.forEach((value, chat_id) => {
            bot.sendMessage(chat_id, 'בוקר טוב, איפה אתה?', {replyMarkup});
        });
    }, 86400000);
};

let dateNow = new Date();
let dateOfSendingPrompt = new Date();

dateOfSendingPrompt.setHours(HOUR_TO_SEND_STATUS_PROMPT);
dateOfSendingPrompt.setMinutes(MINUTE_TO_SEND_STATUS_PROMPT);
dateOfSendingPrompt.setSeconds(SECONDS_TO_SEND_STATUS_PROMPT);

let timeTOStartTheInterval;

if(dateNow > dateOfSendingPrompt) {
    // changing the date of sending the prompt to tomorrow
    dateOfSendingPrompt.setDate(dateNow.getDate() + 1);
}

let timeToStartTheInterval = dateOfSendingPrompt - dateNow;

console.log(timeToStartTheInterval);
setTimeout(sendFormAtSpecifiedTime, timeToStartTheInterval);

const replayOptions = {
    OFFICE: {name: "במשרד", route: "במשרד/", answer: 'רק גובניקים אומרים משרד :)'},
    VACATION: {name: "בחופש", route: "בחופש/", answer: 'סליחה על ההפרעה, תהנה בחופשה!'},
    COURSE: {name: "בקורס", route: "בקורס/", answer: 'יפה לך, תהנה בקורס!'},
    DUTY: {name: "בתורנות", route: "בתורנות/", answer: 'תחזיק מעמד!'}
};

const gaffs = {
    TMUNASH: {
        name: 'תמונ"ש',
        teams: {
            LAPID_1: {name: 'לפיד 1', members: []},
            LAPID_2: {name: 'לפיד 2', members: []},
            DEVOPS: {name: 'devops', members: []},
            QA: {name: 'בדיקות', members: []},
            HAGNA: {name: 'שערי שמיים', members: []}
        }
    },
};
/*TMUNA:{name: "בחופש", route: "בחופש/", answer: 'סליחה על ההפרעה, תהנה בחופשה!'},
 TMUNAB: {name: "בקורס", route: "בקורס/", answer: 'יפה לך, תהנה בקורס!'},
 SHOB: {name: "בתורנות", route: "בתורנות/", answer: 'תחזיק מעמד!'},
 KEREN_OR: {name: "בתורנות", route: "בתורנות/", answer: 'תחזיק מעמד!'}*/

let _isWaitingForAnswer = true;

let replyMarkup = bot.keyboard([
    [replayOptions.OFFICE.name, replayOptions.DUTY.name],
    [replayOptions.VACATION.name, replayOptions.COURSE.name]
], {resize: true});





bot.on(['/start', '/hello'], registrationFunc);

bot.on('newChatMembers', registrationFunc);

bot.on(['/gaf_team'], (msg) => {
    let person = registrationMap.get(msg.from.id);
    if (person !== undefined) {
        person.gaf = msg.text.split(' ')[1];
        person.team = msg.text.split(' ')[2];
        msg.reply.text("welcom " + person.name + " from " + person.gaf + "/" + person.team);
    }
});






bot.on("text", msg => {
    if (_isWaitingForAnswer) {

        function answer(text) {
            bot.sendMessage(msg.from.id, text, {replyMarkup: 'hide'});
            _isWaitingForAnswer = false;
        }

        switch (msg.text) {
            case replayOptions.COURSE.name: {
                answer(replayOptions.COURSE.answer);
                break;
            }
            case replayOptions.DUTY.name: {
                answer(replayOptions.DUTY.answer);
                break;
            }
            case replayOptions.OFFICE.name: {
                answer(replayOptions.OFFICE.answer);
                break;
            }
            case replayOptions.VACATION.name: {
                answer(replayOptions.VACATION.answer);
                break;
            }
        }
    }
});

bot.start();

