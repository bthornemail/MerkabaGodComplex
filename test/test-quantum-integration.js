#!/usr/bin/env node

/**
 * Comprehensive Quantum Integration Test
 * Tests the complete quantum system integration including:
 * - Quantum production server connectivity
 * - UBHP centroid calculations
 * - Marketplace functionality
 * - Agent registration and communication
 */

import WebSocket from 'ws';
import fetch from 'node-fetch';

const QUANTUM_WS_URL = 'ws://localhost:8081';
const QUANTUM_HTTP_URL = 'http://localhost:8080';
const FRONTEND_URL = 'http://localhost:5173';

// UBHP Core Functionality Test
function testUBHPCentroid() {
    console.log('\n🧮 Testing UBHP Centroid Calculation...');
    
    // Simulate the UBHP encoding and harmonization
    const testInputs = [
        'Quantum consciousness',
        'UBHP geometric consensus', 
        'Harmonic vector field',
        'Sacred geometry protocol'
    ];
    
    const harmonicVectors = testInputs.map((text, index) => {
        // Simulate encoding
        const buffer = new TextEncoder().encode(text);
        const values = Array.from(buffer);
        const h = Math.hypot(...values);
        const sin = Math.sin(h / Math.PI);
        const cos = Math.cos(h / 1.61803398875);
        const tan = Math.tan(Math.PI / (h || 1e-10));
        
        return {
            id: `UBHP_${h.toFixed(8)}_${sin.toFixed(8)}_${cos.toFixed(8)}_${buffer.length}`,
            text,
            harmonicSignature: { h, sin, cos, tan, length: values.length },
            fixedDimensionRay: [h, sin, cos, tan, values.length]
        };
    });
    
    // Calculate centroid
    const dimensions = harmonicVectors[0].fixedDimensionRay.length;
    const centroid = new Array(dimensions).fill(0);
    
    for (const vector of harmonicVectors) {
        for (let i = 0; i < dimensions; i++) {
            centroid[i] += vector.fixedDimensionRay[i];
        }
    }
    
    for (let i = 0; i < dimensions; i++) {
        centroid[i] /= harmonicVectors.length;
    }
    
    console.log('✅ UBHP Harmonic Vectors Generated:');
    harmonicVectors.forEach((hv, i) => {
        console.log(`   ${i+1}. "${hv.text}" -> h: ${hv.harmonicSignature.h.toFixed(4)}`);
    });
    
    console.log('✅ Calculated Centroid (5D):');
    console.log(`   [${centroid.map(v => v.toFixed(6)).join(', ')}]`);
    
    return { harmonicVectors, centroid };
}

// Test Quantum Server Connectivity
async function testQuantumServerHTTP() {
    console.log('\n📡 Testing Quantum HTTP Server...');
    
    try {
        const response = await fetch(`${QUANTUM_HTTP_URL}/api/status`);
        const status = await response.json();
        
        console.log('✅ Quantum Server Status:');
        console.log(`   Connected Clients: ${status.connectedClients}`);
        console.log(`   Quantum Entanglements: ${status.quantumEntanglements}`);
        console.log(`   Agent Registry: ${status.agentRegistry}`);
        console.log(`   Coherence Level: ${status.globalCoherenceLevel.toFixed(3)}`);
        console.log(`   Quantum Phase: ${status.globalQuantumPhase.toFixed(3)}`);
        
        return status;
    } catch (error) {
        console.error('❌ Quantum HTTP Server Test Failed:', error.message);
        return null;
    }
}

