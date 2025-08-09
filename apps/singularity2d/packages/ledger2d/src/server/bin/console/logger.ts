import { isArray } from "util";
import { blue, green, magenta, reset, white, yellow } from "../../bin/console.colors";

const isText = (text: string, index: number) => {
    if (typeof text === 'string') {
        let colorMap = [yellow, white, green, blue, magenta]
        return console.log(colorMap[index], text, reset);
    }
}
export default function logger(text: any | any[]) {
    if(!text) return;
    if(text === "") return;
    if(typeof text === 'string'){
        isText(text,0)
        return;
    }
    if (Array.isArray(text)) {
        text.forEach((data, index) => {
            isText(data, index);
        })
        return;
    }

    Object.entries(text).forEach(([data,value], index: number) => {
        isText(data, 0);
        console.log(value);
    })
    // Object.fromEntries(text).forEach(([data,value], index: number) => {
    //     isText(data, index);
    //     isText(data, index + 1);
    // })
    return;
}