import mqtt from '/src/mqtt.esm.mjs'
import { Wallet } from "/src/ethers-5.1.esm.min.js";



document.addEventListener("DOMContentLoaded", async function () {
  const chatContainer = document.getElementById("chat-container");
  const chatMessageBox = document.getElementById("chat-messages-box");
  const chatMessages = document.getElementById("chat-messages");
  const inputMessage = document.getElementById("chat-input-message");
  const sendButton = document.getElementById("chat-send-button");
  const config = {
    port: 3883,
    username: '',
    password: '',
    clientId: Wallet.createRandom().address,
    keepalive: 60,
    clean: true,
    reconnectPeriod: 300000,
    connectTimeout: 30000,
    rejectUnauthorized: false,
  }
  const client = await  mqtt.connectAsync("mqtt://127.0.0.1", config);
  client.on("connect", async () => {
    try {
      await client.subscribeAsync("presence",{
        qos: 0,
        rap: false,
        rh: 0,
      });
      await client.publishAsync("presence", "Hello mqtt");
    } catch (error) {
      console.log('MQTT Subscribe to topics error', error);
      return;
    }
  });

  client.on("message", (topic, message) => {
    // message is Buffer
    console.log(topic);
    console.log(message.toString());
    const payloadMessage = { topic, message: new TextDecoder().decode(message) };
    
    appendMessage(topic, `<strong>${topic}</strong>
    <p>${message.toString()}</p>`)
    client.end();
  });


  fetch('/chat')
    .then(async (response) => {
      const { chat_history } = await response.json()
      console.log(chat_history);
      chat_history.forEach((message) => {
        appendMessage(message.role, message.content);
      });
    });

  // Event listener for send button click
  sendButton.addEventListener("click", function () {
    const message = inputMessage.value.trim();
    if (message) {
      sendMessage(message);
      inputMessage.value = "";
    }
  });

  // Event listener for input message on "Enter" key press
  inputMessage.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      sendButton.click();
    }
  });

  // Function to append a message to the chat container
  function appendMessage(role, content) {
    const messageElement = document.createElement("div");
    messageElement.id = (Math.random() * 100000000).toFixed();
    messageElement.classList.add(role);
    switch (role) {
      case "system":
      case "assistant":
        messageElement.style.width = "fit-content";
        messageElement.style.marginRight = "auto";
        break;
      default:
        messageElement.style.width = "fit-content";
        messageElement.style.marginLeft = "auto";
        break;
    }
    messageElement.innerHTML = content;
    chatMessages.appendChild(messageElement);
    inputMessage.focus()
    messageElement.scrollIntoView(true)
    return messageElement;
  }

  // Function to send a message to the chat bot
  async function sendMessage(message) {
    appendMessage("user", message);
    const element = appendMessage("system", "Sending message...");
    try {
      // Perform API call to the server with the message
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      const { chatHistory } = await response.json();
      // Get response back from chat server
      console.log(chatHistory);
      let appenedElement = appendMessage(chatHistory[chatHistory.length - 1].role, chatHistory[chatHistory.length - 1].content);
      element.hidden = true
      appenedElement.focus({ preventScroll: false })
    } catch (error) {
      console.error(error);
      appendMessage("system", "An error occurred while sending the message.");
    }
  }
  const unsubscribe = async (topic) => {
    if (client) {
      try {
        await client.subscribeAsync(topic, {
          qos: 0,
          rap: false,
          rh: 0,
        })
      } catch (error) {
        console.log('MQTT Unsubscribe error', error);
      }
    }
  };
  const subscribe = async (topic) => {
    if (client) {
      try {
        await client.subscribeAsync(topic, {
          qos: 0,
          rap: false,
          rh: 0,
        })
      } catch (error) {
        console.log('MQTT Unsubscribe error', error);
      }
    }
  };
});
