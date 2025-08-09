import { useState, useCallback } from "react";
import { useHelia } from "../broker/useLibp2p"
import { DEFINITION, DETAILS, DESCRIPTION, DATA } from "../../modules/hypergraph";

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const useSchema = () => {
  const { helia, fs, error, starting } = useHelia()
  const [definition, setDefinition] = useState<DEFINITION>();
  const [details, setDetails] = useState<DETAILS>();
  const [description, setDescription] = useState<DESCRIPTION>();
  const [data, setData] = useState<DATA>();

  const define = useCallback(async (text: string) => {
    if (!error && !starting) {
      try {
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [error, starting, helia, fs])
  const detail = useCallback(async (text: string) => {
    if (!error && !starting) {
      try {
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [error, starting, helia, fs])
  const describe = useCallback(async (text: string) => {
    if (!error && !starting) {
      try {
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [error, starting, helia, fs])
  const get = useCallback(async (text: string) => {
    if (!error && !starting) {
      try {
        // for await (const chunk of fs.cat(cid)) {
        //   text += decoder.decode(chunk, {
        //     stream: true
        //   })
        // }
        // setCommittedText(text){
//     codec: string;
//     hash: string;
//     bytes: ArrayBuffer;
//     index: number;
// }
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [error, starting, helia, fs])

  const set = useCallback(async (text: string) => {
    if (!error && !starting) {
      try {
        // const cid = await fs.addBytes(
        //   encoder.encode(text),
        //   helia.blockstore
        // )
        // setCid(cid)
        // setCidString(cid.toString())
        // console.log('Added file:', cid.toString())
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for helia to start')
    }
  }, [error, starting, helia, fs])

  return {
    define, detail, describe, data: { get, set } as const
  }
}