const TeleBot = require('telebot');
const bot = new TeleBot('605816885:AAFe49RlVOiOQjU0F5Uqd60PorjSwJ2klmk');

// 9:00
const TIME_TO_SEND_STATUS_PROMPT = 9;

sendFormAtSpecifiedTime = (bot) => {
    setInterval(() => {
        // toDo : put stav and sabu map here
        chatIdList.forEach((chat_id) => {
            bot.sendMessage(chat_id, 'בוקר טוב, איפה אתה?', {replyMarkup});
        });
    }, 86400000);
};

let date = new Date();
let timeTOStartTheInterval;
if(date.getHours() < TIME_TO_SEND_STATUS_PROMPT) {
    timeTOStartTheInterval = (TIME_TO_SEND_STATUS_PROMPT - date.getHours()) * 3600000 + (60 - date.getMinutes()) * 60000 + (60 - date.getSeconds()) * 1000;
} else {
    timeTOStartTheInterval = (24 - (date.getHours() - TIME_TO_SEND_STATUS_PROMPT)) * 3600000 + (60 - date.getMinutes()) * 60000 + (60 - date.getSeconds()) * 1000;
}

setTimeout(sendFormAtSpecifiedTime, timeTOStartTheInterval);

const replayOptions = {
    OFFICE:{name: "במשרד", route: "במשרד/", answer: 'רק גובניקים אומרים משרד :)'},
    VACATION:{name: "בחופש", route: "בחופש/", answer: 'סליחה על ההפרעה, תהנה בחופשה!'},
    COURSE: {name: "בקורס", route: "בקורס/", answer: 'יפה לך, תהנה בקורס!'},
    DUTY: {name: "בתורנות", route: "בתורנות/", answer: 'תחזיק מעמד!'}
};

const gaffs = {
    TMUNASH:{
        name: 'תמונ"ש',
        teams:{
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


bot.on('/start', msg => {
    _isWaitingForAnswer = true;
return bot.sendMessage(msg.from.id, 'בוקר טוב, איפה אתה?', {replyMarkup});

});

bot.on("text", msg => {
    if(_isWaitingForAnswer) {

        function answer (text) {
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

