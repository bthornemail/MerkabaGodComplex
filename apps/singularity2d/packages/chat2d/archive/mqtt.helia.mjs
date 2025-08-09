import mqtt from 'mqtt'
import * as codec from '@ipld/dag-json'
import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'
import { Wallet } from 'ethers'

var client = mqtt.connect('mqtt://127.0.0.1', {
  // var client = mqtt.connect('mqtt://life2d.com', {
  port: 1883,
  username: '',
  password: '',
  clientId: Wallet.createRandom()
})
let count = 0
const wallet = Wallet.createRandom()

async function add (obj) {
  const buf = codec.encode(obj)
  const hash = await (sha256).digest(buf)
  const cid = CID.createV1(codec.code, hash)
  return cid
}
client.on('connect', function () {
  //   client.subscribe('Listings/+', async function (err) {
  //   if (!err) {      
  //     // Post to public lisitng 
  //     setInterval(async () => {
  //       const listing = {
  //         content: `${"\u{2B55}"}`,
  //         title: `${"Title"} ${count++}`,
  //         summary: `${"This is a summary"}`,
  //         imgSrc: `${"/src/images/online-shopping-ecommerce-svgrepo-com.svg"}`,
          // value: 100
  //       }
  //       const listingCID = await add(listing)
  //       client.publish(`Listings/${wallet.address}`, JSON.stringify(listing))
  //       client.publish(`Listing/${listingCID.toString()}`,wallet.signMessageSync(listingCID.toString()))
  //     }, Math.PI * 333)
  //     // Post to public lisitngs forum
  //     setInterval(() => {
  //     }, Math.PI * 1000)
  //   }
  // })
  client.subscribe('marketplace/listings', async function (err) {
    if (!err) {      
      // Post to public lisitng 
      setInterval(async () => {
        const listing = {
          content: `${"\u{2B55}"}${count++}`,
          title: `${"Title"} ${count++}`,
          summary: `${"This is a summary"}`,
          imgSrc: `${"/src/images/online-shopping-ecommerce-svgrepo-com.svg"}`,
          value: 100
        }
        const listingCID = await add(listing)
        // client.publish(`Listings/${listingCID.toString()}`,JSON.stringify(listing))
        client.publish(`marketplace/listings`,JSON.stringify(listing))
        client.publish(`marketplace/listings/${listingCID.toString()}`,JSON.stringify(listing))
      }, Math.PI * 333)
      // Post to public lisitngs forum
      setInterval(() => {
      }, Math.PI * 1000)
    }
  })
  // client.subscribe('Social_Media:heartbeat', function (err) {
  //   if (!err) {
  //     setInterval(() => {
  //       client.publish('Social_Media:heartbeat', JSON.stringify({
  //         content: `${"\u{2B55}"}(${count++})${"\u{2B55}"}`
  //       }))
  //     }, Math.PI * 1000)
  //   }
  // })
})
client.on('message', function (topic, message) {
  // message is Buffer
  try {
    console.log(topic, JSON.parse(message.toString()).content)
  } catch (error) {
    console.log(topic, message.toString())
  }
  //  client.end()
})