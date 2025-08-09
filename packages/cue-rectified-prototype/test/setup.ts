/**
 * CUE Rectified Prototype Test Setup
 * Configures testing environment for CUE network components
 */

import { beforeAll, afterAll } from 'vitest'

beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test'
  process.env.CUE_TEST_MODE = 'true'
  
  // Suppress console output in tests unless DEBUG is set
  if (!process.env.DEBUG) {
    console.log = () => {}
    console.info = () => {}
  }
})

afterAll(() => {
  // Cleanup any global resources
})

// CUE-specific test utilities
export const CuePrototypeTestUtils = {
  // Create mock SimplePeer for testing
  createMockPeer: () => ({
    credentialId: 'MOCK_PEER_12345',
    isConnected: true,
    broadcast: vi.fn(),
    sign: vi.fn(),
    start: vi.fn().mockResolvedValue(undefined)
  }),

  // Create mock WASM binary
  createMockWasmBinary: () => new Uint8Array([0x00, 0x61, 0x73, 0x6d]), // WASM header

  // Create mock token state
  createMockTokenState: (overrides = {}) => ({
    tokenId: 'TEST_TOKEN_001',
    type: 'FUNGIBLE' as const,
    ownerCredentialId: 'MOCK_OWNER',
    metadata: {
      name: 'Test Token',
      description: 'Test token for unit tests',
      amount: 100
    },
    ...overrides
  }),

  // Create mock compute request
  createMockComputeRequest: (overrides = {}) => ({
    jobId: 'TEST_JOB_001',
    meteredWasmBinary: [0x00, 0x61, 0x73, 0x6d],
    functionName: 'test_function',
    inputData: [1, 2, 3],
    gasLimit: 1000000,
    requestedCapabilities: [],
    paymentOffer: { tokenId: 'PAYMENT_TOKEN', amount: 10 },
    ...overrides
  }),

  // Delay utility for async tests
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
}

export default CuePrototypeTestUtils