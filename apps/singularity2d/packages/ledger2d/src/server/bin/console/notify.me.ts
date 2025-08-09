import { readFileSync } from "fs";

export default async function notifyMe(title: string, body: string, options?: Record<string,string>) {
    // const svg = readFileSync(".../data/data/translation-svgrepo-com.svg",{encoding:"utf-8"})
    //  Click Listeners for user 
    // const url = new URL(icon,title);
    // console.debug(url.href)
    // return url.href
    console.log(`${title}\n${body}`);
    return;
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
};