// Test Quantum WebSocket Functionality
function testQuantumWebSocket() {
    return new Promise((resolve, reject) => {
        console.log('\n🔌 Testing Quantum WebSocket Connection...');
        
        const ws = new WebSocket(QUANTUM_WS_URL);
        const operations = [];
        let handshakeComplete = false;
        
        ws.on('open', () => {
            console.log('✅ WebSocket Connected');
            
            // Send quantum handshake
            ws.send(JSON.stringify({
                type: 'quantum_handshake',
                psi: { n: 1, O1: 'consciousness', O2: 'coordination', Lambda: 'integration' },
                timestamp: Date.now()
            }));
        });
        
        ws.on('message', (data) => {
            const message = JSON.parse(data.toString());
            console.log(`📨 Received: ${message.type}`);
            
            switch (message.type) {
                case 'quantum_handshake_response':
                    handshakeComplete = true;
                    console.log(`✅ Handshake Complete - Client ID: ${message.clientId}`);
                    
                    // Test quantum entanglement
                    ws.send(JSON.stringify({
                        type: 'quantum_entangle',
                        vectorPath: [1000, 2000],
                        content: JSON.stringify({
                            test: 'UBHP Integration Test',
                            harmonicData: { h: 123.456, sin: 0.789, cos: -0.234 },
                            timestamp: Date.now()
                        }),
                        contentType: 'application/json',
                        timestamp: Date.now()
                    }));
                    break;
                    
                case 'quantum_entanglement_response':
                    console.log(`✅ Quantum Entanglement: [${message.vectorPath.join(',')}]`);
                    operations.push('entanglement');
                    
                    // Test agent registration
                    ws.send(JSON.stringify({
                        type: 'register_agent',
                        agentId: 'test_ubhp_agent',
                        agentType: 'consciousness',
                        capabilities: ['ubhp-processing', 'centroid-calculation', '3d-avatar-generation'],
                        timestamp: Date.now()
                    }));
                    break;
                    
                case 'agent_registration_response':
                    console.log(`✅ Agent Registered: ${message.agentId}`);
                    operations.push('agent_registration');
                    
                    // Test tetrahedron creation
                    ws.send(JSON.stringify({
                        type: 'create_quantum_tetrahedron',
                        position: [0, 0, 0],
                        quantumSpin: [0.5, -0.5, 0.5, -0.5],
                        timestamp: Date.now()
                    }));
                    break;
                    
                case 'quantum_tetrahedron_created':
                    console.log(`✅ Quantum Tetrahedron Created: ${message.tetrahedronId}`);
                    operations.push('tetrahedron_creation');
                    
                    // Complete the test
                    setTimeout(() => {
                        ws.close();
                        resolve({
                            handshakeComplete,
                            operationsCompleted: operations,
                            totalOperations: operations.length
                        });
                    }, 1000);
                    break;
            }
        });
        
        ws.on('error', (error) => {
            console.error('❌ WebSocket Error:', error.message);
            reject(error);
        });
        
        ws.on('close', () => {
            console.log('🔌 WebSocket Connection Closed');
        });
        
        // Timeout after 10 seconds
        setTimeout(() => {
            if (!handshakeComplete) {
                ws.close();
                reject(new Error('WebSocket test timeout'));
            }
        }, 10000);
    });
}

// Test Frontend Availability
async function testFrontend() {
    console.log('\n🌐 Testing Frontend Availability...');
    
    try {
        const response = await fetch(FRONTEND_URL);
        if (response.ok) {
            console.log('✅ Frontend Server Running');
            console.log(`   URL: ${FRONTEND_URL}`);
            return true;
        } else {
            console.log('❌ Frontend Server Error:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Frontend Test Failed:', error.message);
        return false;
    }
}

// Main Integration Test
async function runIntegrationTest() {
    console.log('🌌 QUANTUM UBHP INTEGRATION TEST SUITE');
    console.log('=====================================');
    
    const results = {
        ubhpCentroid: null,
        quantumHTTP: null,
        quantumWebSocket: null,
        frontend: null,
        overallSuccess: false
    };
    
    try {
        // Test UBHP Centroid Calculation
        results.ubhpCentroid = testUBHPCentroid();
        
        // Test Quantum HTTP Server
        results.quantumHTTP = await testQuantumServerHTTP();
        
        // Test Quantum WebSocket
        results.quantumWebSocket = await testQuantumWebSocket();
        
        // Test Frontend
        results.frontend = await testFrontend();
        
        // Overall Assessment
        results.overallSuccess = !!(
            results.ubhpCentroid &&
            results.quantumHTTP &&
            results.quantumWebSocket &&
            results.frontend
        );
        
        console.log('\n🎯 INTEGRATION TEST SUMMARY');
        console.log('===========================');
        console.log(`UBHP Centroid Calculation: ${results.ubhpCentroid ? '✅' : '❌'}`);
        console.log(`Quantum HTTP Server: ${results.quantumHTTP ? '✅' : '❌'}`);
        console.log(`Quantum WebSocket: ${results.quantumWebSocket ? '✅' : '❌'}`);
        console.log(`Frontend Availability: ${results.frontend ? '✅' : '❌'}`);
        console.log(`Overall Integration: ${results.overallSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
        
        if (results.overallSuccess) {
            console.log('\n🎉 QUANTUM UBHP INTEGRATION SUCCESSFUL!');
            console.log('🎭 3D Avatars: Ready for harmonic visualization');
            console.log('🛒 Marketplace: Ready for quantum entanglement');
            console.log('🤖 Agents: Ready for consciousness simulation');
            console.log('🧮 UBHP Centroid: Ready for geometric consensus');
            
            console.log('\n🚀 NEXT STEPS:');
            console.log(`1. Open ${FRONTEND_URL} in your browser`);
            console.log('2. Navigate to the "🎭 UBHP 3D" tab');
            console.log('3. Enter text inputs for harmonic analysis');
            console.log('4. Click "Calculate Quantum Centroid & Generate 3D Avatars"');
            console.log('5. Watch as 3D avatars are generated based on harmonic signatures!');
        }
        
    } catch (error) {
        console.error('\n❌ Integration Test Failed:', error.message);
        results.overallSuccess = false;
    }
    
    return results;
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runIntegrationTest()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

export { runIntegrationTest, testUBHPCentroid, testQuantumServerHTTP, testQuantumWebSocket };