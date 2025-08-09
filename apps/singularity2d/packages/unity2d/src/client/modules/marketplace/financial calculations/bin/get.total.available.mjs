export default function getTotalAmount(entries,query){
    return entries
    .reduce((accum,entry)=>{
        return accum + entry.Available
    },0);
}