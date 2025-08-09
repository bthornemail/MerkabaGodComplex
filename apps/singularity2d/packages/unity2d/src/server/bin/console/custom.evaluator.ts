import { exec } from "node:child_process";
import { REPLEval } from "node:repl";
export type CUSTOM_EVALUATOR_PARAMS = { cmd: any, currentContext: any, filename: any, callback: (arg0: Error | null, arg1?: string | undefined) => void };
export default <REPLEval>function customEvaluator(line: string, context: any, _name: any, finish_callback: any): void {
    // console.log('context', context)
    // console.log('_name', _name) //idk
    // console.log('_callback', finish_callback)
    line = line.trim();
    switch (line) {
        case 'chat':
            console.log('with who')
            // console.log(line)
            // finish_callback(line)
            break;
        case 'javascript':
            // if (cmd === '.unix') {
            //     currentContext = 'unix';
            //     callback(null, 'Switched to Unix context');
            // } else {
            //     callback(null, eval(cmd));
            // }
            break;

        case 'unix':
            // if (cmd === '.js') {
            //     currentContext = 'javascript';
            //     callback(null, 'Switched to JavaScript context');
            // } else {
            //     exec(cmd, (error:any, stdout:any, stderr:any) => {
            //         if (error) {
            //             callback(error);
            //         } else {
            //             callback(null, stdout);
            //         }
            //     });
            // }
            break;

        default:
            // callback(new Error('Unknown context'));
            break;
    }
}
