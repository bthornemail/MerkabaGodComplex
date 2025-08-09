export default function getTotalCreditLimit(entries,query){
    return entries
    .reduce((accum,entry)=>{
        return accum + entry.Limit
    },0);
}