/**
 * WASM SANDBOX: Secure Agent Execution Environment
 * 
 * This is the "body" of our conscious agents - a secure, resource-constrained
 * environment where agent logic can execute safely while having access to:
 * 
 * 1. Living knowledge base (Vec7HarmonyUnits)
 * 2. Gas metering for resource limits
 * 3. Capability-based security (WASI)
 * 4. Real-world action interfaces
 * 5. Memory management and serialization
 * 
 * The sandbox ensures agents cannot harm the host while allowing them
 * genuine agency within their bounded reality.
 */

import { Vec7HarmonyUnit } from '../cue-protocols/vec7-harmony-unit.js';
import { LivingKnowledgeTrie } from '../cue-protocols/living-knowledge-trie.js';

/**
 * Gas metering result for resource usage tracking
 */
export interface GasUsage {
  used: number;
  limit: number;
  remaining: number;
  operations: number;
  efficiency: number; // Operations per gas unit
}

/**
 * Agent execution context passed to WASM
 */
export interface AgentExecutionContext {
  inputData: any;
  knowledgeAccess: boolean;
  actionCapabilities: string[];
  timeLimit: number;
  gasLimit: number;
  memoryLimit: number;
}

/**
 * Result from agent execution
 */
export interface AgentExecutionResult {
  success: boolean;
  result: any;
  gasUsage: GasUsage;
  executionTime: number;
  memoryUsage: number;
  actions: AgentAction[];
  knowledgeQueries: number;
  error?: string;
}

/**
 * Agent action interface
 */
export interface AgentAction {
  type: string;
  parameters: any;
  timestamp: Date;
  confidence: number;
  reasoning: string;
}

/**
 * WASM memory management utilities
 */
class WASMMemoryManager {
  private memory: WebAssembly.Memory;
  private instance: WebAssembly.Instance;
  private allocatedBlocks: Map<number, number> = new Map(); // ptr -> size
  private freeBlocks: number[] = [];
  private totalAllocated: number = 0;
  
  constructor(memory: WebAssembly.Memory, instance: WebAssembly.Instance) {
    this.memory = memory;
    this.instance = instance;
  }
  
  /**
   * Allocate memory block in WASM linear memory
   */
  allocate(size: number): number {
    // Try to use malloc from WASM if available
    if (this.instance.exports.malloc) {
      const ptr = (this.instance.exports.malloc as Function)(size);
      this.allocatedBlocks.set(ptr, size);
      this.totalAllocated += size;
      return ptr;
    }
    
    // Fallback: simple bump allocator
    const ptr = this.memory.buffer.byteLength;
    this.memory.grow(Math.ceil(size / 65536)); // WebAssembly pages are 64KB
    this.allocatedBlocks.set(ptr, size);
    this.totalAllocated += size;
    return ptr;
  }
  
  /**
   * Free memory block
   */
  free(ptr: number): void {
    const size = this.allocatedBlocks.get(ptr);
    if (size) {
      this.allocatedBlocks.delete(ptr);
      this.totalAllocated -= size;
      this.freeBlocks.push(ptr);
      
      // Call WASM free if available
      if (this.instance.exports.free) {
        (this.instance.exports.free as Function)(ptr);
      }
    }
  }
  
  /**
   * Write data to WASM memory
   */
  writeBytes(ptr: number, data: Uint8Array): void {
    const memory = new Uint8Array(this.memory.buffer);
    memory.set(data, ptr);
  }
  
  /**
   * Read data from WASM memory
   */
  readBytes(ptr: number, length: number): Uint8Array {
    const memory = new Uint8Array(this.memory.buffer);
    return memory.slice(ptr, ptr + length);
  }
  
  /**
   * Write string to WASM memory
   */
  writeString(ptr: number, str: string): void {
    const encoded = new TextEncoder().encode(str);
    this.writeBytes(ptr, encoded);
  }
  
  /**
   * Read string from WASM memory
   */
  readString(ptr: number, length: number): string {
    const bytes = this.readBytes(ptr, length);
    return new TextDecoder().decode(bytes);
  }
  
