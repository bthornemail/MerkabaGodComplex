import { HDNodeWallet } from 'ethers';
// import { HDNodeWallet, randomBytes, sha256 } from 'ethers';

export default async function ollamaChat(chatContainer: HTMLDivElement =  document.getElementById("chat-container") as HTMLDivElement){
    let clientID = HDNodeWallet.createRandom().extendedKey;
    const chatForm = document.createElement("form");
    chatForm.classList.add("form", "container", "input-group");
    chatContainer.append(chatForm);
    const messgeInput = document.createElement("input");
    messgeInput.placeholder = "Message";
    messgeInput.classList.add("form-control")
    chatForm.append(messgeInput);
    const button = document.createElement("button");
    button.innerText = "Send"
    chatForm.append(button)
    // Send text to all users through the server
    async function sendText() {
        console.log("Sending messsge")
        // Construct a msg object containing the data the server needs to process the message from the chat client.
        const msg = {
            type: "message",
            text: messgeInput.value,//"first mesage",//(document.getElementById("text") as HTMLInputElement).value,
            id: clientID,
            date: Date.now(),
        };

        // Send the msg object as a JSON-formatted string.
        // socket.send(JSON.stringify(msg));

        const response = await fetch("http://localhost:8080/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(msg),
        });

        const wordList = document.getElementById("word-list")//  as HTMLLIElement;
        const li = document.createElement("li");
        const result = await response.json();
        li.textContent = result.content;
        wordList?.append(result.content);
        // Blank the text input element, ready to receive the next line of text from the user.
        messgeInput.value = "";
    }
    button.onclick = (e) => {
        e.preventDefault();
        sendText();
    }
};