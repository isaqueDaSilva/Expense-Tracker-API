export function getPreviousDate(numberOfPastDays: number): Date {
    const currentDate = new Date();

    const currentDay = currentDate.getDate();

    currentDate.setDate(currentDay - numberOfPastDays);

    return currentDate;
}