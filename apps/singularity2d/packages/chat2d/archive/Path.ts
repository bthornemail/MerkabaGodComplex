import mqtt from 'mqtt'
import * as codec from '@ipld/dag-json'
import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'
import { Wallet } from '@ethersproject/wallet'
import Singleton from '../singularity/monad/Singleton';

var client = mqtt.connect('mqtt://life2d.com', {
  port: 1883,
  username: '',
  password: '',
})
let count = 0

async function encode(obj: any) {
  const buf = codec.encode(obj)
  const hash = await (sha256).digest(buf)
  const cid = CID.createV1(codec.code, hash)
  return cid.toString()
}
type SINGLETON = string
type FUNCTOR = (input: string) => string
type MONAD = (input: SINGLETON[], output: FUNCTOR) => Promise<string>
const singleton: SINGLETON = "Hello"
const functor: FUNCTOR = (input: SINGLETON) => {
  return "Hello" + input
}
const monad: MONAD = async function (input: SINGLETON[], output: FUNCTOR) {
  return input.reduce((previousValue: string, currentValue: string, currentIndex: number, array: string[]) => {
    if (previousValue === "") return output(currentValue)
    return output(previousValue)
  }, "")
}
// const functor = async (input: PERCEPTRON) => {
//   return Function(await monad(input))
// }
const singulatiry = () => {
  const wallet: Wallet = Wallet.createRandom()
  const singletons = new Map<string, string>([["", wallet.address]])
  const functors = new Map<SINGLETON, FUNCTOR>([[singleton, functor]])
  const definitions = new Map()
  async function* observe(path: string, observation: (view: string) => Promise<string>) {
    console.log("observing")
    const paths = path.split("/");
    let update = {}
    for await (const path of paths) {
      const cid = await encode(path)
      const data = singletons.get(cid.toString())
      if (!data) return;
      console.log({ data })
      let u: any = {}
      u[path] = data
      update = Object.assign({}, update, u)
      yield JSON.stringify(update);
    }
    return await observation(JSON.stringify(update))
  }
  async function* view(path: string, observation?: (view: string) => Promise<string>) {
    if (observation) return observe(path, observation);
    console.log("viewing")
    const paths = path.split("/");
    console.log({ paths })
    const functorPath = await encode(paths[0])
    console.log({ functorPath })
    const cid = await encode(functorPath)
    console.log({ cid })
    const functor = functors.get(cid);
    console.log({ functor })
    if (!functor) return await encode(paths[0]);
    console.log({ entries: functors.entries() })
    const observations: Record<string, string> = {}
    console.log({ observations })
    for await (const lexemes of paths.slice(1)) {
      console.log("viewing")
      const singleton = singletons.get(await encode(lexemes));
      console.log("viewing")
      if (singleton) {
        console.log("viewing")
        observations[lexemes] = singleton
        console.log("viewing")
        yield observations
      }
      console.log("viewing")
    }
    console.log("viewing")
    return await functor(JSON.stringify(observations));
  }
  async function* change(path: string, action?: (action: string) => Promise<string>) {
    if (!action) return definitions.get(await encode(path));
    const paths = path.split("/");
    for await (const path of paths) {
      yield (await action(path)).toString();
    }
  }
  async function identify(path: string, definition?: string) {
    path
    if (!definition) return singletons.get(await encode(path));
    return singletons.set(await encode(path), await encode(definition));
  }
  return {
    identify,
    view,
    change
  }
}
const getName = async (name: string) => name;

client.on('connect', function () {
  client.subscribe('user')
  client.subscribe('wallet')
  const wallet = Wallet.createRandom()
  let str = '';
  async function generate() {
    const Singularity = singulatiry()
    console.log(await Singularity.identify("my", "Brian Thorne"))
    console.log(await Singularity.identify("my/age", "38"))
    for await (const val of Singularity.view("my/name", getName)) {
      console.log({ val })
      str = str + val;
    }
    // for await (const val of Singularity.view("Brian/Name")) {
    //   console.log({ val })
    //   str = str + val;
    // }
    console.log("Hi, my name is", str);
    return str
  }

  generate();
  // client.publish(`user/${wallet.address}`)
  // client.publish(`wallet/${listingCID.toString()}`)
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