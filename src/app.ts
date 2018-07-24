import {timeToStartTheInterval} from "./time-scheduler";

const TeleBot = require('telebot');
const bot = new TeleBot({
    token: '563240816:AAGh8uuIFfso91_r7Ium8na7TneorLoH6r8',
    usePlugins: ['commandButton']
});

// 9:00
const HOUR_TO_SEND_STATUS_PROMPT = 9;
const MINUTE_TO_SEND_STATUS_PROMPT = 0;

const SECONDS_TO_SEND_STATUS_PROMPT = 0;


let GAFS = [
    ['תמונת שמיים',['לפיד 1','לפיד 2','שערי שמיים','devops','בדיקות']]
];

function buildGafsKeyboard(action) {
    let gafsButtons = [];
    for(let i = 0; i < GAFS.length; i++) {
        gafsButtons.push([bot.inlineButton(GAFS[i][0], {callback: '/' + action + i})]);
    }

    return bot.inlineKeyboard(gafsButtons);
}

function buildTeamsKeyboard(teams, action, gafIndex) {
    let teamsButtons = [];
    for(let k = 0; k < teams.length; k++) {
        teamsButtons.push([bot.inlineButton(teams[k], {callback: '/' + action + gafIndex + k})]);
    }

    return bot.inlineKeyboard(teamsButtons);
}

let _registerationMap = new Map();

bot.on('/start', msg => {
    if (_registerationMap.has(msg.from.id)) {
        const person = _registerationMap.get(msg.from.id);
        bot.sendMessage(msg.from.id, 'שלום ' + person.name + ' ! ', {replyMarkup: 'hide'});
        return;
    }

    let gafsKeyboard = buildGafsKeyboard('gaf');

    let person = {id: -1, name: ''};
    person.id = msg.from.id;
    person.name = msg.from.first_name + " " + (msg.from.last_name || "");
    _registerationMap.set(person.id, person);
    bot.sendMessage(msg.from.id, 'נעים מאוד! מאיזה גף אתה?',{replyMarkup: gafsKeyboard});

});

for(let i = 0; i < GAFS.length; i++) {
    let gaf = GAFS[i][0];
    bot.on('/gaf' + i, msg => {
        _registerationMap.get(msg.from.id).gaf = gaf;
        let teams = GAFS[i][1];
        let teamsKeyboard = buildTeamsKeyboard(teams, 'team', i);
        bot.sendMessage(msg.from.id, 'מאיזה צוות אתה ב' + GAFS[i][0] + '?', {replyMarkup: teamsKeyboard});
    });
}

for(let i = 0; i < GAFS.length; i++) {
    let teams = GAFS[i][1];
    for(let k = 0; k < teams.length; k++) {
        let team = teams[k];
        bot.on('/team' + i + k, msg => {
            _registerationMap.get(msg.from.id).team = team;
            bot.sendMessage(msg.from.id, 'ברוך הבא לצוות ' + team + '. \nבאפשרותך להקליד ״תפריט״ לקבלת אפשרויות השימוש');
        });
    }
}

const replayOptions = {
    OFFICE: {name: "במשרד", answer: 'רק גובניקים אומרים משרד :)'},
    VACATION: {name: "בחופש", answer: 'סליחה על ההפרעה, תהנה בחופשה!'},
    COURSE: {name: "בקורס", answer: 'יפה לך, תהנה בקורס!'},
    DUTY: { name: "בתורנות", answer: 'תחזיק מעמד!'}
};

let dailyReport = {_isWaitingForAnswer: false};


let dateNow = new Date();
let dateOfSendingPrompt = new Date();

dateOfSendingPrompt.setHours(HOUR_TO_SEND_STATUS_PROMPT);
dateOfSendingPrompt.setMinutes(MINUTE_TO_SEND_STATUS_PROMPT);
dateOfSendingPrompt.setSeconds(SECONDS_TO_SEND_STATUS_PROMPT);

if (dateNow > dateOfSendingPrompt) {
    // changing the date of sending the prompt to tomorrow
    dateOfSendingPrompt.setDate(dateNow.getDate() + 1);
}
//let timeToStartTheInterval = dateOfSendingPrompt - dateNow;

let dailyReportKeyboard = bot.keyboard([
    [replayOptions.OFFICE.name, replayOptions.DUTY.name],
    [replayOptions.VACATION.name, replayOptions.COURSE.name]
], {resize: true});

