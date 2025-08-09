import { readFileSync } from 'node:fs'
const marketplace = JSON.parse(readFileSync('./marketplace.json','utf-8'))
const asset = JSON.parse(readFileSync('./asset.json','utf-8'))
const service = JSON.parse(readFileSync('./service.json','utf-8'))
//const course = JSON.parse(JSON.stringify(readFileSync('./course.json','utf-8')))
//const knowledge = JSON.parse(readFileSync('./knowledge.json','utf-8'))

console.log("Marketplace 2D")
console.table({ ...marketplace.domain })
console.table({ ...marketplace.types })

console.log("Asset Manager")
console.table({ ...asset.domain })
console.table({ ...asset.types })
console.table({ ...asset.value })

console.log("Service Board")
console.table({ ...service.domain })
console.table({ ...service.types })

//console.log("Knowledge College")
//console.table({ ...knowledge.domain })
//console.table({ ...knowledge.types })
/*
console.log("Course")
console.table({ ...course.domain })
console.table({ ...course.types })
console.table({ ...course.value })
*/
