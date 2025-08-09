import { Configuration, OpenAIApi } from "openai";

const caFunctions:any = {
    get_current_weather: (data: any)=>{ console.log("get_current_weather function ");return data; },
};
(async () => {

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        // description: "A bot to help you manage your finances",
        functions: [
            {
                "name": "get_current_weather",
                "description": "Get the current weather in a given location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "Summary of Transaction",
                        },
                        "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] },
                    },
                    "required": ["location"],
                },
            }
        ],
        messages: [{ role: "user", content: "what is he current weather in ls angeles" }],
    });
    console.log(chatCompletion.data.choices[0].message);
    if(chatCompletion.data.choices[0].message && chatCompletion.data.choices[0].message?.function_call && chatCompletion.data.choices[0].message?.function_call.name){
        console.log(chatCompletion.data.choices[0].message?.function_call)
        const f:any = await caFunctions[chatCompletion.data.choices[0].message.function_call.name](chatCompletion.data.choices[0].message?.function_call.arguments);
        console.log("Function Return:");
        console.log(f);
    }
})()