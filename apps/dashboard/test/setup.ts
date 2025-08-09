/**
 * CUE Dashboard Test Setup
 * Configures React testing environment with Vitest
 */

import { beforeAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Global setup
beforeAll(() => {
  // Mock WebSocket for testing
  global.WebSocket = class MockWebSocket {
    static CONNECTING = 0
    static OPEN = 1
    static CLOSING = 2
    static CLOSED = 3

    readyState = MockWebSocket.CONNECTING
    url: string
    onopen: ((event: Event) => void) | null = null
    onclose: ((event: CloseEvent) => void) | null = null
    onmessage: ((event: MessageEvent) => void) | null = null
    onerror: ((event: Event) => void) | null = null

    constructor(url: string) {
      this.url = url
      // Simulate connection
      setTimeout(() => {
        this.readyState = MockWebSocket.OPEN
        this.onopen?.(new Event('open'))
      }, 0)
    }

    send(data: string) {
      // Mock sending data
      console.log('MockWebSocket send:', data)
    }

    close() {
      this.readyState = MockWebSocket.CLOSED
      this.onclose?.(new CloseEvent('close'))
    }
  } as any

  // Mock fetch for API calls
  global.fetch = vi.fn()
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Dashboard test utilities
export const DashboardTestUtils = {
  // Create mock sensor reading
  createMockSensorReading: (overrides = {}) => ({
    sensorId: 'SENSOR_TEST_001',
    timestamp: Date.now(),
    value: 22.5,
    unit: 'Celsius',
    sourceCredentialId: 'MOCK_AGENT_ID',
    receivedAt: Date.now(),
    ...overrides
  }),

  // Create mock agent status
  createMockAgentStatus: (overrides = {}) => ({
    'MOCK_AGENT_001': {
      policy: {
        agentId: 'MOCK_AGENT_001',
        desiredTemperature: 22.0,
        tolerance: 0.5,
        hvacDeviceId: 'HVAC_001',
        sensorDeviceId: 'SENSOR_001'
      },
      lastUpdated: Date.now(),
      sourceCredentialId: 'MOCK_CREDENTIAL',
      lastCommand: {
        hvacId: 'HVAC_001',
        command: 'COOL',
        targetTemperature: 22.0,
        timestamp: Date.now()
      },
      lastCommandTime: Date.now(),
      ...overrides
    }
  }),

  // Create mock franchise data
  createMockFranchiseData: (overrides = {}) => ({
    id: 'test-franchise-001',
    franchiseName: 'Test CUE Franchise',
    status: 'Operational',
    franchisee: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-TEST',
      liquidCapital: 200000,
      netWorth: 750000
    },
    location: {
      address: {
        street: 'Test Street',
        city: 'Test City',
        state: 'TS',
        zip: '12345'
      },
      squareFootage: 4500,
      siteType: 'Test',
      status: 'Active'
    },
    financials: {
      franchiseFee: 50000,
      estimatedBuildOutCost: 350000,
      workingCapital: 75000,
      equipmentCost: 100000,
      initialSupplyCost: 10000,
      totalEstimatedCost: 585000
    },
    timeline: {
      applicationDate: new Date().toISOString(),
      siteApprovalDate: new Date().toISOString(),
      leaseSignedDate: new Date().toISOString(),
      constructionStartDate: new Date().toISOString()
    },
    ...overrides
  }),

  // Mock WebSocket message
  mockWebSocketMessage: (type: string, payload: any) => ({
    type,
    payload,
    sourceCredentialId: 'MOCK_SOURCE',
    timestamp: Date.now()
  }),

  // Simulate WebSocket connection
  simulateWebSocketConnection: (mockWs: any, connected = true) => {
    if (connected) {
      mockWs.readyState = MockWebSocket.OPEN
      mockWs.onopen?.(new Event('open'))
    } else {
      mockWs.readyState = MockWebSocket.CLOSED
      mockWs.onclose?.(new CloseEvent('close'))
    }
  }
}

export default DashboardTestUtils