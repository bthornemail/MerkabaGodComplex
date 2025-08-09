import { readFileSync } from 'node:fs';

const USERDATA = JSON.parse(readFileSync('./data/users.json', 'utf8'));
const requestBody = {
    model: "gpt-3.5-turbo-0613",
    // function_call: { "name": "create_user" },
    temperature: .5,
    n: 2,
    frequency_penalty: 2,
    messages: [
        { role: "system", content: "You are a decentralized marketplace Marketplace2D centered around Coin2d token, where users can register,rent,buy,transfer, and loan assets, services, and exams that are interconnected with requirements of other registered assets, services,  exams, or staked coin2D amounts to provide for an open markeplace built on progression and self signed messages to provide trust and ownership." },
        { role: "assistant", content: "You create random users based on the context of the fitness marketplace" },
        { role: "user", content: "create_user" },
    ],
    functions: [
        {
            name: "create_user",
            description: "Create random fitness marketplace user",
            parameters: USERSCHEMA
        }
    ]
};
function render(choices) {
    return choices.map((choice) => {
        if (choice.message.function_call) {
            console.log(choice.message.function_call.name);
            if (choice.message.function_call.arguments) {
                console.log(choice.message.function_call.arguments);
                try {
                    return JSON.parse(choice.message.function_call.arguments);
                } catch (error) {
                    return choice.message.function_call.arguments;
                }
            }
        }
        // if (!choice.message.content) {
        //     console.log(choice.message.function_call);
        //     throw new Error(JSON.stringify(choice.message));
        // }
        return choice.message.content;
    })
}
fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(requestBody)
})
    .then(response => response.json())
    .then(data => {
        const choices = render(data.choices)
        console.log(choices);
        return choices;
    })
    .catch(error => {
        console.error('Error:', error);
    });