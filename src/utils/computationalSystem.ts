import { SystemFunctions } from '../types';
import { PureFunctionEngine } from './pureFunctions';
import { MCPAgent, MCP_TOOLS } from './llmIntegration';
import { log } from './consoleLogger';

export function harmonize(input: any): { id: string; h: number } {
  const s = JSON.stringify(input);
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return { id: `hv-${h.toString(16)}`, h };
}

export class CQEExecutionMapper {
  private cqe: {
    bind: (a: number[], b: number[]) => { bound: number[] };
    unbind: (b: number[], a: number[]) => number[];
  };

  constructor() {
    this.cqe = {
      bind: (a: number[], b: number[]) => ({
        bound: a.map((v, i) => v + (b[i] || 0))
      }),
      unbind: (b: number[], a: number[]) => b.map((v, i) => v - (a[i] || 0))
    };
  }

  compare(t1: number[], t2: number[]): { rmse: number; similarity: number } {
    const ml = Math.max(t1.length, t2.length);
    const p1 = [...t1, ...new Array(ml - t1.length).fill(0)];
    const p2 = [...t2, ...new Array(ml - t2.length).fill(0)];
    
    const { bound } = this.cqe.bind(p1, p2);
    const ub = this.cqe.unbind(bound, p1);
    
    let s = 0;
    for (let i = 0; i < ml; i++) {
      s += Math.pow((ub[i] || 0) - (p2[i] || 0), 2);
    }
    
    const rmse = Math.sqrt(s / ml);
    return { rmse, similarity: 1 / (1 + rmse) };
  }
}

export class RecursiveEncoder {
  private stack: Array<{ lambda: any; args: any[]; result?: any }>;

  constructor() {
    this.stack = [];
  }

  async execute(pipeline: any[], data: any): Promise<any> {
    let currentData = data;
    this.stack = [];
    
    for (const step of pipeline) {
      this.stack.push({ lambda: step, args: [currentData] });
      currentData = await step.implementation(currentData);
      this.stack[this.stack.length - 1].result = currentData;
    }
    
    return currentData;
  }

  getExecutionTrace(): number[] {
    return this.stack.map(s => harmonize(s).h);
  }
}

export const ALL_FUNCTIONS: SystemFunctions = {
  // Math functions
  initWithValue: { 
    description: 'Init w/ Value',
    category: 'Math',
    implementation: (data: any) => ({ ...data, value: data.value || 1 }) 
  },
  initWithEnergy: { 
    description: 'Init w/ Energy',
    category: 'Math',
    implementation: (data: any) => ({ ...data, energy: data.energy || 100 }) 
  },
  doubleValue: { 
    description: 'Double Value',
    category: 'Math',
    implementation: (data: any) => ({ ...data, value: (data.value || 0) * 2 }) 
  },
  halveValue: { 
    description: 'Halve Value',
    category: 'Math',
    implementation: (data: any) => ({ ...data, value: (data.value || 0) / 2 }) 
  },
  decayEnergy: { 
    description: 'Decay Energy',
    category: 'Math',
    implementation: (data: any) => ({ ...data, energy: (data.energy || 0) * 0.9 }) 
  },
  oscillate: { 
    description: 'Oscillate',
    category: 'Math',
    implementation: (data: any) => ({ 
      ...data, 
      value: parseFloat(Math.sin((data.phase || 0) + Date.now() / 1000).toFixed(2)) 
    })
  },
  
  // State functions
  setStateGrown: { 
    description: 'Set State: Grown',
    category: 'State',
    implementation: (data: any) => ({ ...data, state: 'Grown' }) 
  },
  setStateDecayed: { 
    description: 'Set State: Decayed',
    category: 'State',
    implementation: (data: any) => ({ ...data, state: 'Decayed' }) 
  },

  // Data processing functions
  pureMath: { 
    description: 'Pure Math',
    category: 'Data',
    implementation: (data: any) => {
      const engine = new PureFunctionEngine();
      const value = data.value || 0;
      const result = engine.compute('add', value, engine.compute('multiply', value, 2));
      return { ...data, value: result, computation: 'add(x, multiply(x, 2))' };
    }
  },
  pureCompose: { 
    description: 'Pure Compose',
    category: 'Data',
    implementation: (data: any) => {
      const engine = new PureFunctionEngine();
      const operations = [
        { function: 'multiply', args: [3] },
        { function: 'add', args: [10] },
        { function: 'sqrt' }
      ];
      const result = engine.composeChain(operations, data.value || 1);
      return { ...data, value: result, computation: 'sqrt(add(multiply(x, 3), 10))' };
    }
  },
  pureFilter: { 
    description: 'Pure Filter',
    category: 'Data',
    implementation: (data: any) => {
      const engine = new PureFunctionEngine();
      const arr = data.array || [1, 2, 3, 4, 5];
      const filtered = engine.compute('filter', (x: number) => x > 2, arr);
      return { ...data, array: filtered, computation: 'filter(x > 2)' };
    }
  },
  pureReduce: { 
    description: 'Pure Reduce',
    category: 'Data',
    implementation: (data: any) => {
      const engine = new PureFunctionEngine();
      const arr = data.array || [1, 2, 3, 4, 5];
      const sum = engine.compute('sum', arr);
      return { ...data, value: sum, computation: 'sum(array)' };
    }
  },

  // String processing functions
  reverseString: {
    description: 'Reverse String',
    category: 'String',
    implementation: (data: any) => {
      const str = data.text || data.value?.toString() || '';
      return { ...data, text: str.split('').reverse().join(''), operation: 'reverse' };
    }
  },
  upperCase: {
    description: 'Upper Case',
    category: 'String',
    implementation: (data: any) => {
      const str = data.text || data.value?.toString() || '';
      return { ...data, text: str.toUpperCase(), operation: 'uppercase' };
    }
  },
  wordCount: {
    description: 'Word Count',
    category: 'String',
    implementation: (data: any) => {
      const str = data.text || data.value?.toString() || '';
      const count = str.trim().split(/\s+/).length;
      return { ...data, wordCount: count, operation: 'wordcount' };
    }
  },

  // MCP Agent function
  mcpAgent: {
    description: 'MCP Agent',
    category: 'MCP',
    implementation: async (data: any) => {
      log("MCP Agent: Connecting to server...");
      
      let toolToCall = "convertDataToString"; // Fallback tool
      try {
        const agent = new MCPAgent();
        toolToCall = await agent.selectTool(data);
        log(`MCP Agent: LLM selected tool "${toolToCall}"`);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        log(`MCP Agent: LLM decision failed. Using fallback. Error: ${errorMessage}`);
      }
      
      log(`MCP Agent: Calling tool "${toolToCall}"...`);
      const toolResult = (MCP_TOOLS as any)[toolToCall](data);
      
      return { 
        ...data, 
        mcpResult: { toolCalled: toolToCall, result: toolResult }, 
        trace: harmonize({ toolToCall, toolResult }).h 
      };
    }
  },
};