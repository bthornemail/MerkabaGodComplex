/* global Helia, BlockstoreCore, DatastoreCore, HeliaUnixfs */


// const chatContainer = document.getElementById("chatContainer");
const chatMessages = document.getElementById("chatMessages");
// const inputMessage = document.getElementById("inputMessage");
// const sendButton = document.getElementById("sendButton");
const commandManager = document.getElementById("command-manager");
const protocolView = document.getElementById("protocol-view");

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
async function getData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
document.addEventListener('DOMContentLoaded', async () => {
  const blockstore = await new BlockstoreCore.MemoryBlockstore()
  const dag = await HeliaDagJson.dagJson({ blockstore })
  const datastore = await new DatastoreCore.MemoryDatastore()
  const Key = InterfaceDatastore.Key
  function appendMessage(role, content) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(role);
    messageElement.innerHTML = content;
    messageElement.style.overflowWrap = 'break-word'
    chatMessages.appendChild(messageElement);
  }
  function appendCommand(role, content, command) {
    const messageElement = document.createElement("div");
    const commandButtonElement = document.createElement("button");
    messageElement.classList.add('command');
    commandButtonElement.classList.add('btn', 'btn-light');
    // messageElement.innerHTML = content;
    commandButtonElement.textContent = `${content}`;
    commandButtonElement.addEventListener('click', (ev) => {
      ev.preventDefault()
      postData("/command", {
        command: command
      }).then((data) => {
        alert(data);
        console.log(data); // JSON data parsed by `data.json()` call
        appendMessage('assistant', data.response)
        // const responseElement = document.createElement('div')
        // responseElement.innerHTML = data.response
        // chatMessages.appendChild(responseElement)
      });
    })
    messageElement.appendChild(commandButtonElement);
    chatMessages.appendChild(messageElement)
    commandManager.appendChild(messageElement);
  }
  function appendCommandMessage(role, content,command) {
    const messageElement = document.createElement("div");
    const messageContent = document.createElement("h6");
    const commandButton = document.createElement("button");
    messageElement.classList.add(role);
    messageElement.style.display = 'flex';
    messageElement.style.justifyContent= 'space-between';
    commandButton.classList.add('btn');
    commandButton.classList.add('btn-primary');
    commandButton.textContent = 'run'
    commandButton.addEventListener('click',command)
    messageContent.textContent = content;
    // messageElement.innerHTML = content;
    messageElement.appendChild(messageContent);
    messageElement.appendChild(commandButton);
    chatMessages.appendChild(messageElement);
    return {
      clear: () => {
        chatMessages.removeChild(messageElement)
      }
    }
  }
  function appendProtocol(role, content, command) {
    // const messageElement = document.createElement("div");
    const commandButtonElement = document.createElement("button");
    // messageElement.classList.add(role);
    commandButtonElement.classList.add('command', 'btn', 'btn-light');
    // messageElement.innerHTML = content;
    commandButtonElement.textContent = `Dial ${content}`;
    commandButtonElement.addEventListener('click', (ev) => {
      ev.preventDefault()
      postData("/command", {
        command: command
      }).then((data) => {
        alert(data);
        console.log(data); // JSON data parsed by `data.json()` call
        appendMessage('assistant', data.response)
        // const responseElement = document.createElement('div')
        // responseElement.innerHTML = data.response
        // chatMessages.appendChild(responseElement)
      });
    })

    // messageElement.appendChild(commandButtonElement);
    protocolView.style.display = 'flex'
    // protocolView.style.gridTemplateColumns = 'grid'
    protocolView.style.gap = '1rem'
    protocolView.appendChild(commandButtonElement);

  }
  getData("/commands").then((data) => {
    // alert(data);
    console.log(data, data); // JSON data parsed by `data.json()` call
    appendCommand('assistant', data.summary,()=>{
      postData('/command',{name:data.name})
    })
    // const responseElement = document.createElement('div')
    // responseElement.innerHTML = data.response
    // chatMessages.appendChild(responseElement)
  });
  // }) 
  const sse = new EventSource("/sse");
  // sse.addEventListener("message", ({ data }) => {
  //   console.log(data);
  //   appendMessage("assistant",data)
  //   // dag..put()
  // });
  // sse.onopen = () => {
  //   if (!localStorage.getItem("wallet")) {
  //     dialPad((data)=>{localStorage.setItem("wallet",data)}, { id: "#dialpad", defaultValue: "Enter Wallet Address" })
  //   }
  // }
  sse.addEventListener("blockstore", (e) => {
    const blockData = JSON.parse(e.data)
    console.log(Uint8Array.from(blockData.block));
    // blockstore.put([{key:blockData.cid["/"],value:Uint8Array.from(blockData.block)}])
    // blockstore.put({key:blockData.cid["/"],value:Uint8Array.from(blockData.block)})
    blockstore.put(blockData.cid["/"], Uint8Array.from(blockData.block))
    // appendMessage("assistant",e.data)
  });
  sse.addEventListener("chat-message", (e) => {
    console.log(e.data);
    console.log(JSON.parse(e.data));
    const blockData = JSON.parse(e.data)
    // // console.log(Uint8Array.from(blockData.block));
    // blockstore.put([{key:blockData.cid["/"],value:Uint8Array.from(blockData.block)}])
    appendMessage(blockData.role, blockData.content)
  });
  sse.addEventListener("chat-message-function", (e) => {
    console.log(e.data);
    console.log(JSON.parse(e.data));
    const blockData = JSON.parse(e.data)
    // // console.log(Uint8Array.from(blockData.block));
    // blockstore.put([{key:blockData.cid["/"],value:Uint8Array.from(blockData.block)}])
    appendCommandMessage(blockData.role, blockData.content, blockData.command)
    appendCommand(blockData.role, blockData.content, blockData.command)
  });
  sse.addEventListener("vault-node", (e) => {
    alert('vault_ai', e);
    console.log('vault_ai', e.data);
    console.log('vault_ai', JSON.parse(e.data));
    // const blockData = JSON.parse(e.data)
    // alert('vault_ai',JSON.stringify(e.data))
    // // console.log(Uint8Array.from(blockData.block));
    // blockstore.put([{key:blockData.cid["/"],value:Uint8Array.from(blockData.block)}])
    // appendProtocol(blockData.role, blockData.content, blockData.command)
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