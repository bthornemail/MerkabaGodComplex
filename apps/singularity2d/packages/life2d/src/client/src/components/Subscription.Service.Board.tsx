import { MqttClient } from "mqtt";
import { useEffect, useState } from "react"
export default function SubscriptionServiceBoard({ client }: {client: MqttClient}) {
    const [message,setMessage] = useState("")
    const [topic,setTopic] = useState("")


    client.on("message", (topic, message) => {
        // message is Buffer
        setTopic(topic);
        setMessage(message.toString());
        // client.end();
    });
    
    useEffect(()=>{
    const serviceBoardPaths = new Set([
        "Person",
        "Wallet",
        "Peer",
        "Consumer",
        "Provider",
        "Observer",
        "Service",
        "Consumer",
        "Customer",
        "Order",
        "Consideration",
        "Confirmation",
        "Declaration",
        "Invoice",
        "Provider",
        "Contractor",
        "Contract",
        "Fulfillment",
        "Resolution",
        "Service",
        "Proposal",
        "Agreement",
        "App",
        "Marketplace",
        "Board",
        "Listing"
      ])
      for(const Singleton of serviceBoardPaths){
        client.setMaxListeners(serviceBoardPaths.size + 1)
        client.subscribe(Singleton, (err) => {
          if (!err) {
            client.publish(Singleton, Singleton);
          }
        });
      }
    },[client])
  return <div>
     <div style={Object.assign({},{width:"2rem",height:"2rem",borderRadius:"50%"},client ? {color:"green"} : {color:"red"})}>{topic}:&nbsp;{message}</div>
    </div>
}