export default function addTime(date: Date, days: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const millisecondsPerHour = 60 * 60 * 1000;
    const millisecondsPerMinute = 60 * 1000;
    const millisecondsPerSecond = 1000;

    const newDate = new Date(
        date.getTime() +
        days * millisecondsPerDay +
        hours * millisecondsPerHour +
        minutes * millisecondsPerMinute +
        seconds * millisecondsPerSecond
    );

    return newDate.toISOString();
}