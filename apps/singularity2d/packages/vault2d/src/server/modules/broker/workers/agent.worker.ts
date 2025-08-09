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

            // parentPort?.postMessage({ 
            //     agent:workerData.name,
            //     messages: [...workerData.messages,{role:"system",content:response.response}]
            // });
            // console.log(response.response)
        } catch (error) {
            console.log(error)
        }
        return;
    }
    if (message.chat) {
        // workerData.messages.push({ role: "user", content: message.chat })
        try {
            const response = await ollama.chat({
                model: workerData.model,
                messages: [...workerData.messages, { role: "user", content: message.chat }],
                // stream: true
            })
            parentPort?.postMessage({
                agent: workerData.name,
                messages: [...workerData.messages, { role: "user", content: message.chat }, response.message]
            });
            // console.log(response.message.content)
        } catch (error) {
            console.log(error)
        }
        return;
    }
    if (message.status) {
        // const data = new Uint8Array(workerData.buffer, workerData.position, workerData.size);
        const views = workerData.nodes
        views.forEach(element => {
            // console.log(element);
            // console.log(element.dataView);
            // console.log("buffer", new TextDecoder().decode(element.dataView));
            const data = new Uint8Array(workerData.buffer, workerData.position, workerData.size);
            console.log(new TextDecoder().decode(data));
        });
        // Move the position forward
        // this.position += size;

        parentPort?.postMessage({ status: workerData });
        // workerData.messages.push({ status: "user", content: message.chat })
        return;
    }
});
// // Simulate sending a message to the group
// setTimeout(() => {
//     parentPort?.postMessage(`Hello from Agent ${workerData.naame}`);
// }, Math.random() * 2000); // Random delay to simulate asynchronous behavior
