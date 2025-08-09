import React, { useState } from 'react';

const AgentControl = ({ agentStatus, sendHVACCommand, getLatestSensorReading }) => {
  const [isControlPanelOpen, setIsControlPanelOpen] = useState({});

  const toggleControlPanel = (agentId) => {
    setIsControlPanelOpen(prev => ({
      ...prev,
      [agentId]: !prev[agentId]
    }));
  };

  const handleHVACCommand = (agentId, command) => {
    const agent = agentStatus[agentId];
    if (!agent?.policy?.hvacDeviceId) {
      console.error('No HVAC device ID found for agent:', agentId);
      return;
    }

    const success = sendHVACCommand(
      agent.policy.hvacDeviceId,
      command,
      agent.policy.desiredTemperature
    );

    if (!success) {
      console.error('Failed to send HVAC command');
    }
  };

  const getAgentStatusColor = (agent) => {
    if (!agent) return '#6c757d';
    
    const timeSinceUpdate = Date.now() - agent.lastUpdated;
    if (timeSinceUpdate > 60000) return '#dc3545'; // Red if > 1 min
    if (timeSinceUpdate > 30000) return '#fca11a'; // Orange if > 30 sec
    return '#35a745'; // Green if recent
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getCurrentTemperature = (agent) => {
    if (!agent?.policy?.sensorDeviceId) return null;
    
    const reading = getLatestSensorReading(agent.policy.sensorDeviceId);
    return reading ? `${reading.value}°${reading.unit.charAt(0)}` : 'N/A';
  };

  const getTemperatureStatus = (agent) => {
    if (!agent?.policy) return 'unknown';
    
    const reading = getLatestSensorReading(agent.policy.sensorDeviceId);
    if (!reading) return 'no-data';
    
    const { desiredTemperature, tolerance } = agent.policy;
    const current = reading.value;
    
    if (current > desiredTemperature + tolerance) return 'too-hot';
    if (current < desiredTemperature - tolerance) return 'too-cold';
    return 'optimal';
  };

  return (
    <div className="card agent-control-card">
      <h3>CUE Agent Control</h3>
      
      {Object.keys(agentStatus).length === 0 ? (
        <div className="no-agents">
          <p>No CUE agents detected</p>
          <small>Agents will appear here when they connect to the network</small>
        </div>
      ) : (
        <div className="agent-list">
          {Object.entries(agentStatus).map(([agentId, agent]) => {
            const shortId = agentId.slice(-12);
            const statusColor = getAgentStatusColor(agent);
            const currentTemp = getCurrentTemperature(agent);
            const tempStatus = getTemperatureStatus(agent);
            const isOpen = isControlPanelOpen[agentId];
            
            return (
              <div key={agentId} className="agent-item">
                <div className="agent-header" onClick={() => toggleControlPanel(agentId)}>
                  <div className="agent-info">
                    <h4>Agent {shortId}</h4>
                    <div 
                      className="agent-status-indicator"
                      style={{ backgroundColor: statusColor }}
                    />
                  </div>
                  
                  <div className="agent-summary">
                    <span className="current-temp">
                      Current: {currentTemp}
                    </span>
                    <span className="target-temp">
                      Target: {agent.policy?.desiredTemperature}°C
                    </span>
                  </div>
                  
                  <div className={`expand-icon ${isOpen ? 'open' : ''}`}>
                    ▼
                  </div>
                </div>
                
                {isOpen && (
                  <div className="agent-details">
                    <div className="agent-policy">
                      <h5>Policy Configuration</h5>
                      <div className="policy-grid">
                        <div className="policy-item">
                          <span className="policy-label">Desired Temperature:</span>
                          <span className="policy-value">{agent.policy?.desiredTemperature}°C</span>
                        </div>
                        <div className="policy-item">
                          <span className="policy-label">Tolerance:</span>
                          <span className="policy-value">±{agent.policy?.tolerance}°C</span>
                        </div>
                        <div className="policy-item">
                          <span className="policy-label">HVAC Device:</span>
                          <span className="policy-value">{agent.policy?.hvacDeviceId}</span>
                        </div>
                        <div className="policy-item">
                          <span className="policy-label">Sensor Device:</span>
                          <span className="policy-value">{agent.policy?.sensorDeviceId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="temperature-status">
                      <h5>Temperature Status</h5>
                      <div className={`temp-status-indicator ${tempStatus}`}>
                        {tempStatus === 'too-hot' && '🔥 Too Hot'}
                        {tempStatus === 'too-cold' && '❄️ Too Cold'}
                        {tempStatus === 'optimal' && '✅ Optimal'}
                        {tempStatus === 'no-data' && '❓ No Data'}
                        {tempStatus === 'unknown' && '⚠️ Unknown'}
                      </div>
                    </div>
                    
                    {agent.lastCommand && (
                      <div className="last-command">
                        <h5>Last HVAC Command</h5>
                        <div className="command-details">
                          <span className="command-action">{agent.lastCommand.command}</span>
                          <span className="command-time">
                            {formatTimestamp(agent.lastCommandTime)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="manual-controls">
                      <h5>Manual Override</h5>
                      <div className="control-buttons">
                        <button 
                          className="hvac-btn heat-btn"
                          onClick={() => handleHVACCommand(agentId, 'HEAT')}
                        >
                          🔥 Heat
                        </button>
                        <button 
                          className="hvac-btn cool-btn"
                          onClick={() => handleHVACCommand(agentId, 'COOL')}
                        >
                          ❄️ Cool
                        </button>
                        <button 
                          className="hvac-btn off-btn"
                          onClick={() => handleHVACCommand(agentId, 'OFF')}
                        >
                          ⏹️ Off
                        </button>
                      </div>
                      <small className="control-warning">
                        Manual commands override autonomous agent decisions
                      </small>
                    </div>
                    
                    <div className="agent-metadata">
                      <small>
                        Last Updated: {formatTimestamp(agent.lastUpdated)} | 
                        Source: {agent.sourceCredentialId?.slice(-8)}
                      </small>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AgentControl;