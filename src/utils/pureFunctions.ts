import { PureFunctions, PureFunctionDefinition, ComputationHistoryEntry, Operation } from '../types';

export const PURE_FUNCTIONS: PureFunctions = {
  // Basic arithmetic pure functions
  add: (a: number, b: number): number => a + b,
  subtract: (a: number, b: number): number => a - b,
  multiply: (a: number, b: number): number => a * b,
  divide: (a: number, b: number): number => b !== 0 ? a / b : NaN,
  modulo: (a: number, b: number): number => a % b,
  power: (a: number, b: number): number => Math.pow(a, b),
  
  // Advanced mathematical functions
  sqrt: (x: number): number => Math.sqrt(x),
  abs: (x: number): number => Math.abs(x),
  floor: (x: number): number => Math.floor(x),
  ceil: (x: number): number => Math.ceil(x),
  round: (x: number): number => Math.round(x),
  sin: (x: number): number => Math.sin(x),
  cos: (x: number): number => Math.cos(x),
  tan: (x: number): number => Math.tan(x),
  log: (x: number): number => Math.log(x),
  exp: (x: number): number => Math.exp(x),
  
  // Array operations (pure)
  sum: (arr: number[]): number => arr.reduce((acc, val) => acc + val, 0),
  product: (arr: number[]): number => arr.reduce((acc, val) => acc * val, 1),
  max: (arr: number[]): number => Math.max(...arr),
  min: (arr: number[]): number => Math.min(...arr),
  mean: (arr: number[]): number => arr.length > 0 ? arr.reduce((a, b) => a + b) / arr.length : 0,
  
  // Functional combinators
  compose: (f: Function, g: Function) => (x: any) => f(g(x)),
  curry: (f: Function) => (a: any) => (b: any) => f(a, b),
  partial: (f: Function, ...args: any[]) => (...restArgs: any[]) => f(...args, ...restArgs),
  
  // Data transformation functions
  map: (fn: (value: any, index: number, array: any[]) => any, arr: any[]): any[] => arr.map(fn),
  filter: (predicate: (value: any, index: number, array: any[]) => boolean, arr: any[]): any[] => arr.filter(predicate),
  reduce: (fn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any, initial: any, arr: any[]): any => arr.reduce(fn, initial),
  
  // Logic functions
  and: (a: boolean, b: boolean): boolean => a && b,
  or: (a: boolean, b: boolean): boolean => a || b,
  not: (a: boolean): boolean => !a,
  equals: (a: any, b: any): boolean => a === b,
  greaterThan: (a: number, b: number): boolean => a > b,
  lessThan: (a: number, b: number): boolean => a < b,
};

export class PureFunctionEngine {
  private functions: PureFunctions;
  private computationHistory: ComputationHistoryEntry[];

  constructor() {
    this.functions = { ...PURE_FUNCTIONS };
    this.computationHistory = [];
  }

  // Register a new pure function
  registerFunction(name: string, fn: PureFunctionDefinition): boolean {
    if (typeof fn === 'function') {
      this.functions[name] = fn;
      return true;
    }
    return false;
  }

  // Compute with pure functions
  compute(functionName: string, ...args: any[]): any {
    if (this.functions[functionName]) {
      const result = this.functions[functionName](...args);
      this.computationHistory.push({
        function: functionName,
        args: args,
        result: result,
        timestamp: Date.now()
      });
      return result;
    }
    throw new Error(`Function ${functionName} not found`);
  }

  // Compose multiple functions
  composeChain(operations: Operation[], initialValue: any): any {
    return operations.reduce((value, op) => {
      return this.compute(op.function, value, ...(op.args || []));
    }, initialValue);
  }

  // Get computation history
  getHistory(): ComputationHistoryEntry[] {
    return [...this.computationHistory];
  }

  // Clear history
  clearHistory(): void {
    this.computationHistory = [];
  }

  // Get available functions
  getAvailableFunctions(): string[] {
    return Object.keys(this.functions);
  }
}