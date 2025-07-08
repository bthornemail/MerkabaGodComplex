
import { CONTEXT } from "../marketplace/context";

export interface iConsume<Data, Input, Output> {
    context: CONTEXT;
    input: (input: Input, data: Data) => Promise<void>;
    output: (output: Output) => Promise<void>;
    view?: (input: Input,step: string) => AsyncGenerator<Output,string,void>;
}
abstract class BaseConsumer<Data, Input, Output> implements iConsume<Data, Input, Output> {
    context: CONTEXT;//service: SERVICE;
    // registers context by provider for consumers
    input: (input: Input, data: Data) => Promise<void>;
    output: (output: Output) => Promise<void>;
    view?: (input: Input,step: string) => AsyncGenerator<Output,string,void>;
    constructor(context: CONTEXT) {
        this.context = context;
    }
}
class Consumer {
    context: CONTEXT;//service: SERVICE;
    // registers context by provider for consumers
        input: (input: any, data: any) => Promise<void>;
        output: (output: any) => Promise<void>;
        view?: (input: any,step: string) => AsyncGenerator<any,string,void>;
        constructor(context: CONTEXT) {
            this.context = context;
        }
}
export default Consumer;