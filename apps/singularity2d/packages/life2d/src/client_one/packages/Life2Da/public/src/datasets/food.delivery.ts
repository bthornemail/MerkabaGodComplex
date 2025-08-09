import mqtt from "mqtt"; // import namespace "mqtt"


async function showLandingPage() {
    return new Map([
        ["identity", "content"],
        ["content", "Landing Page"]])
}
async function acceptOrdersPage() {
    return new Map([
        ["identity", "form"],
        ["form", "Landing Page"]])
}
async function publishConfirmation() {
    return new Map([
        ["identity", "confirmation"],
        ["confirmation", "/food/delivery/brianthorne/tacomells/keishathorne/+"]])
}
async function transactionPage() {
    return new Map([
        ["identity", "graph"],
        ["graph", "/food/delivery/brianthorne/tacomells/keishathorne/:order/+"],
        // ["publish", "{nodes:{},links:{}}"],
    ])
}
const client = mqtt.connect("mqtt://127.0.0.1"); // create a client
client.on("connect", async () => {
    const foodDeliverySubscriptions = new Map([
        ["/food/delivery/brianthorne", await showLandingPage()],
        ["/food/delivery/brianthorne/+", await acceptOrdersPage()],
        ["/food/delivery/brianthorne/tacomells/+", await acceptOrdersPage()],
        ["/food/delivery/brianthorne/tacomells/keishathorne/+", await publishConfirmation()],
        ["/food/delivery/brianthorne/tacomells/keishathorne/:order/+", await transactionPage()]
    ])
    foodDeliverySubscriptions.forEach((subscription, path, graph) => {
        // console.log({subscription})
                    const identity = subscription.get("identity")
                    console.log({ identity })
                    if (!identity) throw new Error("No Identity");
                    const asset = subscription.get(identity)
                    console.log({asset})
        // console.log({topic:path})
        // console.log({graph:graph})
        // graph.forEach((data) => {
        //     if (path.endsWith("+")) {
        //         try {
        //             const identity = data.get("identity")
        //             console.log({ identity })
        //             if (!identity) throw new Error("No Identity");
        //             client.subscribe(identity, (err) => {
        //                 if (!err) {
        //                     const publish = data.get("publish")
        //                     if (publish) {
        //                         console.log("Subscribing to: ", { identity })
        //                         console.log("is Publishing to: ", { publish })
        //                         // client.publish(identity, publish);
        //                     }
        //                 }
        //             });
        //         } catch (error) {
        //             throw new Error(error);
        //         }
        //         return;
        //     }
        //     if (path.endsWith("/")) {
        //         try {
        //             const identity = data.get("identity")
        //             // console.log({ identity })
        //             if (!identity) throw new Error("No Identity");
        //             const publish = data.get("publish")
        //             if (publish) {
        //                 console.log("Subscribing to: ", { identity })
        //                 console.log("is Publishing to: ", { publish })
        //                 client.publish(identity, publish);
        //             }
        //         } catch (error) {
        //             throw new Error(error);
        //         }
        //         return;
        //     }

        // })
    })

});

client.on("message", (topic, message) => {
    // message is Buffer
    console.log("Recieved Message", { topic }, { message: message.toString() });
    // client.end();
});