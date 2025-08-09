/* eslint-disable @typescript-eslint/no-explicit-any */
import mqtt from "mqtt"; // import namespace "mqtt"
import { useEffect, useState } from "react";


export default function useNetwork({ nodes, edges }: any) {
    const [client, setClient] = useState(mqtt.connect("ws://127.0.0.1:3883"));
    const [connectionStatus, setConnectStatus] = useState("");
    const [payload, setPayload] = useState({});
    const [record, setRecord] = useState(new Map());
    const [history, setHistory] = useState(new Map());
    const graph = {
        nodes: nodes ?? record,
        edges: edges ?? history
    };
    // const mqttConnect = (host: string, mqttOption: mqtt.IClientOptions | undefined) => {
    //     setConnectStatus('Connecting');
    //     setClient(mqtt.connect(host, mqttOption));
    // };
    useEffect(() => {
        if (!nodes) return;
        nodes.forEach((subscription: Map<string, string>, path: string, graph: Map<string, string>) => {
            // foodDeliverySubscriptions.forEach((subscription, path, graph) => {
            console.log({ path })
            console.log({ graph })
            console.log({ subscription })
            // const identity = subscription.get("identity")
            // console.log({ identity })
            // if (!identity) throw new Error("No Identity");
            // const content = subscription.get(identity)
            // console.log({ content })

            // if (path.endsWith("+")) {
            //     try {
            //         client.subscribe(path, (err) => {
            //             if (!err) {
            //                 const publish = subscription.get("publish")
            //                 if (publish) {
            //                     console.log("Subscribing to: ", { identity })
            //                     console.log("is Publishing to: ", { publish })
            //                     // client.publish(identity, publish);
            //                 }
            //             }
            //         });
            //     } catch (error: any) {
            //         throw new Error(error.message);
            //     }
            //     return;
            // }
            // if (path.endsWith("/")) {
            //     try {
            //         const publish = subscription.get("publish")
            //         if (publish) {
            //             console.log("Subscribing to: ", { identity })
            //             console.log("is Publishing to: ", { publish })
            //             client.publish(path, identity);
            //         }
            //     } catch (error: any) {
            //         throw new Error(error.message);
            //     }
            //     return;
            // }
            // // // console.log({topic:path})
            // console.log("Setting network content", { identity, content })
            // setRecord(record.set(identity, content))
            // graph.forEach((data) => {

            // })
        })
    }, [client, nodes, record])
    useEffect(() => {
        if (!edges) return;
        edges.forEach((subscription: Map<string, string>, path: string, graph: Map<string, string>) => {
            // foodDeliverySubscriptions.forEach((subscription, path, graph) => {
            // console.log({ path })
            // console.log({ graph })
            // console.log({ subscription })
            const identity = subscription.get("identity")
            // console.log({ identity })
            if (!identity) throw new Error("No Identity");
            const content = subscription.get(identity)
            console.log({ content })

            if (path.endsWith("+")) {
                try {
                    client.subscribe(path, (err) => {
                        if (!err) {
                            const publish = subscription.get("publish")
                            if (publish) {
                                console.log("Subscribing to: ", { identity })
                                console.log("is Publishing to: ", { publish })
                                // client.publish(identity, publish);
                            }
                        }
                    });
                } catch (error: any) {
                    throw new Error(error.message);
                }
                return;
            }
            if (path.endsWith("/")) {
                try {
                    const publish = subscription.get("publish")
                    if (publish) {
                        console.log("Subscribing to: ", { identity })
                        console.log("is Publishing to: ", { publish })
                        client.publish(path, identity);
                    }
                } catch (error: any) {
                    throw new Error(error.message);
                }
                return;
            }
            // // console.log({topic:path})
            console.log("Setting network content", { identity, content })
            setRecord(record.set(identity, content))
            // graph.forEach((data) => {

            // })
        })
    }, [client, nodes, record])
    useEffect(() => {
        if (client) {
            console.log(client);
            client.on('connect', () => {
                setConnectStatus('Connected');
            });
            client.on('error', (err) => {
                console.error('Connection error: ', err);
                // client.end();
            });
            client.on('reconnect', () => {
                setConnectStatus('Reconnecting');
            });
            client.on('message', (topic, message) => {
                const payload = { topic, message: message.toString() };
                setPayload(payload);
            });

            // client.on("connect", async () => {
            //     const foodDeliverySubscriptions = new Map([
            //         ["/food/delivery/brianthorne", await showLandingPage()],
            //         ["/food/delivery/brianthorne/+", await acceptOrdersPage()],
            //         ["/food/delivery/brianthorne/tacomells/+", await acceptOrdersPage()],
            //         ["/food/delivery/brianthorne/tacomells/keishathorne/+", await publishConfirmation()],
            //         ["/food/delivery/brianthorne/tacomells/keishathorne/:order/+", await transactionPage()]
            //     ])
            //     foodDeliverySubscriptions.forEach((subscription) => {
            //         // foodDeliverySubscriptions.forEach((subscription, path, graph) => {
            //         // console.log({subscription})
            //         const identity = subscription.get("identity")
            //         console.log({ identity })
            //         if (!identity) throw new Error("No Identity");
            //         const asset = subscription.get(identity)
            //         console.log({ asset })
            //         // console.log({topic:path})
            //         // console.log({graph:graph})
            //         // graph.forEach((data) => {
            //         //     if (path.endsWith("+")) {
            //         //         try {
            //         //             const identity = data.get("identity")
            //         //             console.log({ identity })
            //         //             if (!identity) throw new Error("No Identity");
            //         //             client.subscribe(identity, (err) => {
            //         //                 if (!err) {
            //         //                     const publish = data.get("publish")
            //         //                     if (publish) {
            //         //                         console.log("Subscribing to: ", { identity })
            //         //                         console.log("is Publishing to: ", { publish })
            //         //                         // client.publish(identity, publish);
            //         //                     }
            //         //                 }
            //         //             });
            //         //         } catch (error) {
            //         //             throw new Error(error);
            //         //         }
            //         //         return;
            //         //     }
            //         //     if (path.endsWith("/")) {
            //         //         try {
            //         //             const identity = data.get("identity")
            //         //             // console.log({ identity })
            //         //             if (!identity) throw new Error("No Identity");
            //         //             const publish = data.get("publish")
            //         //             if (publish) {
            //         //                 console.log("Subscribing to: ", { identity })
            //         //                 console.log("is Publishing to: ", { publish })
            //         //                 client.publish(identity, publish);
            //         //             }
            //         //         } catch (error) {
            //         //             throw new Error(error);
            //         //         }
            //         //         return;
            //         //     }

            //         // })
            //     })

            // });

            client.on("message", (topic, message) => {
                // message is Buffer
                console.log("Recieved Message", { topic }, { message: message.toString() });
                // client.end();
            });
        }
    }, [client]);
    // const mqttSub = (subscription: { topic: any; qos: any; }) => {
    //     if (client) {
    //         const { topic, qos } = subscription;
    //         client.subscribe(topic, { qos }, (error) => {
    //             if (error) {
    //                 console.log('Subscribe to topics error', error);
    //                 return;
    //             }
    //             setIsSub(true);
    //         });
    //     }
    // };
    // const mqttUnSub = (subscription: { topic: any; }) => {
    //     if (client) {
    //         const { topic } = subscription;
    //         client.unsubscribe(topic, error => {
    //             if (error) {
    //                 console.log('Unsubscribe error', error);
    //                 return;
    //             }
    //             setIsSub(false);
    //         });
    //     }
    // };
    // const mqttPublish = (context: { topic: any; qos: any; payload: any; }) => {
    //     if (client) {
    //         const { topic, qos, payload } = context;
    //         client.publish(topic, payload, { qos }, error => {
    //             if (error) {
    //                 console.log('Publish error: ', error);
    //             }
    //         });
    //     }
    // };
    // const mqttDisconnect = () => {
    //     if (client) {
    //         client.end(() => {
    //             setConnectStatus('Disconnected');
    //         });
    //     }
    // };
    // const client = mqtt.connect("mqtt://127.0.0.1"); // create a client
    return graph
}