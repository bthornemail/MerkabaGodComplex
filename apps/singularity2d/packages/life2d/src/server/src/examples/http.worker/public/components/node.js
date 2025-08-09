/* global Helia, BlockstoreCore, DatastoreCore, HeliaUnixfs */


const chatContainer = document.getElementById("chatContainer");
const chatMessages = document.getElementById("chatMessages");
const inputMessage = document.getElementById("inputMessage");
const sendButton = document.getElementById("sendButton");

document.addEventListener('DOMContentLoaded', async () => {
  const blockstore = await new BlockstoreCore.MemoryBlockstore()
  const dag = await HeliaDagJson.dagJson({ blockstore })
  const datastore = await new DatastoreCore.MemoryDatastore()
  const Key = InterfaceDatastore.Key

  function appendMessage(role, content) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(role);
    messageElement.innerHTML = content;
    chatMessages.appendChild(messageElement);
  }

  const sse = new EventSource("/sse");
  sse.addEventListener("message", ({ data }) => {
    console.log(data);
    appendMessage("assistant",data)
    // dag..put()
  });
  sse.addEventListener("blockstore", (e) => {
    const blockData = JSON.parse(e.data)
    console.log(Uint8Array.from(blockData.block));
    // blockstore.put([{key:blockData.cid["/"],value:Uint8Array.from(blockData.block)}])
    // blockstore.put({key:blockData.cid["/"],value:Uint8Array.from(blockData.block)})
    blockstore.put(blockData.cid["/"],Uint8Array.from(blockData.block))
    // appendMessage("assistant",e.data)
  });
  sse.addEventListener("chat-message", (e) => {
    // console.log(e.data);
    // console.log(JSON.parse(e.data));
    const blockData = JSON.parse(e.data)
    // // console.log(Uint8Array.from(blockData.block));
    // blockstore.put([{key:blockData.cid["/"],value:Uint8Array.from(blockData.block)}])
    appendMessage(blockData.role,blockData.content)
  });
  sse.addEventListener("pins", (e) => {
    console.log(e.data);
    console.log(JSON.parse(e.data));
    // const blockData = JSON.parse(e.data)
    // // console.log(Uint8Array.from(blockData.block));
    // blockstore.put([{key:blockData.cid["/"],value:Uint8Array.from(blockData.block)}])
    // appendMessage("assistant",e.data)
  });
  sse.addEventListener("cid", (e) => {
    console.log(e.data);
    console.log(e.data);
    // appendMessage("assistant",e.data)
  });

  sse.addEventListener("pin", (e) => {
    console.log(e.data);
    // appendMessage("assistant",e.data)
  }); 
  sse.addEventListener("dag", (e) => {
    console.log(e.data);
    // appendMessage("assistant",e.data)
  });

  sse.addEventListener("datastore", (e) => {
    console.log(e.data);
    // appendMessage("assistant",e.data)
  }); 
  // let _cid;
  // async function addData() {
  //   await datastore.put(new Key('awesome'), new TextEncoder().encode("Hello worlds"))
  //   // const value = await datastore.get(new Key('awesome'))
  //   // console.log('got content: %s', value.toString('utf8'))
  // }
  // await addData()
  // async function addFile() {
  //   const textEncoder = new TextEncoder()
  //   // const cid = await heliaFs.addFile({ content: textEncoder.encode('Hello world!') })
  //   const cid = await dag.add({ content: 'Hello world!' })
  //   _cid = cid.toString()
  //   console.log('successfully stored', cid.toString())
  // }
  // await addFile()
  // // async function catFile() {
  // //   const textDecoder = new TextDecoder()
  // //   for await (const data of heliaFs.cat('bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi')) {
  // //     console.log(textDecoder.decode(data))
  // //   }
  // // }
  // // await catFile()
  // async function getData() {
  //   const value = await datastore.get(new Key('awesome'))
  //   console.log('got content: %s', new TextDecoder().decode(value))
  // }
  // await getData()
  // async function getFile() {
  //   const textDecoder = new TextDecoder()
  //   const data = await dag.get(Multiformats.CID.parse(_cid))
  //   console.log(data)
  // }
  // await getFile()

})