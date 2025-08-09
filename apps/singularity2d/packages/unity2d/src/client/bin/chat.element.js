class ChatElement {
  chatMessages
  fileUpload
  toggleAttachmentButton
  recordVideoButton
  recordAudioButton
  toggleRecordButton
  inputMessage
  sendButton
  toggleChatButton
  constructor(elementID = "chat-section") {
    const chatSection = document.getElementById(elementID);
    const chatContainer = this.chatMessages =  document.createElement("div");
    const chatMessages = this.chatMessages =  document.createElement("div");
    const chatMessage = document.createElement("div");

    const chatBar = document.createElement("div");
    const inputMessage = this.inputMessage = document.createElement("input");
    const fileUpload = this.fileUpload = document.createElement("input");
    const sendButton = this.sendButton = document.createElement("button");

    const toggleRecordButton = this.toggleRecordButton = document.createElement("button");
    const recordAudioButton = this.recordAudioButton = document.createElement("button");
    const recordVideoButton = this.recordVideoButton = document.createElement("button");


    const toggleChatButton = this.toggleChatButton = document.createElement("button");
    const toggleAttachmentButton = this.toggleAttachmentButton = document.createElement("button");
    
    
    // const canvasContainer = document.createElement("div");
    // const graph = document.createElement("div");
    
    const chatLogo = new Image(36, 36);
    chatLogo.src = "/src/images/chat.png";
    const attachmentLogo = new Image(36, 36);
    attachmentLogo.src = "/src/images/2192072-200.png";
    const recordLogo = new Image(36, 36);
    recordLogo.src = "/src/images/record.png";

    // const chatLogo = document.querySelector("#chat-icon"); //getElementById("chatMessages");
    // const attachmentLogo = document.querySelector("#attachment-icon"); //getElementById("chatMessages");
    // const recordLogo = document.querySelector("#record-icon"); //getElementById("chatMessages");
    // image.style.display = 'inherit';

    // canvasContainer.classList.add("canvas-container");

    chatContainer.classList.add("container");
    chatContainer.style.height = "90%";
    chatContainer.style.width = "90%";
    chatContainer.style.display = "flex";
    chatContainer.style.flexDirection = "column";
    chatContainer.style.justifyContent = "space-between";

    chatMessages.classList.add("container");  
    chatMessage.classList.add("system");
    chatMessage.height = "200px";

    chatBar.id = "chatBar";
    chatBar.classList.add("btn-group")

    // graph.id = "graph";

    inputMessage.type = "text";
    inputMessage.id = "chat-input-message";
    inputMessage.classList.add("form-control");
    inputMessage.classList.add("form-control-lg");
    inputMessage.placeholder = "Type your message...";

    fileUpload.type = "file";
    fileUpload.id = "file-upload";
    fileUpload.classList.add("form-control");
    fileUpload.classList.add("form-control-lg");
    fileUpload.placeholder = "Type your message...";

    toggleAttachmentButton.id = "attachemnt-button";
    toggleAttachmentButton.classList.add("btn");
    toggleAttachmentButton.classList.add("btn-lg");
    toggleAttachmentButton.classList.add("btn-outline-light");

    sendButton.id = "chat-send-button";
    sendButton.classList.add("btn");
    sendButton.classList.add("btn-primary");
    sendButton.textContent = "Send";

    toggleChatButton.id = "toggleChatButton";

    toggleChatButton.classList.add("btn")
    toggleChatButton.classList.add("btn-outline-light")


    toggleRecordButton.id = "record-button";
    toggleRecordButton.classList.add("btn");
    toggleRecordButton.classList.add("btn-lg");
    toggleRecordButton.classList.add("btn-outline-light");

    recordAudioButton.id = "record-audio-button";
    recordAudioButton.classList.add("btn");
    recordAudioButton.classList.add("btn-success");
    recordAudioButton.textContent = "Audio";

    recordVideoButton.id = "record-video-button";
    recordVideoButton.classList.add("btn");
    recordVideoButton.classList.add("btn-danger");
    recordVideoButton.textContent = "Video";

    //chatMessages.append(chatMessage)
    toggleAttachmentButton.append(attachmentLogo)
    toggleRecordButton.append(recordLogo)
    toggleChatButton.append(chatLogo)

    // File upload buttons
    chatBar.append(fileUpload)
    chatBar.append(toggleAttachmentButton)

    // Record buttons
    chatBar.append(recordVideoButton)
    chatBar.append(recordAudioButton)
    chatBar.append(toggleRecordButton)

    // Chat buttons
    chatBar.append(inputMessage)
    chatBar.append(sendButton)
    chatBar.append(toggleChatButton)

    fileUpload.style.display = 'none'
    
    recordVideoButton.style.display = 'none'
    recordAudioButton.style.display = 'none'

    inputMessage.style.display = 'none'
    sendButton.style.display = 'none'
    
    chatContainer.append(chatMessages)
    chatContainer.append(chatBar)
    // chatSection.innerHTML = chatContainer.innerHTML
    chatSection.append(chatContainer)
  }
}