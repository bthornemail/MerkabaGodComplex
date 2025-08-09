import React from 'react';

const SensorReadings = ({ readings, getLatestReading }) => {
  // Group readings by sensor ID
  const groupedReadings = readings.reduce((acc, reading) => {
    if (!acc[reading.sensorId]) {
      acc[reading.sensorId] = [];
    }
    acc[reading.sensorId].push(reading);
    return acc;
  }, {});

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatValue = (value, unit) => {
    if (unit === 'Celsius') {
      return `${value}°C`;
    }
    return `${value} ${unit}`;
  };

  const getSensorStatus = (readings) => {
    if (!readings.length) return 'no-data';
    
    const latest = readings[readings.length - 1];
    const timeSinceReading = Date.now() - latest.timestamp;
    
    if (timeSinceReading > 30000) return 'stale'; // 30 seconds
    if (timeSinceReading > 10000) return 'warning'; // 10 seconds
    return 'active';
  };

  return (
    <div className="card sensor-readings-card">
      <h3>Live Sensor Readings</h3>
      
      {Object.keys(groupedReadings).length === 0 ? (
        <div className="no-data">
          <p>No sensor readings available</p>
          <small>Waiting for data from CUE agents...</small>
        </div>
      ) : (
        <div className="sensor-grid">
          {Object.entries(groupedReadings).map(([sensorId, sensorReadings]) => {
            const latest = sensorReadings[sensorReadings.length - 1];
            const status = getSensorStatus(sensorReadings);
            
            return (
              <div key={sensorId} className={`sensor-item ${status}`}>
                <div className="sensor-header">
                  <h4>{sensorId}</h4>
                  <div className={`sensor-status-indicator ${status}`} />
                </div>
                
                <div className="sensor-current-value">
                  <span className="value">
                    {formatValue(latest.value, latest.unit)}
                  </span>
                  <span className="timestamp">
                    {formatTimestamp(latest.timestamp)}
                  </span>
                </div>
                
                <div className="sensor-history">
                  <h5>Recent Readings</h5>
                  <div className="reading-list">
                    {sensorReadings.slice(-5).reverse().map((reading, index) => (
                      <div key={index} className="reading-item">
                        <span className="reading-value">
                          {formatValue(reading.value, reading.unit)}
                        </span>
                        <span className="reading-time">
                          {formatTimestamp(reading.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="sensor-summary">
        <div className="summary-item">
          <span className="label">Active Sensors:</span>
          <span className="value">{Object.keys(groupedReadings).length}</span>
        </div>
        <div className="summary-item">
          <span className="label">Total Readings:</span>
          <span className="value">{readings.length}</span>
        </div>
        <div className="summary-item">
          <span className="label">Last Update:</span>
          <span className="value">
            {readings.length > 0 
              ? formatTimestamp(Math.max(...readings.map(r => r.timestamp)))
              : 'Never'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default SensorReadings;