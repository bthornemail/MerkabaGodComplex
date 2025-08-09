import React from 'react';
import './App.css';
import { useCueData } from './hooks/useCueData';
import CueStatus from './components/CueStatus';
import FranchiseInfo from './components/FranchiseInfo';
import SensorReadings from './components/SensorReadings';
import AgentControl from './components/AgentControl';

function App() {
  const {
    franchiseData,
    sensorReadings,
    agentStatus,
    connectionStatus,
    isLoading,
    error,
    reconnect,
    sendHVACCommand,
    broadcastEvent,
    getLatestSensorReading,
    getAgentStatus,
    clientStatus
  } = useCueData({
    wsUrl: 'ws://localhost:8084',
    franchiseId: 'myFranchiseLA',
    autoConnect: true,
    sensorDeviceIds: ['SENSOR_LIVING_ROOM', 'DHT11_001', 'HVAC_001']
  });

  if (isLoading && connectionStatus === 'connecting') {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h2>Connecting to CUE Network...</h2>
        <p>Establishing secure connection to Computational Universe Engine</p>
      </div>
    );
  }

  return (
    <div className="cue-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>CUE Franchise Dashboard</h1>
          <p>Real-time monitoring and control via Computational Universe Engine</p>
        </div>
      </header>

      <main className="dashboard-main">
        {/* CUE Network Status */}
        <div className="status-section">
          <CueStatus
            connectionStatus={connectionStatus}
            clientStatus={clientStatus}
            error={error}
            onReconnect={reconnect}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Franchise Information */}
          <div className="franchise-section">
            <FranchiseInfo franchiseData={franchiseData} />
          </div>

          {/* Live Sensor Data */}
          <div className="sensors-section">
            <SensorReadings 
              readings={sensorReadings}
              getLatestReading={getLatestSensorReading}
            />
          </div>

          {/* Agent Control */}
          <div className="agents-section">
            <AgentControl
              agentStatus={agentStatus}
              sendHVACCommand={sendHVACCommand}
              getLatestSensorReading={getLatestSensorReading}
            />
          </div>
        </div>

        {/* Real-time Event Stream */}
        <div className="events-section">
          <div className="card">
            <h3>Live CUE Events</h3>
            <div className="event-stream">
              {sensorReadings.slice(-10).map((reading, index) => (
                <div key={index} className="event-item">
                  <span className="event-type">SENSOR_READING</span>
                  <span className="event-data">
                    {reading.sensorId}: {reading.value}°{reading.unit?.charAt(0)}
                  </span>
                  <span className="event-time">
                    {new Date(reading.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              
              {Object.values(agentStatus).map((agent, index) => 
                agent.lastCommand && (
                  <div key={`agent-${index}`} className="event-item">
                    <span className="event-type">HVAC_COMMAND</span>
                    <span className="event-data">
                      {agent.policy?.hvacDeviceId}: {agent.lastCommand.command}
                    </span>
                    <span className="event-time">
                      {new Date(agent.lastCommandTime).toLocaleTimeString()}
                    </span>
                  </div>
                )
              )}
              
              {sensorReadings.length === 0 && Object.keys(agentStatus).length === 0 && (
                <div className="no-events">
                  <p>No recent CUE events</p>
                  <small>Events will appear here as they occur on the network</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>
            Powered by <strong>CUE Framework</strong> | 
            Autonomous Agents: {Object.keys(agentStatus).length} | 
            Active Sensors: {new Set(sensorReadings.map(r => r.sensorId)).size} |
            Network Status: <span className={`status-text ${connectionStatus}`}>
              {connectionStatus.toUpperCase()}
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;