import { readFileSync } from 'node:fs'
const asset = JSON.parse(readFileSync('./asset.json','utf-8'))
console.table(Object.entries(asset.types))
const domain = asset.domain
const { CIDv1, Asset, Registration } = asset.types
const { name, registration } = asset.value
console.table({ domain })
console.table({ CIDv1, Asset, Registration })
console.table({ name, registration })
