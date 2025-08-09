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
/**
 * WASM memory management utilities
 */
class WASMMemoryManager {
    constructor(memory, instance) {
        this.allocatedBlocks = new Map(); // ptr -> size
        this.freeBlocks = [];
        this.totalAllocated = 0;
        this.memory = memory;
        this.instance = instance;
    }
    /**
     * Allocate memory block in WASM linear memory
     */
    allocate(size) {
        // Try to use malloc from WASM if available
        if (this.instance.exports.malloc) {
            const ptr = this.instance.exports.malloc(size);
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
    free(ptr) {
        const size = this.allocatedBlocks.get(ptr);
        if (size) {
            this.allocatedBlocks.delete(ptr);
            this.totalAllocated -= size;
            this.freeBlocks.push(ptr);
            // Call WASM free if available
            if (this.instance.exports.free) {
                this.instance.exports.free(ptr);
            }
        }
    }
    /**
     * Write data to WASM memory
     */
    writeBytes(ptr, data) {
        const memory = new Uint8Array(this.memory.buffer);
        memory.set(data, ptr);
    }
    /**
     * Read data from WASM memory
     */
    readBytes(ptr, length) {
        const memory = new Uint8Array(this.memory.buffer);
        return memory.slice(ptr, ptr + length);
    }
    /**
     * Write string to WASM memory
     */
    writeString(ptr, str) {
        const encoded = new TextEncoder().encode(str);
        this.writeBytes(ptr, encoded);
    }
    /**
     * Read string from WASM memory
     */
    readString(ptr, length) {
        const bytes = this.readBytes(ptr, length);
        return new TextDecoder().decode(bytes);
    }
    /**
     * Get memory usage statistics
     */
    getUsageStats() {
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
    constructor(gasLimit = 1000000, memoryLimit = 16 * 1024 * 1024, timeLimit = 30000) {
        this.module = null;
        this.instance = null;
        this.memory = null;
        this.memoryManager = null;
        // Gas metering
        this.gasUsed = 0;
        this.gasLimit = 1000000;
        this.operationCount = 0;
        // Security and capabilities
        this.allowedActions = new Set();
        this.knowledgeAccess = false;
        this.knowledgeTrie = null;
        // Execution tracking
        this.startTime = 0;
        this.executionTimeLimit = 30000; // 30 seconds
        this.memoryLimit = 16 * 1024 * 1024; // 16MB
        this.gasLimit = gasLimit;
        this.memoryLimit = memoryLimit;
        this.executionTimeLimit = timeLimit;
    }
    /**
     * Load WASM module and create agent instance
     */
    async loadAgent(wasmBytes, capabilities = []) {
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
        }
        catch (error) {
            console.error('❌ Failed to load WASM agent:', error);
            throw error;
        }
    }
    /**
     * Enable access to living knowledge base
     */
    enableKnowledgeAccess(knowledgeTrie) {
        this.knowledgeAccess = true;
        this.knowledgeTrie = knowledgeTrie;
        console.log('🧠 Knowledge base access enabled for agent');
    }
    /**
     * Execute agent logic with input data
     */
    async executeAgentLogic(functionName, inputData, context = {}) {
        if (!this.instance || !this.memoryManager) {
            throw new Error('WASM agent not loaded');
        }
        console.log(`\n🤖 Executing agent function: ${functionName}`);
        // Reset execution state
        this.gasUsed = 0;
        this.operationCount = 0;
        this.startTime = Date.now();
        const executionContext = {
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
            const agentFunction = this.instance.exports[functionName];
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
            const gasUsage = {
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
        }
        catch (error) {
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
                error: error.message
            };
        }
    }
    /**
     * Create WASM imports including gas metering and capabilities
     */
    createWASMImports() {
        return {
            env: {
                // Memory import
                memory: this.memory,
                // Gas metering
                use_gas: (amount) => {
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
                malloc: (size) => {
                    this.gasUsed += Math.ceil(size / 1024); // Gas cost for memory allocation
                    return this.memoryManager.allocate(size);
                },
                free: (ptr) => {
                    this.memoryManager.free(ptr);
                },
                // Knowledge base access
                query_knowledge: (queryPtr, queryLen) => {
                    this.gasUsed += 100; // Gas cost for knowledge query
                    if (!this.knowledgeAccess || !this.knowledgeTrie) {
                        console.warn('⚠️ Knowledge access denied or not available');
                        return 0;
                    }
                    try {
                        const query = this.memoryManager.readString(queryPtr, queryLen);
                        const results = this.knowledgeTrie.queryKnowledge(query, 5, 0.3);
                        console.log(`🔍 Agent queried knowledge: "${query}" (${results.length} results)`);
                        // Serialize results back to WASM memory
                        return this.serializeKnowledgeResults(results);
                    }
                    catch (error) {
                        console.error('❌ Knowledge query failed:', error);
                        return 0;
                    }
                },
                // Agent action execution
                execute_action: (actionPtr, actionLen) => {
                    this.gasUsed += 50; // Gas cost for action execution
                    try {
                        const actionData = this.memoryManager.readString(actionPtr, actionLen);
                        const action = JSON.parse(actionData);
                        console.log(`🎯 Agent executing action: ${action.type}`);
                        // Check if action is allowed
                        if (!this.allowedActions.has(action.type)) {
                            console.warn(`⚠️ Action denied: ${action.type} not in capabilities`);
                            return 0; // Action denied
                        }
                        // Execute the action (implementation depends on action type)
                        return this.executeAction(action);
                    }
                    catch (error) {
                        console.error('❌ Action execution failed:', error);
                        return 0;
                    }
                },
                // Logging from WASM
                agent_log: (level, messagePtr, messageLen) => {
                    const message = this.memoryManager.readString(messagePtr, messageLen);
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
    serializeToWASM(data) {
        const jsonString = JSON.stringify(data);
        const encoded = new TextEncoder().encode(jsonString);
        const ptr = this.memoryManager.allocate(encoded.length + 4); // +4 for length prefix
        // Write length prefix
        const lengthBytes = new Uint8Array(4);
        new DataView(lengthBytes.buffer).setUint32(0, encoded.length, true);
        this.memoryManager.writeBytes(ptr, lengthBytes);
        // Write data
        this.memoryManager.writeBytes(ptr + 4, encoded);
        return ptr;
    }
    /**
     * Deserialize data from WASM memory to JavaScript
     */
    deserializeFromWASM(ptr) {
        // Read length prefix
        const lengthBytes = this.memoryManager.readBytes(ptr, 4);
        const length = new DataView(lengthBytes.buffer).getUint32(0, true);
        // Read data
        const dataBytes = this.memoryManager.readBytes(ptr + 4, length);
        const jsonString = new TextDecoder().decode(dataBytes);
        return JSON.parse(jsonString);
    }
    /**
     * Serialize knowledge query results for WASM
     */
    serializeKnowledgeResults(results) {
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
    executeAction(action) {
        console.log(`🎯 Executing action: ${action.type}`, action.parameters);
        // Return success code (1) - in real implementation, this would
        // interact with the real world based on action type
        return 1;
    }
    /**
     * Get sandbox statistics
     */
    getStatistics() {
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
    reset() {
        this.gasUsed = 0;
        this.operationCount = 0;
        this.startTime = 0;
        // Note: We don't reset the WASM instance, just the execution state
        console.log('🔄 WASM sandbox state reset');
    }
    /**
     * Destroy sandbox and clean up resources
     */
    destroy() {
        this.module = null;
        this.instance = null;
        this.memory = null;
        this.memoryManager = null;
        this.knowledgeTrie = null;
        console.log('🗑️ WASM sandbox destroyed and resources cleaned up');
    }
}
