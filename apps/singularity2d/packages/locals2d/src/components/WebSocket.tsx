import { useEffect, useState } from "react";
import { useWs } from "../hooks/broker/useSocket";

export default function Socket() {
    //give an initial state so that the data won't be undefined at start
    const [bids, setBids] = useState([0]);

    const ws = new WebSocket("ws://127.0.0.1:8000");

    const apiCall = {
        event: "bts:subscribe",
        data: { channel: "order_book_btcusd" },
    };

    ws.onopen = (event) => {
        ws.send(JSON.stringify(apiCall));
    };

    ws.onmessage = function (event) {
        const json = JSON.parse(event.data);
        try {
            if ((json.event = "data")) {
                setBids(json.data.bids.slice(0, 5));
            }
        } catch (err) {
            console.log(err);
        }
    };
    //map the first 5 bids
    const firstBids = bids.map((item) => {
        return (
            <div>
                <p> {item}</p>
            </div>
        );
    });

    return <div>{firstBids}</div>;
}
export const WsComponent = () => {
    const {isReady, data, send}  = useWs({ url: "ws://127.0.0.1:8000" }) as any;

    useEffect(() => {
        if (isReady && send) {
            send("test message")
        }
    }, [isReady, send]) // make sure to include send in dependency array

    return (
        <div>
            Ready: {JSON.stringify(isReady)}, Data: {data}
        </div>
    )
}