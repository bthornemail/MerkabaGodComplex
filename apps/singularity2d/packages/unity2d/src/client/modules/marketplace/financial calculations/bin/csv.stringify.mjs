import { stringify } from 'csv-stringify/sync';

// const output = stringify([
//   [ '1', '2', '3', '4' ],
//   [ 'a', 'b', 'c', 'd' ]
// ]);
export default function stringifyCSV(values){
    return stringify(values);
}