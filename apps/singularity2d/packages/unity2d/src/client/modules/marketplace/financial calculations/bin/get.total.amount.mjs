export default function getTotalAmount(entries,query){
    return entries
    .reduce((accum,entry)=>{
        let value = 0;
        if(entry.amount){ value = entry.amount}
        if(entry.Amount){ value = entry.Amount}
        return accum + value;
    },0);
}