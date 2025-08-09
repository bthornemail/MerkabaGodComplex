export default function getRandomPort(min: number = 30000, max: number = 39999) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 