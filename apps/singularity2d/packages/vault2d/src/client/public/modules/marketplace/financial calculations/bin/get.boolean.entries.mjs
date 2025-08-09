export default function getBooleanEntries(entries){
    return entries.map((entry)=>{
        let _isPaid = entry.isPaid !== "true" ? false : true
        return Object.assign({},entry,{isPaid: _isPaid})
    })
}