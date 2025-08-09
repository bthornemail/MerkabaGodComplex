
import fs from 'fs';
import { parse } from 'csv-parse';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { rejects } from 'assert';

export default async function readCSV(path) {
    let csvString = new Promise((resolve, reject) => {
        const parser = parse({ delimiter: ',',cast: true,columns: true }, function (err, data) {
            if (err) { reject(err) };
            // console.log(data);
            resolve(data)
        });
        const __dirname = dirname(fileURLToPath(import.meta.url));
        fs.createReadStream(__dirname +"/.."+ path).pipe(parser);
    });
    return csvString;

}