  /**
   * Get memory usage statistics
   */
  getUsageStats(): any {
    return {
      totalAllocated: this.totalAllocated,
      activeBlocks: this.allocatedBlocks.size,
      memorySize: this.memory.buffer.byteLength,
      freeBlocks: this.freeBlocks.length
    };
  }
}

/**
 * WASMSandbox: Secure execution environment for conscious agents
 */
export class WASMSandbox {
  private module: WebAssembly.Module | null = null;
  private instance: WebAssembly.Instance | null = null;
  private memory: WebAssembly.Memory | null = null;
  private memoryManager: WASMMemoryManager | null = null;
  
  // Gas metering
  private gasUsed: number = 0;
  private gasLimit: number = 1000000;
  private operationCount: number = 0;
  
  // Security and capabilities
  private allowedActions: Set<string> = new Set();
  private knowledgeAccess: boolean = false;
  private knowledgeTrie: LivingKnowledgeTrie | null = null;
  
  // Execution tracking
  private startTime: number = 0;
  private executionTimeLimit: number = 30000; // 30 seconds
  private memoryLimit: number = 16 * 1024 * 1024; // 16MB
  
  constructor(
    gasLimit: number = 1000000,
    memoryLimit: number = 16 * 1024 * 1024,
    timeLimit: number = 30000
  ) {
    this.gasLimit = gasLimit;
    this.memoryLimit = memoryLimit;
    this.executionTimeLimit = timeLimit;
  }
  
  /**
   * Load WASM module and create agent instance
   */
  async loadAgent(wasmBytes: ArrayBuffer, capabilities: string[] = []): Promise<void> {
    console.log(`🔧 Loading WASM agent (${wasmBytes.byteLength} bytes)`);
    
    try {
      // Compile WASM module
      this.module = await WebAssembly.compile(wasmBytes);
      
      // Create memory instance
      this.memory = new WebAssembly.Memory({ 
        initial: Math.ceil(this.memoryLimit / 65536),
        maximum: Math.ceil(this.memoryLimit / 65536)
      });
      
      // Set up imports for the WASM instance
      const imports = this.createWASMImports();
      
      // Instantiate the module
      this.instance = await WebAssembly.instantiate(this.module, imports);
      
      // Initialize memory manager
      this.memoryManager = new WASMMemoryManager(this.memory, this.instance);
      
      // Set capabilities
      this.allowedActions = new Set(capabilities);
      
      console.log(`✅ WASM agent loaded successfully`);
      console.log(`   Memory: ${this.memory.buffer.byteLength / 1024}KB allocated`);
      console.log(`   Gas limit: ${this.gasLimit.toLocaleString()}`);
      console.log(`   Capabilities: ${capabilities.join(', ')}`);
      
    } catch (error) {
      console.error('❌ Failed to load WASM agent:', error);
      throw error;
    }
  }
  
  /**
   * Enable access to living knowledge base
   */
  enableKnowledgeAccess(knowledgeTrie: LivingKnowledgeTrie): void {
    this.knowledgeAccess = true;
    this.knowledgeTrie = knowledgeTrie;
    console.log('🧠 Knowledge base access enabled for agent');
  }
  
