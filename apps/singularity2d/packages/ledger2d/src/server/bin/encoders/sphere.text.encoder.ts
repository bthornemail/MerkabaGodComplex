import mqtt from "mqtt"; // import namespace "mqtt"

class Graph {
    nodes = new Map();
    links = new Map();
    constructor() {
        let client = mqtt.connect("mqtt://test.mosquitto.org")
        client.on("connect", () => {
            client.subscribe("0x:Marketplace2d/#", (err) => {
                client.publish("0x:Marketplace2d", "-1");
                client.publish("0x:Marketplace2d/Listing", "0");
                client.publish("0x:Marketplace2d/Listing/", "1");
                client.publish("0x:Marketplace2d/Listing/Qm", "2");
                client.publish("0x:Marketplace2d/Listing/Qm:0xSignature", "3");
                client.publish("0x:Marketplace2d/Listing/Qm:0xSignature/QmAsst", "4");
            })
            client.subscribe("Marketplace2d/#", (err) => {
                if (!err) {
                    client.publish("Marketplace2d/Listing", "0");
                    client.publish("Marketplace2d/Listing/", "1");
                    client.publish("Marketplace2d/Listing/Qm", "2");
                    client.publish("Marketplace2d/Listing:0x", "0");
                    client.publish("Marketplace2d/Listing/:0x", "1");
                    client.publish("Marketplace2d/Listing/Qm:0x", "2");
                }
            });
            console.log("")
        });

        client.on("message", (topic, message) => {
            const context = topic.trim().split(":") // local objects
            const paths = context.map((path: string) => path.trim().split(":"))
            console.log({ paths })
            switch (paths.length) {
              case 0:
                this.nodes.get(context[0]);
                console.log(0)
                break;
              case 1:
                console.log(1)
                break;
              case 2:
                console.log(2)
                break;
              case 3:
                console.log(3)
                break;
              default:
                console.log("all")
                break;
            }
            this.nodes.set(topic, message)
            // message is Buffer
            //console.log(topic, message.toString());
            //            console.log(this.data);
            // client.end();
        });
    }
};
(async () => {
    const graph = new Graph()


    function convertArrayBufferToFloat32Array(buffer) { // incoming data is an ArrayBuffer
        var incomingData = new Uint8Array(buffer); // create a uint8 view on the ArrayBuffer
        var i, l = incomingData.length; // length, we need this for the loop
        var outputData = new Float32Array(incomingData.length); // create the Float32Array for output
        for (i = 0; i < l; i++) {
            outputData[i] = (incomingData[i] - 128) / 128.0; // convert audio to float
        }
        return outputData; // return the Float32Array
    }

    function convertUint8ArrayToFloat32Array(incomingData) { // incoming data is a UInt8Array
        var i, l = incomingData.length;
        var outputData = new Float32Array(incomingData.length);
        for (i = 0; i < l; i++) {
            outputData[i] = (incomingData[i] - 128) / 128.0;
        }
        return outputData;
    }
    const msg = "Hello";
    console.log(msg)
    const text = new TextEncoder().encode(msg)
    console.log({ text })
    const hash = Float32Array.from(text, octet => (octet - 128) / 128)
    console.log({ hash })
    console.log(convertArrayBufferToFloat32Array(text))
    console.log(convertUint8ArrayToFloat32Array(text))
    const rehash = Uint8Array.from(hash, float => float * 128 + 128)
    console.log({ rehash })
    const retext = (new TextDecoder().decode(rehash))
    console.log({ retext })
})()
