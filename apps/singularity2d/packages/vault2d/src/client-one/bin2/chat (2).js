document.addEventListener("DOMContentLoaded", () => {
  const chatEl = new ChatElement()
  
  chatEl.sendButton.addEventListener("click", function () {
    const message = chatEl.inputMessage.value.trim();
    if (message) {
      sendMessage(message);
      chatEl.inputMessage.value = "";
    }
  });
  chatEl.fileUpload.addEventListener('change', function (e) {
    var fileName = e.target.files[0].name;
    // Do something with the file name, like displaying it somewhere
    alert("File chosen: " + fileName);
  });
  chatEl.toggleAttachmentButton.addEventListener('click', (e) => {
    chatEl.fileUpload.style.display === 'none'
      ? chatEl.fileUpload.style.display = 'block'
      : chatEl.fileUpload.style.display = 'none'
  })

  chatEl.toggleRecordButton.addEventListener('click', (e) => {
      if (chatEl.recordVideoButton.style.display === 'none') {
        chatEl.recordAudioButton.style.display = 'block'
        chatEl.recordVideoButton.style.display = 'block'
      } else {
        chatEl.recordAudioButton.style.display = 'none'
        chatEl.recordVideoButton.style.display = 'none'
      }
  })
  chatEl.toggleChatButton.addEventListener('click', (e) => {
    if (chatEl.inputMessage.style.display === 'none') {
      chatEl.sendButton.style.display = 'block'
      chatEl.inputMessage.style.display = 'block'
    } else {
      chatEl.sendButton.style.display = 'none'
      chatEl.inputMessage.style.display = 'none'
    }
  })

  // Function to append a message to the chat container
  function appendMessage(role, content) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(role);
    messageElement.innerHTML = content;
    chatEl.chatMessages.appendChild(messageElement);
  }
  // function appendCommand(role, content, command) {
  //   const messageElement = document.createElement("div");
  //   const messageContent = document.createElement("p");
  //   const commandButton = document.createElement("button");
  //   messageElement.classList.add(role);
  //   commandButton.classList.add('btn btn-primary');
  //   commandButton.textContent = 'btn btn-primary'
  //   messageContent.textContent = content;
  //   // messageElement.innerHTML = content;
  //   messageElement.appendChild(messageContent);
  //   messageElement.appendChild(commandButton);
  //   chatMessages.appendChild(messageElement);
  //   return {
  //     clear: () => {
  //       chatMessages.removeChild(messageElement)
  //     }
  //   }
  // }
  function appendNotification(role, content) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(role);
    messageElement.innerHTML = content;
    chatEl.chatMessages.appendChild(messageElement);
    return {
      clear: () => {
        chatEl.chatMessages.removeChild(messageElement)
      }
    }
  }

  // Function to send a message to the chat bot
  async function sendMessage(message) {
    appendMessage("user", message);
    try {
      const notification = appendNotification("system", "Sending message...");
      // Perform API call to the server with the message
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      notification.clear()
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      // const data = await response.json();
      // console.log({data})
      // appendMessage("assistant", data.response);

    } catch (error) {
      console.error(error);
      appendMessage("system", "An error occurred while sending the message.");
    }
  }
  var es = new EventSource('/sse');

  es.addEventListener("message", ({ data }) => {
    console.log("message", data);
  });

  es.addEventListener("chat-message", ({ data }) => {
    console.log("chat-message", JSON.parse(data));
    const { role, content } = JSON.parse(data)
    appendMessage(role, content);
  });
});
