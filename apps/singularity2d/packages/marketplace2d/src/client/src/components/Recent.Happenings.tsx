import { useEffect, useState } from "react"
// import { BROADCAST_MESSAGE } from "../provider/Broadcast.Provider"
import { useMqtt } from "../hooks/useMqtt"
// import { useBroadcast } from "../hooks/useBroadcast"
type PAYLOAD_MESSAGE_BROADCAST = { topic: string, message: { content:string } };
function RecentHappeningsMessage({ topic, message }: { topic: string, message: string }) {
    return (<div><p>{topic}:<br />{message}</p><hr /></div>)
}
export default function RecentHappenings() {
    const { payload } = useMqtt()
    // const { message } = useBroadcast()
    const [messages, setMesages] = useState<PAYLOAD_MESSAGE_BROADCAST[]>([])

    useEffect(() => {
        if (!payload) return
        // alert(JSON.stringify(payload))
        console.log({ payload })
        setMesages((messages) => [payload, ...messages])
    }, [payload])
    return (<div id="recent-happenings">
        <strong>Recent Happenings</strong>
        {
            messages.map((message: PAYLOAD_MESSAGE_BROADCAST) => {
                return <RecentHappeningsMessage topic={message.topic} message={message.message.content} />
            })
        }
        {/* <RecentHappeningsMessage topic={message.topic} message={message.message?.content} /> */}
        <style>{`
        #recent-happenings {
            height: 5rem;
            overflow-y: auto;
        }
        `}</style>
    </div>)
}