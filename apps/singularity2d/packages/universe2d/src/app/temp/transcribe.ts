// Create WebSocket Connection
const ws = new WebSocket("ws://localhost:8888");

ws.onopen = () => {
    console.log("Opened")
};

// Create chat form
const chatForm = document.createElement("form");
chatForm.classList.add("form", "container", "input-group");
document.body.append(chatForm);

const messageInput = document.createElement("input");
messageInput.placeholder = "Message";
messageInput.classList.add("form-control");
chatForm.append(messageInput);

const button = document.createElement("button");
button.innerText = "Send";
chatForm.append(button);

chatForm.onsubmit = (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        ws.send(message); // Send text message to WebSocket server
        messageInput.value = ""; // Clear input field
    }
};

// WebSocket message handler
let chunks: BlobPart[] = [];
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.transcription) {
        console.log("Received Transcription:", data.transcription);

        // Convert transcription to an audio BLOB
        const blob = new Blob([data.transcription], { type: "text/plain" });
        chunks.push(blob);

        // Create audio URL and log it
        const audioURL = window.URL.createObjectURL(blob);
        console.log("Audio BLOB URL:", audioURL);
    }
};