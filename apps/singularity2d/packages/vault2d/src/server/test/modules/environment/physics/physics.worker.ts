import { parentPort, workerData } from 'node:worker_threads';
import ollama from 'ollama';
const { person, shape, properties, attributes, refereneces } = workerData;

const broadcastChannel = new BroadcastChannel("person");
broadcastChannel.onmessage = (event) => {
    workerData.messages.push({ role: 'assistant', content: event.data })
    console.log(`Person ${workerData.name} received broadcast: `, event.data, workerData.messages)
}
parentPort?.on('message', async (message) => {
    if (message.start) {
        try {
            // // Simulate sending a message to the group
            setTimeout(() => {
                shape.position.x += 0.01;
                shape.position.y += 0.01;
            }, Math.random() * 2000); // Random delay to simulate asynchronous behavior
        } catch (error) {
            console.log(error)
        }
        return;
    }
    if (message.status) {
        // console.log(person.name, shape.position.x, shape.position.y, shape.position.z);
        broadcastChannel.postMessage({name:person.name,position:[shape.position.x, shape.position.y, shape.position.z]});
        parentPort?.postMessage({ status: workerData });
        // workerData.messages.push({ status: "user", content: message.chat })
        return;
    }
});