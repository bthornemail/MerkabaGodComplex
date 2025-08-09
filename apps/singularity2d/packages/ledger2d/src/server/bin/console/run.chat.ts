import * as readline from 'readline';
const runChat =  async(rl: readline.Interface,processInput: (input:string)=>Promise<void>)=> {
    rl.on('line', async (line: string) => {
        if (['/exit', '/done'].includes(line.trim())) {
            console.log('Exiting...');
            rl.close();
            process.exit(0);       } else {
            await processInput(line);
        }
    });
}
export default runChat;