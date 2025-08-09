document.addEventListener("DOMContentLoaded", function () {
  const chatContainer = document.getElementById("chatContainer");
  const chatMessages = document.getElementById("chatMessages");
  const inputMessage = document.getElementById("inputMessage");
  const sendButton = document.getElementById("sendButton");



  // fetch('/chat')
  //   .then(async (response) => {
  //     const { chat_history } = await response.json()
  //     console.log(chat_history);
  //     chat_history.slice(0, 3).forEach((message) => {
  //       appendMessage(message.role, message.content);
  //     });
  //   });
    fetch('/commands')
    .then(async (response) => {
      const commands = await response.json()
      console.log(commands);
      commands.forEach(({name,summary}) => {
        console.log(name,summary);
        appendCommand(`system`, name,summary);
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
    messageElement.classList.add(role);
    messageElement.innerHTML = content;
    chatMessages.appendChild(messageElement);
    return messageElement;
  }  
  // Function to append a command the chat container
  function appendCommand(role, name,summary) {
    const messageElement = document.createElement("div");
    const messageButtonElement = document.createElement("button");
    messageElement.classList.add(role);
    messageButtonElement.classList.add(["btn","btn-primary"]);
    messageElement.innerHTML = summary;
    messageButtonElement.innerHTML = name;
    messageElement.appendChild(messageButtonElement);
    chatMessages.appendChild(messageElement);
    return messageElement;
  }

  // Function to send a message to the chat bot
  async function sendMessage(message) {
    appendMessage("user", message);
    appendMessage("system", "Sending message...");
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

      const { chat_history } = await response.json();
      console.log(chat_history);
      const element = appendMessage(chat_history[chat_history.length].role, chat_history[chat_history.length].content);
      // const element = appendMessage("assistant", data.chat_history);
      element.hidden = true
    } catch (error) {
      console.error(error);
      appendMessage("system", "An error occurred while sending the message.");
    }
  }
});
