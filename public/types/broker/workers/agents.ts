import { parentPort, workerData } from 'node:worker_threads';
import ollama from 'ollama';

const broadcastChannel = new BroadcastChannel("root");
broadcastChannel.onmessage = (event) => {
    workerData.messages.push({ role: 'assistant', content: event.data })
    console.log(`Agent ${workerData.name} received broadcast: `, event.data, workerData.messages)
}
// Listen for broadcast messages from the manager
// parentPort?.on('message', (message) => {
//     workerData.messages
//     // console.log(`Agent ${workerData.name} received message from manager: ${message}`);
// });
// This listener is for queries from the manager to a spefic model
parentPort?.on('message', async (message) => {
    if (message.query) {
        // console.log(workerData.model)
        // console.log(workerData.messages)
        try {
            const response = await ollama.generate({
                model: workerData.model,
                prompt: message.query,
                stream: false
            })
            console.log(response.response)
        } catch (error) {
            console.log(error)
        }
        return;
    }
    if (message.chat) {
        workerData.messages.push({role:"user",content:message.chat})
        try {
            const response = await ollama.chat({
                model: workerData.model,
                messages: workerData.messages,
                // stream: true
            })
            console.log(response.message.content)
        } catch (error) {
            console.log(error)
        }
        return;
    }
});
// // Simulate sending a message to the group
// setTimeout(() => {
//     parentPort?.postMessage(`Hello from Agent ${workerData.naame}`);
// }, Math.random() * 2000); // Random delay to simulate asynchronous behavior