const DAY_IN_MS = 86400000;
let sendFormAtSpecifiedTime = () => {
    sendDailyReport();
    setInterval(sendDailyReport, DAY_IN_MS);
};

function sendDailyReport() {
    console.log("sendDailyReport");
    dailyReport._isWaitingForAnswer = true;
    let today = new Date().getDate();
    _registerationMap.forEach((person, chat_id) => {
        if (person.statusDay !== today) {
            person.status = 'לא עודכן';
            bot.sendMessage(chat_id, 'בוקר טוב ' + person.name + ', איפה אתה?', {replyMarkup: dailyReportKeyboard});
        }
    });
}

bot.on("text", msg => {
    if (dailyReport._isWaitingForAnswer) {

        function answer(option) {
            bot.sendMessage(msg.from.id, option.answer, {replyMarkup: 'hide'});
            dailyReport._isWaitingForAnswer = false;

            const person = _registerationMap.get(msg.from.id);
            if (person) {
                person.status = option.name;
                person.statusDay = new Date().getDate();
            }
        }

        switch (msg.text) {
            case replayOptions.COURSE.name:
            {
                answer(replayOptions.COURSE);
                break;
            }
            case replayOptions.DUTY.name:
            {
                answer(replayOptions.DUTY);
                break;
            }
            case replayOptions.OFFICE.name:
            {
                answer(replayOptions.OFFICE);
                break;
            }
            case replayOptions.VACATION.name:
            {
                answer(replayOptions.VACATION);
                break;
            }
        }
    }
});


bot.on(/דוח1/, msg => {
    let gafsKeyboard = buildGafsKeyboard('gafReport');
    bot.sendMessage(msg.from.id, 'נא לבחור גף:',{replyMarkup: gafsKeyboard});
});

for(let i = 0; i < GAFS.length; i++) {
    bot.on('/gafReport' + i, msg => {
        let teams = GAFS[i][1];
        let teamsKeyboard = buildTeamsKeyboard(teams, 'teamReport', i);
        bot.sendMessage(msg.from.id, 'נא לבחור צוות ב' + GAFS[i][0], {replyMarkup: teamsKeyboard});
    });
}

for(let i = 0; i < GAFS.length; i++) {
    let gaf = GAFS[i][0];
    let teams = GAFS[i][1];
    for(let k = 0; k < teams.length; k++) {
        let team = teams[k];
        bot.on('/teamReport' + i + k, msg => {
            buildReport(msg.from.id, gaf, team);
        });
    }
}

function buildReport(id, gaf, team) {
    let answer = false;
    _registerationMap.forEach((person) => {
        if(person.gaf === gaf && person.team === team) {
            answer = true;
            bot.sendMessage(id, person.name + ': ' + person.status);
        }
    });
    if(!answer) {
        bot.sendMessage(id, 'מה נסגר?! אף חבר צוות לא נרשם במערכת!');
    }
}


bot.on(/סטטוס/, msg => {
    const person = _registerationMap.get(msg.from.id);
    let today = new Date().getDate();
    if (person) {
        if (person.statusDay !== today) {
            person.status = 'לא עודכן';
        }
        msg.reply.text(person.status);
    }
    else {
        msg.reply.text("סורי, אתה לא רשום במערכת.. להרשמה הקש /start");
    }
});

bot.on(/עדכן/, msg => {
    let person = _registerationMap.get(msg.from.id);
    if(person) {
        let hour = new Date().getHours();
        if(hour >= 7 && hour < 11) {
            dailyReport._isWaitingForAnswer = true;
            person.status = 'לא עודכן';
            bot.sendMessage(msg.from.id, 'בוקר טוב ' + person.name + ', איפה אתה?', {replyMarkup: dailyReportKeyboard});
        }
        else if(hour > 10){
            msg.reply.text('עכשיו נזכרת..? חבל תהנה מהחופש');
        }else {
            msg.reply.text("Zzzz....");
        }
    }
    else {
        msg.reply.text("סורי, אתה לא רשום במערכת.. להרשמה הקש /start");
    }
});

bot.on(/תפריט/, msg => {
    msg.reply.text("עדכן - אפשרות עדכון הסטטוס היומי. ניתן לעדכן בין השעות 7 ל 11 בבוקר בלבד" +
        "\nסטטוס - קבלת מצב נוכחי אישי\n" +
        "דוח1 - קבלת דוח מפורט יומי");
});

console.log(timeToStartTheInterval);
setTimeout(sendFormAtSpecifiedTime, timeToStartTheInterval);

bot.start();