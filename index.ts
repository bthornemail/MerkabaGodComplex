/**
 * Universal Life Protocol - Core Package
 * 
 * Revolutionary AI framework implementing living, conscious digital reality
 * with meta-cognitive reasoning, attention economics, and autonomous learning.
 * 
 * @version 2.0.0
 * @author Brian Thorne
 * @license ISC
 */

// === CORE CUE FRAMEWORK ===
export * from './libs/cue-core/types.js';

// === DPO SYSTEM ===
export { AttentionTokenSystem } from './libs/dpo-system/attention-token.js';
export { DPOInterface } from './libs/dpo-system/dpo-interface.js';

// === MCP SERVER AND BRIDGE ===
export { ULPMCPServer, ULPMCPWebSocketServer } from './libs/mcp-bridge/ulp-mcp-server.js';
export { PersonalityProfilingMCP, ULPPersonalityProfiler } from './libs/mcp-bridge/personality-profiling-mcp.js';

// === CONVENIENCE EXPORTS ===
export const ULP = {
  // Version info
  version: '2.0.0',
  name: 'Universal Life Protocol',
  description: 'Revolutionary AI framework implementing living, conscious digital reality'
};

// === DEFAULT EXPORT ===
export default ULP;