import { Ollama } from 'ollama';
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

const Days = {
    "day-1": {
        model: "smollm2:135m",
        messages:
            [
                { role: 'user', content: 'Why is the sky blue?' }
            ]
    }
};
(async () => {
    async function* genesis() {
        for (const [day, chat] of Object.entries(Days)) {
            console.log(day, chat)
            const response = await ollama.chat(chat);
            console.log(day, chat, response)
            yield response.message.content;
        }
        return "four"
    }
    for await (const day of genesis()) {
        console.log(day);
    }
})();