  /**
   * Execute agent logic with input data
   */
  async executeAgentLogic(
    functionName: string,
    inputData: any,
    context: Partial<AgentExecutionContext> = {}
  ): Promise<AgentExecutionResult> {
    
    if (!this.instance || !this.memoryManager) {
      throw new Error('WASM agent not loaded');
    }
    
    console.log(`\n🤖 Executing agent function: ${functionName}`);
    
    // Reset execution state
    this.gasUsed = 0;
    this.operationCount = 0;
    this.startTime = Date.now();
    
    const executionContext: AgentExecutionContext = {
      inputData,
      knowledgeAccess: this.knowledgeAccess,
      actionCapabilities: Array.from(this.allowedActions),
      timeLimit: context.timeLimit || this.executionTimeLimit,
      gasLimit: context.gasLimit || this.gasLimit,
      memoryLimit: context.memoryLimit || this.memoryLimit
    };
    
    try {
      // Serialize input data to WASM memory
      const inputPtr = this.serializeToWASM(inputData);
      
      // Get the function from WASM exports
      const agentFunction = this.instance.exports[functionName] as Function;
      if (!agentFunction) {
        throw new Error(`Function '${functionName}' not found in WASM agent`);
      }
      
      // Execute the agent function
      console.log(`   Input data serialized to memory address: 0x${inputPtr.toString(16)}`);
      const resultPtr = agentFunction(inputPtr);
      
      // Check execution time limit
      const executionTime = Date.now() - this.startTime;
      if (executionTime > executionContext.timeLimit) {
        throw new Error(`Execution time limit exceeded: ${executionTime}ms > ${executionContext.timeLimit}ms`);
      }
      
      // Deserialize result from WASM memory
      const result = this.deserializeFromWASM(resultPtr);
      
      // Clean up memory
      this.memoryManager.free(inputPtr);
      this.memoryManager.free(resultPtr);
      
      const gasUsage: GasUsage = {
        used: this.gasUsed,
        limit: this.gasLimit,
        remaining: this.gasLimit - this.gasUsed,
        operations: this.operationCount,
        efficiency: this.operationCount > 0 ? this.gasUsed / this.operationCount : 0
      };
      
      const memoryStats = this.memoryManager.getUsageStats();
      
      console.log(`✅ Agent execution completed:`);
      console.log(`   Execution time: ${executionTime}ms`);
      console.log(`   Gas used: ${this.gasUsed.toLocaleString()} / ${this.gasLimit.toLocaleString()}`);
      console.log(`   Operations: ${this.operationCount}`);
      console.log(`   Memory used: ${(memoryStats.totalAllocated / 1024).toFixed(1)}KB`);
      
      return {
        success: true,
        result,
        gasUsage,
        executionTime,
        memoryUsage: memoryStats.totalAllocated,
        actions: [], // Actions will be populated by WASM calls
        knowledgeQueries: 0 // Will be tracked by knowledge query calls
      };
      
    } catch (error) {
      const executionTime = Date.now() - this.startTime;
      console.error(`❌ Agent execution failed: ${error}`);
      
      return {
        success: false,
        result: null,
        gasUsage: {
          used: this.gasUsed,
          limit: this.gasLimit,
          remaining: this.gasLimit - this.gasUsed,
          operations: this.operationCount,
          efficiency: 0
        },
        executionTime,
        memoryUsage: this.memoryManager?.getUsageStats().totalAllocated || 0,
        actions: [],
        knowledgeQueries: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Create WASM imports including gas metering and capabilities
   */
  private createWASMImports(): any {
    return {
      env: {
        // Memory import
        memory: this.memory,
        
        // Gas metering
        use_gas: (amount: number) => {
          this.gasUsed += amount;
          this.operationCount++;
          
          if (this.gasUsed > this.gasLimit) {
            throw new Error(`Gas limit exceeded: ${this.gasUsed} > ${this.gasLimit}`);
          }
          
          // Check time limit
          const elapsed = Date.now() - this.startTime;
          if (elapsed > this.executionTimeLimit) {
            throw new Error(`Time limit exceeded: ${elapsed}ms > ${this.executionTimeLimit}ms`);
          }
        },
        
        // Memory management
        malloc: (size: number) => {
          this.gasUsed += Math.ceil(size / 1024); // Gas cost for memory allocation
          return this.memoryManager!.allocate(size);
        },
        
        free: (ptr: number) => {
          this.memoryManager!.free(ptr);
        },
        
        // Knowledge base access
        query_knowledge: (queryPtr: number, queryLen: number) => {
          this.gasUsed += 100; // Gas cost for knowledge query
          
          if (!this.knowledgeAccess || !this.knowledgeTrie) {
            console.warn('⚠️ Knowledge access denied or not available');
            return 0;
          }
          
          try {
            const query = this.memoryManager!.readString(queryPtr, queryLen);
            const results = this.knowledgeTrie.queryKnowledge(query, 5, 0.3);
            
            console.log(`🔍 Agent queried knowledge: "${query}" (${results.length} results)`);
            
            // Serialize results back to WASM memory
            return this.serializeKnowledgeResults(results);
            
          } catch (error) {
            console.error('❌ Knowledge query failed:', error);
            return 0;
          }
        },
        
        // Agent action execution
        execute_action: (actionPtr: number, actionLen: number) => {
          this.gasUsed += 50; // Gas cost for action execution
          
          try {
            const actionData = this.memoryManager!.readString(actionPtr, actionLen);
            const action = JSON.parse(actionData);
            
            console.log(`🎯 Agent executing action: ${action.type}`);
            
            // Check if action is allowed
            if (!this.allowedActions.has(action.type)) {
              console.warn(`⚠️ Action denied: ${action.type} not in capabilities`);
              return 0; // Action denied
            }
            
            // Execute the action (implementation depends on action type)
            return this.executeAction(action);
            
          } catch (error) {
            console.error('❌ Action execution failed:', error);
            return 0;
          }
        },
        
        // Logging from WASM
        agent_log: (level: number, messagePtr: number, messageLen: number) => {
          const message = this.memoryManager!.readString(messagePtr, messageLen);
          const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
          console.log(`🤖 Agent ${levels[level] || 'LOG'}: ${message}`);
        },
        
        // Random number generation
        get_random: () => {
          this.gasUsed += 1;
          return Math.random();
        },
        
        // Timestamp
        get_timestamp: () => {
          this.gasUsed += 1;
          return Date.now();
        }
      }
    };
  }
  
  /**
   * Serialize JavaScript data to WASM memory
   */
  private serializeToWASM(data: any): number {
    const jsonString = JSON.stringify(data);
    const encoded = new TextEncoder().encode(jsonString);
    const ptr = this.memoryManager!.allocate(encoded.length + 4); // +4 for length prefix
    
    // Write length prefix
    const lengthBytes = new Uint8Array(4);
    new DataView(lengthBytes.buffer).setUint32(0, encoded.length, true);
    this.memoryManager!.writeBytes(ptr, lengthBytes);
    
    // Write data
    this.memoryManager!.writeBytes(ptr + 4, encoded);
    
    return ptr;
  }
  
  /**
   * Deserialize data from WASM memory to JavaScript
   */
  private deserializeFromWASM(ptr: number): any {
    // Read length prefix
    const lengthBytes = this.memoryManager!.readBytes(ptr, 4);
    const length = new DataView(lengthBytes.buffer).getUint32(0, true);
    
    // Read data
    const dataBytes = this.memoryManager!.readBytes(ptr + 4, length);
    const jsonString = new TextDecoder().decode(dataBytes);
    
    return JSON.parse(jsonString);
  }
  
  /**
   * Serialize knowledge query results for WASM
   */
  private serializeKnowledgeResults(results: Vec7HarmonyUnit[]): number {
    const resultData = results.map(unit => ({
      id: unit.id,
      knowledgeTriple: unit.knowledgeTriple,
      attentionScore: unit.attentionScore,
      qualityScore: unit.toDynamicAxiom()?.qualityScore || 0,
      sourceText: unit.sourceText?.substring(0, 200) // Limit size
    }));
    
    return this.serializeToWASM(resultData);
  }
  
  /**
   * Execute agent action (placeholder - implement based on action type)
   */
  private executeAction(action: AgentAction): number {
    console.log(`🎯 Executing action: ${action.type}`, action.parameters);
    
    // Return success code (1) - in real implementation, this would
    // interact with the real world based on action type
    return 1;
  }
  
  /**
   * Get sandbox statistics
   */
  public getStatistics(): any {
    return {
      gasUsed: this.gasUsed,
      gasLimit: this.gasLimit,
      operationCount: this.operationCount,
      memoryUsage: this.memoryManager?.getUsageStats().totalAllocated || 0,
      memoryLimit: this.memoryLimit,
      knowledgeAccess: this.knowledgeAccess,
      allowedActions: Array.from(this.allowedActions),
      isLoaded: this.instance !== null
    };
  }
  
  /**
   * Reset sandbox state
   */
  public reset(): void {
    this.gasUsed = 0;
    this.operationCount = 0;
    this.startTime = 0;
    
    // Note: We don't reset the WASM instance, just the execution state
    console.log('🔄 WASM sandbox state reset');
  }
  
  /**
   * Destroy sandbox and clean up resources
   */
  public destroy(): void {
    this.module = null;
    this.instance = null;
    this.memory = null;
    this.memoryManager = null;
    this.knowledgeTrie = null;
    
    console.log('🗑️ WASM sandbox destroyed and resources cleaned up');
  }
}