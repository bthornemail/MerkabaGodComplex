
import { parse } from 'csv-parse/sync';

// const input = `
// "key_1","key_2"
// "value 1","value 2"
// `;
// const records = parse(input, {
//   columns: true,
//   skip_empty_lines: true
// });
export default function parseCSV(csvString,options = {from: 1,columns: false}){
    return parse(csvString, {
        from: options.from,
        columns: options.columns,
        cast: options.columns ? true : false,
        skip_empty_lines: true
      });
}