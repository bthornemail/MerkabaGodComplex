import { bright, red, reset } from "./consoleColors.js";
import createPeerId from "./create.peer.id.js";
import createPeerIdSync from "./create.peer.id.sync.js";
export default async function getPeerId({ privateKey, account, peerId, key }) {
  if (peerId) {
    console.log("Setting PeerId")
      return peerId;
    }
    if (account) {
      console.log("Setting PeerId")
      return account.peerId
    }
    if (privateKey) {
      console.log("Creating Private Key")
      return await createPeerId(privateKey);
    }
    if (key) {
      console.log("Creating Key")
      key && console.log(bright,red,key,"got key from options",reset);
      return await createPeerIdSync(key);
    }
    console.log("Generate")
    return createPeerId();
  }