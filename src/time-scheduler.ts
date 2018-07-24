// 9:00
const HOUR_TO_SEND_STATUS_PROMPT: number = 9;
const MINUTE_TO_SEND_STATUS_PROMPT: number = 0;
const SECONDS_TO_SEND_STATUS_PROMPT: number = 0;


let dateNow: Date = new Date();
let dateOfSendingPrompt: Date = new Date();

dateOfSendingPrompt.setHours(HOUR_TO_SEND_STATUS_PROMPT);
dateOfSendingPrompt.setMinutes(MINUTE_TO_SEND_STATUS_PROMPT);
dateOfSendingPrompt.setSeconds(SECONDS_TO_SEND_STATUS_PROMPT);


if (dateNow > dateOfSendingPrompt) {
    // changing the date of sending the prompt to tomorrow
    dateOfSendingPrompt.setDate(dateNow.getDate() + 1);
}

let timeToStartTheInterval: number = dateOfSendingPrompt.getTime() - dateNow.getTime();


/*
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
*/


const DAY_IN_MS = 86400000;

export {timeToStartTheInterval};