import mqtt from "./src/js/mqtt.esm.mjs"//'src/mqtt.esm.mjs'
import { ethers, Wallet } from "./src/js/ethers-5.1.esm.min.js";
import { marked } from "./src/js/marked.esm.js";



document.addEventListener("DOMContentLoaded", async function () {
  const chatContainer = document.getElementById("chat-container");
  const chatMessageBox = document.getElementById("chat-messages-box");
  const chatTopicSelect = document.getElementById("chat-topic-select");
  const chatTopicInputButton = document.getElementById("chat-topic-input-button");
  const chatTopicOutputButton = document.getElementById("chat-topic-output-button");
  const chatTopicInput = document.getElementById("chat-topic-input");
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
  chatTopicInputButton.addEventListener("click", async () => {
    await subscribe(chatTopicInput.value);
    // alert("Subscribed to" + chatTopicInput.value)
    chatTopicInput.value = ""
  })
  chatTopicOutputButton.addEventListener("click", async () => {
    await unsubscribe(chatTopicSelect.value);
    chatTopicSelect.childNodes.forEach((node, index) => {
      if (node.value === chatTopicSelect.value) {
        chatTopicSelect.removeChild(node)
      }
    })
  })
  const client = mqtt.connect("mqtt://127.0.0.1", config);
  client.on("connect", () => {
    subscribe("presence").catch((error) => console.log(error))
  });
  async function unsubscribe(topic) {
    try {
      await client.unsubscribeAsync(topic)
      // chatTopicSelect.appendChild(topicElement);
      function notifyMe(message) {
        if (!("Notification" in window)) {
          // Check if the browser supports notifications
          alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
          // Check whether notification permissions have already been granted;
          // if so, create a notification
          const notification = new Notification(message);
          // …
        } else if (Notification.permission !== "denied") {
          // We need to ask the user for permission
          Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              const notification = new Notification(message);
              // …
            }
          });
        }
        // At last, if the user has denied notifications, and you
        // want to be respectful there is no need to bother them anymore.
      }
      notifyMe("Unsubscribed from topic: " + topic)
    } catch (error) {
      throw Error(error)
    }
    return;
  }
  async function subscribe(topic) {
    const topicElement = document.createElement("option")
    topicElement.value = topic
    topicElement.textContent = topic
    try {
      await client.subscribeAsync(topic)
      chatTopicSelect.appendChild(topicElement);
      await client.publishAsync("presence", "Hello mqtt");
      function notifyMe(message) {
        if (!("Notification" in window)) {
          // Check if the browser supports notifications
          alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
          // Check whether notification permissions have already been granted;
          // if so, create a notification
          const notification = new Notification(message);
          // …
        } else if (Notification.permission !== "denied") {
          // We need to ask the user for permission
          Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              const notification = new Notification(message);
              // …
            }
          });
        }
        // At last, if the user has denied notifications, and you
        // want to be respectful there is no need to bother them anymore.
      }
      notifyMe("Subscribed to topic: " + topic)
    } catch (error) {
      throw Error(error)
    }
    return;
  }
  client.on("message", (topic, message) => {
    // message is Buffer
    console.log(topic);
    console.log(message.toString());
    appendMessage("peer", `<img src="/src/images/user-data-svgrepo-com.svg" width="36">\n
    topic: ${topic}
    message: ${message.toString()}
    `)
  });


  fetch('/api/chat').then(async (response) => {
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
    if (event.keyCode === 13 && event.shiftKey) {
      sendButton.click();
    }
  });

  // Function to append a message to the chat container
  function appendMessage(role, content, data) {
    const messageElement = document.createElement("div");
    messageElement.id = (Math.random() * 100000000).toFixed();
    messageElement.classList.add(role);
    messageElement.style.textWrap = "break";
    messageElement.style.width = "max-content";
    messageElement.style.maxWidth = "100%";
    messageElement.style.marginTop = ".5rem";
    messageElement.style.marginBottom = ".5rem";
    // messageElement.style.display = "flex";
    messageElement.style.flexDirection = "column";
    // messageElement.style.alignItems = "center";
    messageElement.style.justifyContent = "center";
    const timeElement = document.createElement("sub");
    timeElement.textContent = `${data?.time ?? new Date().toLocaleString()}`
    timeElement.style.width = "fit-content";
    switch (role) {
      case "system":
        messageElement.style.margin = "auto";
        timeElement.textContent = `${messageElement.id}`
        break
      case "assistant":
        messageElement.style.marginRight = "auto";
        break;
      case "peer":
        messageElement.style.marginRight = "auto";
        break;
      default:
        messageElement.style.marginLeft = "auto";
        break;
    }
    timeElement.style.marginTop = "-.75rem";
    messageElement.innerHTML = marked.parse(content);
    messageElement.append(timeElement);
    messageElement.style.overflowWrap = "anywhere";
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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, topic: chatTopicSelect.value }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      const { chat_history } = await response.json();
      // Get response back from chat server
      console.log(chat_history);
      let appenedElement = appendMessage(chat_history[chat_history.length - 1].role, chat_history[chat_history.length - 1].content);
      element.hidden = true
      appenedElement.focus({ preventScroll: false })
    } catch (error) {
      console.error(error);
      appendMessage("system", "An error occurred while sending the message.");
    }
  }
});
