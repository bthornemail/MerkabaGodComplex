/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react"
import CustomFileInput from "./Custom.File.Input"
import useChat from "../hooks/useChat";
export default function ActionBar({ toggleChat, toggleContext }: any) {
  const chatFormMessage = useRef<HTMLInputElement>(null)
  // const [isChatting, setIsChatting] = useState(false)
  const {
    // isChatting,
    setIsChatting,
    // chatGraph,
    // currentChat,
    setTopic,
    sendMessage
  } = useChat({ graphData:{ nodes: [{ id: "0xBrian", name: "Brian" }],links:[{source: "0xBrian",target:"0xBrian"}]}})

  async function handleChatForm(event: any) {
    event.preventDefault()
    if (!chatFormMessage.current) return;
    console.log({ topic: "0x", message: chatFormMessage.current.value })
    await setTopic("0x");
    await sendMessage(chatFormMessage.current.value)
    chatFormMessage.current.value =  ""
  }
  function onChat(e: any) {
    setIsChatting(e.currentTarget.value)
  }
  
  return (<div className="input-group">
    <button className="btn btn-primary" onClick={toggleContext}>Context</button>
    <button className="btn btn-primary" onClick={toggleChat}>Chat</button>
    <CustomFileInput />
    <input type="text" className="form-control" ref={chatFormMessage} onChange={onChat} name="chat-form-message" />
    <button className="btn btn-primary" onClick={handleChatForm}>Submit</button>
  </div>)
}