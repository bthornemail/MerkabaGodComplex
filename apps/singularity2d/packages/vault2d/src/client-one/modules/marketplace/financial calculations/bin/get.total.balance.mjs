export default function getTotalBalance(entries,query){
    return entries
    .reduce((accum,entry)=>{
        return accum + entry.Balance
    },0);
}