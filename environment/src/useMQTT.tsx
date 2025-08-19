import PropTypes from 'prop-types'
import {
    useEffect,
    useState,
    useCallback,
    createContext,
    useContext,
    useRef
} from 'react'
import mqtt, { MqttClient } from 'mqtt'
// import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
// import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
export const MQTTContext = createContext<any>(null);

export const MQTTProvider = ({ children }: any) => {
    // const context = useMQTT({host:"127.0.0.1",port:3883,address:"root"})
    const context = useContext(MQTTContext)
    return (
        <MQTTContext.Provider value={context}>{children}</MQTTContext.Provider>
    )
}

// Libp2pProvider.propTypes = {
//     children: PropTypes.any
// }


const encoder = new TextEncoder()
const decoder = new TextDecoder()
export const useMQTT = ({ host, port, address }) => {
    const [client, setClient] = useState<MqttClient | null>(null)
    const [starting, setStarting] = useState<boolean>(true)
    const [error, setError] = useState<any>(null)
    const [isConnected, setIsConnected] = useState(false);
    const [topic, setTopic] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [subscriptions, setSubscriptions] = useState<Map<string, Set<string>>>(new Map());
    const [connections, setConnections] = useState<Map<string, any>>(new Map());
    const startMQTT = useCallback(async (url?: string) => {
        // console.info('libp2p already started',(await generate()).toString())
        if (client) {
        } else {
            try {
                const client = mqtt.connect(url ?? `ws://${host}:${port}`, {
                    port,
                    username: address,
                    password: address,
                    clientId: address,
                    // keepalive: 60,
                    clean: true,
                    reconnectPeriod: 300000,
                    connectTimeout: 30000,
                    rejectUnauthorized: false
                });
                setTopic(address);
                setClient(client);
                setStarting(false);
            } catch (e) {
                console.error(e)
                setError(true)
            }
        }
    }, [])

    useEffect(() => {
        startMQTT()
    }, [])
    useEffect(() => {
        if (!client) return;
        client.on("connect", () => {
            console.log(`Listening on mqtt://${host}:${port}`);
            // client.subscribe(`/${topic}/#`, (err) => {
            //     if (!err) {
            //         setInterval(() => {
            //             client.publish(`/status/${topic}`, JSON.stringify(address));
            //         }, 3000)
            //     }
            // });
            setStarting(false);
            setIsConnected(true);
        });

        client.on("message", async (topic, message) => {
            // message is Buffer
            if (topic.startsWith("/chat")) {
                console.log("Chat Message", topic, message.toString());
                return
            }
            if (topic.startsWith("/quick-tire-wash")) {
                console.log(topic, message);
                return
            }
            console.log(topic, message.toString());
            setMessage(message.toString());
            // client.end();
        });
    }, [client])
    const subscribe = (topic: string) => {
        if (!subscriptions.has(topic)) { subscriptions.set(topic, new Set()) };
        if (!client) return;
        return client.subscribe(`/${topic}/#`);
    }
    const register = (topic: string, callback: (...params: any[]) => Promise<any>) => {
        if (connections.has(topic) || subscriptions.has(topic)) throw new Error("Already Registered");
        setConnections((conections) => {
            try {
                const scheme1 = "web+local";
                const url1 = `/${topic}?key=%s`
                navigator.registerProtocolHandler(scheme1, url1);
                subscribe(topic);
            } catch (error) {
                console.warn(error);
                return conections;
            }
            conections.set(topic, callback);
            return conections;
        })
    }
    const publish = (topic: string, message: Record<string, any>) => {
        if (!client) return;
        client.publish(topic, JSON.stringify(message));
    }
    return {
        error, setError,
        starting,
        isConnected, subscriptions, connections, topic, message,
        connect: startMQTT, register, publish, subscribe
    }
}
