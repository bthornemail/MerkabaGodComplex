import React, { useState, useCallback, useEffect } from 'react';
import { useQuantumNetwork } from '../hooks/useQuantumNetwork';

interface QuantumAgent {
  id: string;
  type: 'consciousness' | 'knowledge' | 'economic' | 'marketplace' | 'hybrid';
  capabilities: string[];
  registered: boolean;
  status: 'active' | 'idle' | 'processing';
  performance: {
    tasksCompleted: number;
    successRate: number;
    averageResponseTime: number;
  };
}

interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  type: 'consciousness' | 'knowledge' | 'economic' | 'coordination';
  content: any;
  timestamp: number;
  status: 'sent' | 'delivered' | 'processed';
}

export const QuantumAgentManager: React.FC = () => {
  const { connected, registerAgent, sendQuantumMessage, logs } = useQuantumNetwork();
  const [agents, setAgents] = useState<QuantumAgent[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'agents' | 'communication' | 'performance'>('agents');

  // Pre-defined agent templates
  const agentTemplates = [
    {
      id: 'consciousness_observer',
      type: 'consciousness' as const,
      capabilities: ['self-reflection', 'meta-cognition', 'awareness-monitoring', 'golden-ratio-alignment'],
      name: 'Consciousness Observer'
    },
    {
      id: 'knowledge_curator',
      type: 'knowledge' as const,
      capabilities: ['information-synthesis', 'pattern-recognition', 'knowledge-evolution', 'trie-navigation'],
      name: 'Knowledge Curator'
    },
    {
      id: 'economic_coordinator',
      type: 'economic' as const,
      capabilities: ['resource-allocation', 'value-assessment', 'transaction-facilitation', 'market-analysis'],
      name: 'Economic Coordinator'
    },
    {
      id: 'marketplace_facilitator',
      type: 'marketplace' as const,
      capabilities: ['ad-matching', 'offer-optimization', 'delegation-routing', 'reputation-tracking'],
      name: 'Marketplace Facilitator'
    }
  ];

  const registerQuantumAgent = useCallback((template: typeof agentTemplates[0]) => {
    const success = registerAgent(template.id, template.type, template.capabilities);
    
    if (success) {
      const newAgent: QuantumAgent = {
        id: template.id,
        type: template.type,
        capabilities: template.capabilities,
        registered: true,
        status: 'active',
        performance: {
          tasksCompleted: 0,
          successRate: 1.0,
          averageResponseTime: 0
        }
      };
      
      setAgents(prev => [...prev.filter(a => a.id !== template.id), newAgent]);
    }
  }, [registerAgent]);

  const sendAgentMessage = useCallback((fromAgent: string, toAgent: string, type: AgentMessage['type'], content: any) => {
    const message: AgentMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromAgent,
      toAgent,
      type,
      content,
      timestamp: Date.now(),
      status: 'sent'
    };

    const success = sendQuantumMessage({
      type: 'agent_to_agent_message',
      fromAgent,
      toAgent,
      messageType: type,
      data: content,
      timestamp: Date.now()
    });

    if (success) {
      setMessages(prev => [...prev, message]);
      
      // Simulate message processing
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, status: 'delivered' } : m
        ));
      }, 1000);

      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, status: 'processed' } : m
        ));
        
        // Update agent performance
        const fromAgentObj = agents.find(a => a.id === fromAgent);
        if (fromAgentObj) {
          setAgents(prev => prev.map(a => 
            a.id === fromAgent 
              ? {
                  ...a,
                  performance: {
                    ...a.performance,
                    tasksCompleted: a.performance.tasksCompleted + 1,
                    averageResponseTime: (a.performance.averageResponseTime + 2000) / 2
                  }
                }
              : a
          ));
        }
      }, 3000);
    }
  }, [sendQuantumMessage, agents]);

  const createTetrahedron = useCallback(() => {
    const success = sendQuantumMessage({
      type: 'create_quantum_tetrahedron',
      position: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
      quantumSpin: [0.5, -0.5, 0.5, -0.5],
      timestamp: Date.now()
    });

    if (success) {
      console.log('🔺 Quantum tetrahedron creation requested');
    }
  }, [sendQuantumMessage]);

  return (
    <div className="quantum-agent-manager">
      <div className="manager-header">
        <h2>🤖 Quantum Agent Management System</h2>
        <div className="status-indicators">
          <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '🟢 Quantum Network' : '🔴 Disconnected'}
          </div>
          <div className="agent-count">👥 {agents.filter(a => a.registered).length} Active Agents</div>
        </div>
      </div>

      <div className="manager-tabs">
        <button 
          className={`tab-button ${activeTab === 'agents' ? 'active' : ''}`}
          onClick={() => setActiveTab('agents')}
        >
          🤖 Agents
        </button>
        <button 
          className={`tab-button ${activeTab === 'communication' ? 'active' : ''}`}
          onClick={() => setActiveTab('communication')}
        >
          📡 Communication
        </button>
        <button 
          className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          📊 Performance
        </button>
      </div>

      <div className="manager-content">
        {activeTab === 'agents' && (
          <AgentsTab 
            agents={agents}
            agentTemplates={agentTemplates}
            registerAgent={registerQuantumAgent}
            createTetrahedron={createTetrahedron}
          />
        )}
        {activeTab === 'communication' && (
          <CommunicationTab 
            agents={agents}
            messages={messages}
            sendMessage={sendAgentMessage}
          />
        )}
        {activeTab === 'performance' && (
          <PerformanceTab agents={agents} messages={messages} />
        )}
      </div>

      <div className="quantum-logs">
        <h4>🔄 Agent Operations Log</h4>
        <div className="logs-container">
          {logs.slice(-6).map((log, index) => (
            <div key={index} className="log-entry">{log}</div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .quantum-agent-manager {
          background: rgba(0, 30, 60, 0.9);
          border: 1px solid #333;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          color: white;
        }
        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .status-indicators {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        .connection-status {
          padding: 5px 12px;
          border-radius: 5px;
          font-size: 14px;
        }
        .connection-status.connected {
          background: rgba(76, 175, 80, 0.3);
          border: 1px solid #4CAF50;
        }
        .connection-status.disconnected {
          background: rgba(244, 67, 54, 0.3);
          border: 1px solid #f44336;
        }
        .agent-count {
          background: rgba(33, 150, 243, 0.3);
          border: 1px solid #2196F3;
          padding: 5px 12px;
          border-radius: 5px;
          font-size: 14px;
        }
        .manager-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .tab-button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: background 0.3s;
        }
        .tab-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .tab-button.active {
          background: #2196F3;
        }
        .manager-content {
          min-height: 400px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .quantum-logs {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          padding: 15px;
        }
        .logs-container {
          font-family: monospace;
          font-size: 12px;
          max-height: 120px;
          overflow-y: auto;
        }
        .log-entry {
          margin: 2px 0;
          color: #aaa;
        }
      `}</style>
    </div>
  );
};

interface AgentsTabProps {
  agents: QuantumAgent[];
  agentTemplates: any[];
  registerAgent: (template: any) => void;
  createTetrahedron: () => void;
}

const AgentsTab: React.FC<AgentsTabProps> = ({ agents, agentTemplates, registerAgent, createTetrahedron }) => {
  return (
    <div className="agents-tab">
      <div className="agents-header">
        <h3>🤖 Quantum Agent Registry</h3>
        <button onClick={createTetrahedron} className="tetrahedron-button">
          🔺 Create Quantum Tetrahedron
        </button>
      </div>

      <div className="agent-templates">
        <h4>Available Agent Templates</h4>
        <div className="templates-grid">
          {agentTemplates.map((template) => {
            const isRegistered = agents.some(a => a.id === template.id && a.registered);
            return (
              <div key={template.id} className="template-card">
                <h5>{template.name}</h5>
                <p className="agent-type">Type: {template.type}</p>
                <div className="capabilities">
                  <strong>Capabilities:</strong>
                  <ul>
                    {template.capabilities.map((cap, index) => (
                      <li key={index}>{cap}</li>
                    ))}
                  </ul>
                </div>
                <button 
                  onClick={() => registerAgent(template)}
                  disabled={isRegistered}
                  className={`register-button ${isRegistered ? 'registered' : ''}`}
                >
                  {isRegistered ? '✅ Registered' : '🔮 Register Agent'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="active-agents">
        <h4>Active Quantum Agents</h4>
        <div className="agents-grid">
          {agents.filter(a => a.registered).map((agent) => (
            <div key={agent.id} className="agent-card">
              <div className="agent-header">
                <h5>{agent.id}</h5>
                <span className={`status ${agent.status}`}>{agent.status}</span>
              </div>
              <p className="agent-type">Type: {agent.type}</p>
              <div className="agent-stats">
                <div>Tasks: {agent.performance.tasksCompleted}</div>
                <div>Success: {(agent.performance.successRate * 100).toFixed(1)}%</div>
                <div>Avg Response: {agent.performance.averageResponseTime}ms</div>
              </div>
              <div className="capabilities">
                {agent.capabilities.map((cap, index) => (
                  <span key={index} className="capability-tag">{cap}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .agents-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .tetrahedron-button {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          background: #9C27B0;
          color: white;
          cursor: pointer;
        }
        .agent-templates {
          margin-bottom: 30px;
        }
        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        .template-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #444;
          border-radius: 8px;
          padding: 15px;
        }
        .agent-type {
          color: #888;
          font-size: 14px;
          margin: 5px 0;
        }
        .capabilities ul {
          margin: 8px 0;
          padding-left: 20px;
        }
        .capabilities li {
          font-size: 12px;
          color: #bbb;
        }
        .register-button {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          background: #4CAF50;
          color: white;
          cursor: pointer;
          width: 100%;
          margin-top: 10px;
        }
        .register-button.registered {
          background: #666;
          cursor: not-allowed;
        }
        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
        }
        .agent-card {
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid #2196F3;
          border-radius: 8px;
          padding: 15px;
        }
        .agent-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .status {
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
        }
        .status.active {
          background: #4CAF50;
          color: white;
        }
        .status.idle {
          background: #FF9800;
          color: white;
        }
        .status.processing {
          background: #2196F3;
          color: white;
        }
        .agent-stats {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          font-size: 12px;
          color: #bbb;
        }
        .capability-tag {
          display: inline-block;
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          margin: 2px;
        }
      `}</style>
    </div>
  );
};

interface CommunicationTabProps {
  agents: QuantumAgent[];
  messages: AgentMessage[];
  sendMessage: (fromAgent: string, toAgent: string, type: AgentMessage['type'], content: any) => void;
}

const CommunicationTab: React.FC<CommunicationTabProps> = ({ agents, messages, sendMessage }) => {
  const [newMessage, setNewMessage] = useState({
    fromAgent: '',
    toAgent: '',
    type: 'coordination' as AgentMessage['type'],
    content: ''
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.fromAgent && newMessage.toAgent && newMessage.content) {
      sendMessage(newMessage.fromAgent, newMessage.toAgent, newMessage.type, {
        text: newMessage.content,
        priority: 'normal'
      });
      setNewMessage({ ...newMessage, content: '' });
    }
  };

  const activeAgents = agents.filter(a => a.registered);

  return (
    <div className="communication-tab">
      <div className="message-form">
        <h4>📡 Send Agent Message</h4>
        <form onSubmit={handleSendMessage}>
          <div className="form-row">
            <select
              value={newMessage.fromAgent}
              onChange={(e) => setNewMessage({ ...newMessage, fromAgent: e.target.value })}
              required
            >
              <option value="">From Agent...</option>
              {activeAgents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.id}</option>
              ))}
            </select>
            <select
              value={newMessage.toAgent}
              onChange={(e) => setNewMessage({ ...newMessage, toAgent: e.target.value })}
              required
            >
              <option value="">To Agent...</option>
              {activeAgents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.id}</option>
              ))}
            </select>
            <select
              value={newMessage.type}
              onChange={(e) => setNewMessage({ ...newMessage, type: e.target.value as AgentMessage['type'] })}
            >
              <option value="coordination">Coordination</option>
              <option value="consciousness">Consciousness</option>
              <option value="knowledge">Knowledge</option>
              <option value="economic">Economic</option>
            </select>
          </div>
          <textarea
            placeholder="Message content..."
            value={newMessage.content}
            onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
            required
          />
          <button type="submit" className="send-button">📡 Send Quantum Message</button>
        </form>
      </div>

      <div className="messages-history">
        <h4>💬 Message History</h4>
        <div className="messages-list">
          {messages.slice().reverse().map((message) => (
            <div key={message.id} className="message-card">
              <div className="message-header">
                <span className="from">{message.fromAgent}</span>
                <span className="arrow">→</span>
                <span className="to">{message.toAgent}</span>
                <span className={`status ${message.status}`}>{message.status}</span>
              </div>
              <div className="message-type">{message.type}</div>
              <div className="message-content">{JSON.stringify(message.content, null, 2)}</div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .message-form {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }
        .form-row select {
          padding: 8px;
          border: 1px solid #444;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
        }
        .message-form textarea {
          width: 100%;
          height: 80px;
          padding: 10px;
          border: 1px solid #444;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          resize: vertical;
          margin-bottom: 15px;
        }
        .send-button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          background: #2196F3;
          color: white;
          cursor: pointer;
          font-weight: bold;
        }
        .messages-list {
          max-height: 400px;
          overflow-y: auto;
        }
        .message-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #444;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 10px;
        }
        .message-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .from {
          color: #4CAF50;
          font-weight: bold;
        }
        .arrow {
          color: #888;
        }
        .to {
          color: #2196F3;
          font-weight: bold;
        }
        .status {
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: bold;
          margin-left: auto;
        }
        .status.sent {
          background: #FF9800;
          color: white;
        }
        .status.delivered {
          background: #2196F3;
          color: white;
        }
        .status.processed {
          background: #4CAF50;
          color: white;
        }
        .message-type {
          color: #888;
          font-size: 12px;
          margin-bottom: 8px;
        }
        .message-content {
          background: rgba(0, 0, 0, 0.3);
          padding: 8px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          white-space: pre-wrap;
          margin-bottom: 8px;
        }
        .message-time {
          color: #666;
          font-size: 11px;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

interface PerformanceTabProps {
  agents: QuantumAgent[];
  messages: AgentMessage[];
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ agents, messages }) => {
  const totalMessages = messages.length;
  const processedMessages = messages.filter(m => m.status === 'processed').length;
  const systemSuccessRate = totalMessages > 0 ? (processedMessages / totalMessages) * 100 : 100;

  return (
    <div className="performance-tab">
      <div className="performance-overview">
        <h4>📊 System Performance Overview</h4>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">{agents.filter(a => a.registered).length}</div>
            <div className="metric-label">Active Agents</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{totalMessages}</div>
            <div className="metric-label">Total Messages</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{systemSuccessRate.toFixed(1)}%</div>
            <div className="metric-label">Success Rate</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">
              {agents.reduce((sum, a) => sum + a.performance.tasksCompleted, 0)}
            </div>
            <div className="metric-label">Tasks Completed</div>
          </div>
        </div>
      </div>

      <div className="agent-performance">
        <h4>🤖 Individual Agent Performance</h4>
        <div className="performance-list">
          {agents.filter(a => a.registered).map((agent) => (
            <div key={agent.id} className="performance-card">
              <div className="performance-header">
                <h5>{agent.id}</h5>
                <span className="agent-type">{agent.type}</span>
              </div>
              <div className="performance-metrics">
                <div className="metric">
                  <span className="metric-name">Tasks Completed</span>
                  <span className="metric-value">{agent.performance.tasksCompleted}</span>
                </div>
                <div className="metric">
                  <span className="metric-name">Success Rate</span>
                  <span className="metric-value">{(agent.performance.successRate * 100).toFixed(1)}%</span>
                </div>
                <div className="metric">
                  <span className="metric-name">Avg Response Time</span>
                  <span className="metric-value">{agent.performance.averageResponseTime}ms</span>
                </div>
              </div>
              <div className="performance-bar">
                <div 
                  className="performance-fill"
                  style={{ width: `${agent.performance.successRate * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .performance-overview {
          margin-bottom: 30px;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #444;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: #4CAF50;
          margin-bottom: 5px;
        }
        .metric-label {
          font-size: 12px;
          color: #888;
        }
        .performance-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .performance-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #444;
          border-radius: 8px;
          padding: 20px;
        }
        .performance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .agent-type {
          background: #666;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 12px;
        }
        .performance-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 15px;
        }
        .metric {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .metric-name {
          font-size: 12px;
          color: #888;
        }
        .metric-value {
          font-size: 16px;
          font-weight: bold;
          color: #2196F3;
        }
        .performance-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .performance-fill {
          height: 100%;
          background: linear-gradient(90deg, #4CAF50, #2196F3);
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default QuantumAgentManager;