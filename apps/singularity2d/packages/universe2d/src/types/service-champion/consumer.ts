
import { CONTEXT } from "./context";

export interface iConsume<Data, Input, Output> {
    context: CONTEXT;
    input: (input: Input, data: Data) => Promise<void>;
    output: (output: Output) => Promise<void>;
    view?: (input: Input,step: string) => AsyncGenerator<Output,string,void>;
}
abstract class Consumer<Data, Input, Output> implements iConsume<Data, Input, Output> {
    context: CONTEXT;
    // registers context by provider for consumers
    input: (input: Input, data: Data) => Promise<void>;
    output: (output: Output) => Promise<void>;
    view?: (input: Input,step: string) => AsyncGenerator<Output,string,void>;
    constructor(context: CONTEXT) {
        this.context = context;
    }
}
export default Consumer;