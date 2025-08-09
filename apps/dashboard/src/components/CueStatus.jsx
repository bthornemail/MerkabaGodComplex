import React from 'react';

const CueStatus = ({ connectionStatus, clientStatus, error, onReconnect }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#35a745';
      case 'connecting': return '#fca11a';
      case 'disconnected': return '#6c757d';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected': return 'Connected to CUE Network';
      case 'connecting': return 'Connecting to CUE Network...';
      case 'disconnected': return 'Disconnected from CUE Network';
      case 'error': return 'CUE Network Error';
      default: return 'Unknown Status';
    }
  };

  return (
    <div className="cue-status-card">
      <div className="status-header">
        <h3>CUE Network Status</h3>
        <div 
          className="status-indicator"
          style={{ backgroundColor: getStatusColor(connectionStatus) }}
        />
      </div>
      
      <div className="status-details">
        <div className="status-row">
          <span className="status-label">Connection:</span>
          <span className="status-value">{getStatusText(connectionStatus)}</span>
        </div>
        
        {clientStatus.connected && (
          <>
            <div className="status-row">
              <span className="status-label">Event Handlers:</span>
              <span className="status-value">{clientStatus.eventHandlers?.length || 0}</span>
            </div>
            <div className="status-row">
              <span className="status-label">Reconnect Attempts:</span>
              <span className="status-value">{clientStatus.reconnectAttempts || 0}</span>
            </div>
          </>
        )}
        
        {error && (
          <div className="status-row error">
            <span className="status-label">Error:</span>
            <span className="status-value">{error}</span>
          </div>
        )}
      </div>
      
      {(connectionStatus === 'error' || connectionStatus === 'disconnected') && (
        <button className="reconnect-btn" onClick={onReconnect}>
          Reconnect to CUE Network
        </button>
      )}
    </div>
  );
};

export default CueStatus;