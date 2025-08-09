// Jest setup file for autonomous training tests

// Mock console methods to reduce test noise
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error // Keep errors for debugging
};

// Mock crypto for Node.js compatibility
const crypto = require('crypto');

if (!global.crypto) {
  global.crypto = {
    getRandomValues: (arr) => crypto.randomBytes(arr.length)
  };
}

// Mock TextEncoder/TextDecoder for broader Node.js compatibility
if (!global.TextEncoder) {
  global.TextEncoder = require('util').TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = require('util').TextDecoder;
}

// Mock performance for timing measurements
if (!global.performance) {
  global.performance = {
    now: () => Date.now()
  };
}

// Custom matcher for harmonic vectors
expect.extend({
  toBeValidHarmonicVector(received) {
    const pass = received && 
                 typeof received.id === 'string' &&
                 typeof received.h === 'number' &&
                 typeof received.sin === 'number' &&
                 typeof received.cos === 'number' &&
                 typeof received.tan === 'number' &&
                 received.buffer instanceof ArrayBuffer;

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid HarmonicVector`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid HarmonicVector with id, h, sin, cos, tan, and buffer properties`,
        pass: false,
      };
    }
  },

  toBeValidDynamicAxiom(received) {
    const pass = received &&
                 typeof received.id === 'string' &&
                 typeof received.name === 'string' &&
                 typeof received.definition === 'string' &&
                 typeof received.func === 'function' &&
                 typeof received.confidence === 'number' &&
                 typeof received.qualityScore === 'number' &&
                 received.confidence >= 0 && received.confidence <= 1 &&
                 received.qualityScore >= 0 && received.qualityScore <= 1;

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid DynamicAxiom`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid DynamicAxiom with proper structure and valid confidence/quality scores`,
        pass: false,
      };
    }
  }
});

// Global test timeout
jest.setTimeout(15000);

// Clean up after tests
afterEach(() => {
  // Clear any timers
  jest.clearAllTimers();
  
  // Reset console mocks
  jest.clearAllMocks();
});