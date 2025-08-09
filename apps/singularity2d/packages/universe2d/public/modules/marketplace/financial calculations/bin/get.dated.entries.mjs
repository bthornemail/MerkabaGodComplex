export default function getDateEntries(entries){
    return entries.map((entry)=>{
        return Object.assign({},entry,{date: new Date(entry.date)})
    });
}