import BlockNodeVectorDatabase from '../../VectorDb/vector.db.js';
const handleChat = async({command,input,vectorDb}:{command: string, input: any,vectorDb: BlockNodeVectorDatabase})=>{
    {
        const query = {
            role: "user",
            content: input
        };
        // console.log(command)
        // this.db.chatHistoryDb.ad.add(query, (doc:any) => {
        //     this.print(["bGPT:", command,doc]);
        // });
        console.log("bGPT:", command)
        await vectorDb.createDoc("bGPT:" + query.toString())
        console.log("bGPT:", query.toString())
        // const chatCompletionParams: OpenAI.Chat.ChatCompletionCreateParams = {
        // // const chatCompletionParams: any = {
        //     user: command,
        //     model: "gpt-3.5-turbo-16k-0613",
        //     messages: this.initMessages.concat(query),
        //     stream: this.streaming,
        // }
        // if (this.streaming) {
        //     // const stream: any = await openai.chat.completions.create(chatCompletionParams) as any;
        //     // // const stream: Stream<ChatCompletionChunk as any> = await openai.chat.completions.create(chatCompletionParams) as Stream<ChatCompletionChunk>;
        //     // for await (const part of stream) {
        //     //     process.stdout.write(part.choices[0]?.delta?.content || '');
        //     // }
        // } else {
        //     const chatCompletion: any = await openai.chat.completions.create(chatCompletionParams) as any;
        //     // const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(chatCompletionParams) as OpenAI.Chat.ChatCompletion;
        //     // this.db.chatHistoryDb.insert({
        //     //     metadata: {
        //     //         role: "bGPT",
        //     //         content: chatCompletion.choices[0].message?.content
        //     //     }, embedding: await this.db.vectorDb.createDoc(JSON.stringify(
        //     //         [
        //     //             query,
        //     //             {
        //     //                 role: "bGPT",
        //     //                 content: chatCompletion.choices[0].message?.content
        //     //             }
        //     //         ])
        //     //     )
        //     // }, () => {
        //     //     // this.say.speak(chatCompletion.choices[0].message?.content, "Alex", 1.5);
        //     //     console.log("bGPT:", chatCompletion.choices[0].message?.content)
        //     // });
        // }
    }
}
export default handleChat;