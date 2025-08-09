// document.addEventListener("DOMContentLoaded", function () {
//     // const chatContainer = document.getElementById("chatContainer");
//     // const chatMessages = document.getElementById("chatMessages");
//     // const inputMessage = document.getElementById("inputMessage");
//     // const sendButton = document.getElementById("sendButton");



//     fetch('/commands')
//       .then(async (response) => {
//         const commands = await response.json()
//         console.log( commands);
//         // commands.slice(0,3).forEach((message) => {
//         //   appendMessage(message.role, message.content);
//         // });
//       });

//     // // Event listener for send button click
//     // sendButton.addEventListener("click", function () {
//     //   const message = inputMessage.value.trim();
//     //   if (message) {
//     //     sendMessage(message);
//     //     inputMessage.value = "";
//     //   }
//     // });

//     // // Event listener for input message on "Enter" key press
//     // inputMessage.addEventListener("keyup", function (event) {
//     //   if (event.keyCode === 13) {
//     //     sendButton.click();
//     //   }
//     // });

//     // // Function to append a message to the chat container
//     // function appendMessage(role, content) {
//     //   const messageElement = document.createElement("div");
//     //   messageElement.classList.add(role);
//     //   messageElement.innerHTML = content;
//     //   chatMessages.appendChild(messageElement);
//     // }

//     // // Function to send a message to the chat bot
//     // async function sendMessage(message) {
//     //   appendMessage("user", message);
//     //   appendMessage("system", "Sending message...");
//     //   try {
//     //     // Perform API call to the server with the message
//     //     const response = await fetch("/chat", {
//     //       method: "POST",
//     //       headers: {
//     //         "Content-Type": "application/json",
//     //       },
//     //       body: JSON.stringify({ message }),
//     //     });

//     //     if (!response.ok) {
//     //       throw new Error("Failed to send message");
//     //     }

//     //     const data = await response.json();
//     //     appendMessage("assistant", data.response);
//     //   } catch (error) {
//     //     console.error(error);
//     //     appendMessage("system", "An error occurred while sending the message.");
//     //   }
//     // }
//   });


class CommandManager extends HTMLElement {
  static observedAttributes = ["id", "key"];

  constructor() {
    // Always call super first in constructor
    super();
  }

  connectedCallback() {
    console.log("Custom element added to page.");
    const shadow = this.attachShadow({ mode: "open" });
    const mainDiv = document.createElement("div");
    mainDiv.setAttribute("class", "container");
    fetch('/commands')
      .then(async (response) => {
        const commands = await response.json()
        console.log(commands);
        commands.forEach((command) => {
          const cardDiv = document.createElement("div");
          cardDiv.setAttribute("class", "card");
          const h3 = document.createElement("h3");
          const p = document.createElement("p");
          const submitButton = document.createElement("button");
          h3.textContent = command.name
          p.textContent = command.summary
          submitButton.textContent = "Submit"
          submitButton.setAttribute("class", "btn");
          submitButton.setAttribute("class", "btn-outline-primary");
          // Attach the created elements to the shadow dom
          cardDiv.appendChild(h3);
          cardDiv.appendChild(p);
          cardDiv.appendChild(submitButton);
          mainDiv.appendChild(cardDiv);
        });
      });

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");

    console.log(style.isConnected);
    style.textContent = `
      .card {
        display: flex;
        flex-direction: column;
        padding: 20px;
        background-color: rgba(255, 255, 255, 0.5);
        // width: min-content;
        // height: min-content;
        border-radius: 8px;
        box-shadow: 0px 14px 28px rgba(0,0,0,0.25), 0px 10px 10px rgba(0,0,0,0.22);
      }
      .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        padding: 20px;
        background-color: rgba(255, 255, 255, 0.5);
        /* min-width: 60vw; */
        /* width: 500px; */
        width: min-content;
        max-width: 80vw;
        margin: 50px auto;
        /* min-height: 60vh; */
        max-height: 80vh;
        height: min-content;
        border-radius: 8px;
        box-shadow: 0px 14px 28px rgba(0,0,0,0.25), 0px 10px 10px rgba(0,0,0,0.22);
        overflow-y: auto;
      }
    .wrapper {
      position: relative;
    }

    .button {
      font-size: 0.8rem;
      width: 200px;
      display: inline-block;
      border: 1px solid black;
      padding: 10px;
      background: white;
      border-radius: 10px;
      opacity: 0;
      transition: 0.6s all;
      position: absolute;
      bottom: 20px;
      left: 10px;
      z-index: 3;
    }

    img {
      width: 1.2rem;
    }

    .icon:hover + .info, .icon:focus + .info {
      opacity: 1;
    }
    `;
    shadow.appendChild(mainDiv);
    shadow.appendChild(style);
    // document.querySelector('command-manager').appendChild(mainDiv)
    // document.querySelector('command-manager').appendChild(style)
    console.log(style.isConnected);
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }
  // Element functionality written in here
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}
customElements.define("command-manager", CommandManager);