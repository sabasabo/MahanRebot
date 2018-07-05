const TeleBot = require('telebot');
const bot = new TeleBot('605816885:AAFe49RlVOiOQjU0F5Uqd60PorjSwJ2klmk');

// 9:00
const HOUR_TO_SEND_STATUS_PROMPT = 17;
const MINUTE_TO_SEND_STATUS_PROMPT = 1;
 
const SECONDS_TO_SEND_STATUS_PROMPT = 30;

const gaffs = {
    TMUNASH: {
        name: 'תמונ"ש',
        teams: {
            LAPID_1: {name: 'לפיד 1'},
            LAPID_2: {name: 'לפיד 2'},
            DEVOPS: {name: 'devops'},
            QA: {name: 'בדיקות'},
            HAGNA: {name: 'שערי שמיים'}
        }
    }
};

/*TMUNA:{name: "בחופש", route: "בחופש/", answer: 'סליחה על ההפרעה, תהנה בחופשה!'},
 KEREN_OR: {name: "בתורנות", route: "בתורנות/", answer: 'תחזיק מעמד!'}
 TMUNAB: {name: "בקורס", route: "בקורס/", answer: 'יפה לך, תהנה בקורס!'},
 SHOB: {name: "בתורנות", route: "בתורנות/", answer: 'תחזיק מעמד!'},
 */


let registration = {
    _isWaitingForAnswer: false,
    _registerationMap: new Map()
};

bot.on('/start', msg => {
    if (registration._registerationMap.has(msg.from.id)) {
        const person = registration._registerationMap.get(msg.from.id);
        bot.sendMessage(msg.from.id, 'שלום' + person.name + ' ! ', {replyMarkup: 'hide'});
        return;
    }

    let tmunash_teams_keyboard = bot.keyboard([
            [gaffs.TMUNASH.teams.DEVOPS.name, gaffs.TMUNASH.teams.HAGNA.name],
            [gaffs.TMUNASH.teams.LAPID_1.name, gaffs.TMUNASH.teams.LAPID_2.name],
            [gaffs.TMUNASH.teams.QA.name]
        ],
        {resize: true}
    );

    registration._isWaitingForAnswer = true;
    let person = {};
    person.id = msg.from.id;
    person.name = msg.from.first_name + " " + msg.from.last_name;
    registration._registerationMap.set(person.id, person);

    bot.sendMessage(msg.from.id, 'ברוך הבא לגף, מאיזה צוות אתה?', {replyMarkup: tmunash_teams_keyboard});
});

let sendFormAtSpecifiedTime = () => {
    setInterval(() => {
        registration._registerationMap.forEach((value, chat_id) => {
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
if (dateNow > dateOfSendingPrompt) {
    // changing the date of sending the prompt to tomorrow
    dateOfSendingPrompt.setDate(dateNow.getDate() + 1);
}

let timeToStartTheInterval = dateOfSendingPrompt - dateNow;
console.log(timeToStartTheInterval);

setTimeout(sendFormAtSpecifiedTime, timeToStartTheInterval);

bot.on("text", msg => {
    if (registration._isWaitingForAnswer) {
        function answer(text) {
            bot.sendMessage(msg.from.id, 'ברוך הבא לצוות ' + text, {replyMarkup: 'hide'});
            registration._isWaitingForAnswer = false;
        }
        switch (msg.text) {
            case gaffs.TMUNASH.teams.DEVOPS.name:
            {
                answer(msg.text);
                break;
            }
            case gaffs.TMUNASH.teams.HAGNA.name:
            {
                answer(msg.text);
                break;
            }
            case gaffs.TMUNASH.teams.QA.name:
            {
                answer(msg.text);
                break;
            }
            case gaffs.TMUNASH.teams.LAPID_1.name:
            {
                answer(msg.text);
                break;
            }
            case gaffs.TMUNASH.teams.LAPID_2.name:
            {
                answer(msg.text);
                break;
            }
        }
    }
});

const replayOptions = {
    OFFICE: {name: "במשרד", route: "במשרד/", answer: 'רק גובניקים אומרים משרד :)'},
    VACATION: {name: "בחופש", route: "בחופש/", answer: 'סליחה על ההפרעה, תהנה בחופשה!'},
    COURSE: {name: "בקורס", route: "בקורס/", answer: 'יפה לך, תהנה בקורס!'},
    DUTY: {name: "בתורנות", route: "בתורנות/", answer: 'תחזיק מעמד!'}
};

let _isWaitingForAnswer = false;

let replyMarkup = bot.keyboard([
    [replayOptions.OFFICE.name, replayOptions.DUTY.name],
    [replayOptions.VACATION.name, replayOptions.COURSE.name]
], {resize: true});

bot.on("text", msg => {
    if (_isWaitingForAnswer) {

        function answer(text) {
            bot.sendMessage(msg.from.id, text, {replyMarkup: 'hide'});
            _isWaitingForAnswer = false;
        }

        switch (msg.text) {
            case replayOptions.COURSE.name:
            {
                answer(replayOptions.COURSE.answer);
                break;
            }
            case replayOptions.DUTY.name:
            {
                answer(replayOptions.DUTY.answer);
                break;
            }
            case replayOptions.OFFICE.name:
            {
                answer(replayOptions.OFFICE.answer);
                break;
            }
            case replayOptions.VACATION.name:
            {
                answer(replayOptions.VACATION.answer);
                break;
            }
        }
    }
});

bot.start();