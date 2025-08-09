/**
 * Vitest global setup file
 * Configures test environment for CUE framework testing
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

// Global test configuration
beforeAll(async () => {
  // Setup global test environment
  console.log('🚀 Starting CUE Framework Test Suite')
  
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.CUE_TEST_MODE = 'true'
  
  // Mock console methods for cleaner test output
  if (!process.env.DEBUG) {
    global.console = {
      ...console,
      log: () => {}, // Suppress logs in tests unless DEBUG is set
      info: () => {},
      warn: console.warn, // Keep warnings
      error: console.error, // Keep errors
    }
  }
})

afterAll(async () => {
  console.log('✅ CUE Framework Test Suite Complete')
})

beforeEach(() => {
  // Reset any global state before each test
  // This is important for isolated test execution
})

afterEach(() => {
  // Cleanup after each test
  // Important for CUE network connections, timers, etc.
})

// Global test utilities
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeValidCueEvent(): T
      toHaveValidSignature(): T
      toPassAxiomaticValidation(): T
    }
  }
}

// Custom matchers for CUE testing
import { expect } from 'vitest'

// Custom matcher for CUE event validation
expect.extend({
  toBeValidCueEvent(received: any) {
    const { isNot } = this
    const pass = received && 
                  typeof received.type === 'string' &&
                  typeof received.level === 'string' &&
                  received.payload &&
                  typeof received.timestamp === 'number'

    return {
      pass,
      message: () =>
        `${received} ${isNot ? 'is' : 'is not'} a valid CUE event`
    }
  },

  toHaveValidSignature(received: any) {
    const { isNot } = this
    const pass = received &&
                  typeof received.signature === 'string' &&
                  typeof received.sourceCredentialId === 'string' &&
                  received.payload

    return {
      pass,
      message: () =>
        `${received} ${isNot ? 'has' : 'does not have'} a valid cryptographic signature`
    }
  },

  toPassAxiomaticValidation(received: any) {
    const { isNot } = this
    // Mock axiomatic validation for testing
    const pass = received && received.harmonicSignature && received.phase !== undefined

    return {
      pass,
      message: () =>
        `${received} ${isNot ? 'passes' : 'fails'} axiomatic validation`
    }
  }
})

// Test utilities for CUE framework
export const CueTestUtils = {
  // Create mock CUE event
  createMockCueEvent: (overrides = {}) => ({
    type: 'SENSOR_READING',
    level: 'LOCAL',
    payload: {
      sensorId: 'TEST_SENSOR_001',
      value: 22.5,
      unit: 'Celsius',
      timestamp: Date.now()
    },
    timestamp: Date.now(),
    ...overrides
  }),

  // Create mock signed message
  createMockSignedMessage: (payload: any, overrides = {}) => ({
    payload,
    sourceCredentialId: 'MOCK_CREDENTIAL_ID_12345',
    signature: 'MOCK_SIGNATURE_BASE64',
    ...overrides
  }),

  // Create mock Vec7HarmonyUnit
  createMockVec7HarmonyUnit: (overrides = {}) => ({
    id: 'V7-MOCK-12345-P0',
    phase: 0,
    vec1: { byteLength: 3 },
    vec2: { byteLength: 6 },
    vec3: [3, 5, 7],
    vec4: { bufferLengths: [15, 21] },
    vec5: { byteLength: 15 },
    vec6: { byteLength: 12 },
    vec7: { byteLength: 9 },
    harmonicSignature: {
      id: 'HV-MOCK-HARMONIC',
      length: 100,
      sin: 0.5,
      cos: 0.866,
      tan: 0.577,
      h: 1.0,
      buffer: new ArrayBuffer(100)
    },
    underlyingSExprHash: 'MOCK_SEXPR_HASH',
    ...overrides
  }),

  // Async delay utility for testing
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Generate mock temperature readings
  generateMockTemperatureReadings: (count: number, baseTemp = 22.0) => {
    return Array.from({ length: count }, (_, i) => ({
      sensorId: `SENSOR_${String(i + 1).padStart(3, '0')}`,
      timestamp: Date.now() + i * 1000,
      value: baseTemp + (Math.random() - 0.5) * 4,
      unit: 'Celsius'
    }))
  }
}

export default CueTestUtils