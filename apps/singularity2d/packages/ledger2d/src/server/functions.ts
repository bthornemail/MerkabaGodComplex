import { Configuration, OpenAIApi } from "openai";
import redis from "./utils/redis";
import { createSimpleTransaction } from "./types/financial/transaction";
import { error } from 'console';
import { createAccount } from "./types/financial/account";
const caFunctions: any = {
    create_ledger_account: createAccount,
    create_simple_transaction: createSimpleTransaction,
    get_current_weather: (data: any) => { console.log("get_current_weather function "); return data; },
    get_total_balance: async () => (
        await redis.mget(await redis
            .keys("ledger:account:*:balance")
        )).reduce((a, b) => {
            return a + parseFloat(b!)
        }
            , 0),

};
(async () => {

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    async function runChatFunctions(input: string) {
        return await openai.createChatCompletion({
            model: "gpt-3.5-turbo-16k-0613",
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
                },
                {
                    "name": "get_total_balance",
                    "description": "Get the total balance of all accounts",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "balance": {
                                "type": "number",
                                "description": "Balance of account",
                            },
                        },
                        "required": ["balance"],
                    },
                },
                {
                    "name": "create_simple_transaction",
                    "description": "Create a simple transaction",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "amount": {
                                "type": "number",
                                "description": "Amount of transaction",
                            },
                            "from": {
                                "type": "string",
                                "description": "From account",
                            },
                            "to": {
                                "type": "string",
                                "description": "To account"
                            }
                        },
                        "required": ["to", "from", "amount"],
                    },
                },
                {
                    "name": "create_ledger_account",
                    "description": "Create a ledger account",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "description": "Name of account",
                            },
                            "type": {
                                "type": "string",
                                "description": "type of account",
                            },
                            "balance": {
                                "type": "number",
                                "description": "Initial balance of account",
                            }
                        },
                        "required": ["name", "type", "balance"],
                    },
                }
            ],
            messages: [
                { role: "user", content: input }
            ],
        });
    }
    const chatCompletion = await runChatFunctions("can you create a new account and transaction for 100 from cash to chase");
    console.log(chatCompletion.data.choices[0].message);
    if (chatCompletion.data.choices[0].message && chatCompletion.data.choices[0].message?.function_call && chatCompletion.data.choices[0].message?.function_call.name) {
        console.log(chatCompletion.data.choices[0].message?.function_call)
        const f: any = await caFunctions[chatCompletion.data.choices[0].message.function_call.name](chatCompletion.data.choices[0].message?.function_call.arguments);
        console.log("Function Return:");
        const chatCompletion0 = await runChatFunctions("can you create fix this error: " + f);
        console.log(chatCompletion0.data.choices[0].message);
        if (f.error) {
            const chatCompletion = await runChatFunctions("can you create fix this error: " + f.error);
        };
        console.log(f);

    }
})()