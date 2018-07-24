const DAY_IN_MS = 86400000;

function _getTimeToStartInterval(hours: number, minutes: number) {
    let dateNow: Date = new Date();
    let dateOfTheScheduledTime: Date = new Date();

    dateOfTheScheduledTime.setHours(hours);
    dateOfTheScheduledTime.setMinutes(minutes);

    if (dateNow > dateOfTheScheduledTime) {
        // changing the date of sending the prompt to tomorrow
        dateOfTheScheduledTime.setDate(dateNow.getDate() + 1);
    }

    return dateOfTheScheduledTime.getTime() - dateNow.getTime();
}

function _sendFormAtSpecifiedTime(callback: () => void) {
    callback();
    setInterval(()=>{callback()}, DAY_IN_MS);
}

export function schedule(callback: () => void, hours: number, minutes: number) {
    setTimeout(()=>{_sendFormAtSpecifiedTime(callback)}, _getTimeToStartInterval(hours, minutes));
}