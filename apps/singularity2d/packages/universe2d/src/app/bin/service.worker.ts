const tools: Record<string, Function> = {
    getDifference: (a: number, b: number) => a - b,
    waitSomeTime: () => new Promise(resolve => setTimeout(() => resolve("Waited 3 seconds"), 3000))
};

self.addEventListener("message", async (event: MessageEvent) => {
    const { queryMethod, queryMethodArguments, chatPrompt } = event.data;

    if (chatPrompt) {
        // Call Ollama API
        const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "mistral", // Change to your desired Ollama model
                prompt: chatPrompt,
                tools: Object.keys(tools).map(name => ({ name })) // Provide tool names
            })
        }).then(res => res.json());

        const toolToUse = response?.tool_calls?.[0]?.name;
        if (toolToUse && tools[toolToUse]) {
            const toolResult = await tools[toolToUse](...queryMethodArguments);
            event.source?.postMessage({ response: toolResult });
        } else {
            event.source?.postMessage({ response: response.text });
        }
    } else if (tools[queryMethod]) {
        // Manually invoke a tool
        const result = await tools[queryMethod](...queryMethodArguments);
        event.source?.postMessage({ response: result });
    }
});
