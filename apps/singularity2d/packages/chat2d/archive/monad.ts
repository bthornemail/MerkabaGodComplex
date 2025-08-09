import * as codec from '@ipld/dag-json'
import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'

async function encode(obj: any) {
  const buf = codec.encode(obj)
  const hash = await (sha256).digest(buf)
  const cid = CID.createV1(codec.code, hash)
  return cid.toString()
}
type SINGLETON = string
type FUNCTOR = (input: string) => string
type MONAD = (input: SINGLETON[],output:FUNCTOR) => Promise<string>

const brian: SINGLETON = "Brian"
const thorne: SINGLETON = "Thorne"
const sayHello: FUNCTOR = (input: SINGLETON) => {
  return "Hello " + input
}
const monad: MONAD = async function(input: SINGLETON[],output:FUNCTOR){
  return output(input.reduce((previousValue:string,currentValue: string,currentIndex: number,array: string[])=>{
    // if (previousValue === "") return output(currentValue)
    return output(currentValue)
  },""))
}
console.log(await monad([brian,thorne],sayHello))