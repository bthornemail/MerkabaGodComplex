import { useState, useCallback, use, useContext } from "react";
import { Libp2pContext, useLibp2p } from "../broker/useLibp2p";
import { DEFINITION, DETAILS, DESCRIPTION, DATA } from "../../types/types";
// import { uselibp2p } from "../broker/useLibp2p"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const useSchema = () => {
  const { libp2p, fs, error, starting } = useContext(Libp2pContext);
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
      console.log('please wait for libp2p to start')
    }
  }, [error, starting, libp2p, fs])
  const detail = useCallback(async (text: string) => {
    if (!error && !starting) {
      try {
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for libp2p to start')
    }
  }, [error, starting, libp2p, fs])
  const describe = useCallback(async (text: string) => {
    if (!error && !starting) {
      try {
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for libp2p to start')
    }
  }, [error, starting, libp2p, fs])
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
      console.log('please wait for libp2p to start')
    }
  }, [error, starting, libp2p, fs])

  const set = useCallback(async (text: string) => {
    if (!error && !starting) {
      try {
        // const cid = await fs.addBytes(
        //   encoder.encode(text),
        //   libp2p.blockstore
        // )
        // setCid(cid)
        // setCidString(cid.toString())
        // console.log('Added file:', cid.toString())
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log('please wait for libp2p to start')
    }
  }, [error, starting, libp2p, fs])

  return {
    define, detail, describe, data: { get, set } as const
  }
}