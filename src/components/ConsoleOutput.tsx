import React, { useState, useEffect, useRef } from 'react';
import { ConsoleLogger } from '../utils/consoleLogger';

export const ConsoleOutput: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const logContainerRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const logger = ConsoleLogger.getInstance();
    
    const handleLogsUpdate = (newLogs: string[]) => {
      setLogs(newLogs);
    };

    logger.addListener(handleLogsUpdate);

    return () => {
      logger.removeListener(handleLogsUpdate);
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new logs are added
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const clearLogs = () => {
    ConsoleLogger.getInstance().clear();
  };

  return (
    <div className="absolute bottom-5 right-5 z-10 w-80">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-t-lg text-sm font-mono border border-gray-600 border-b-0 flex items-center gap-2 w-full justify-between"
      >
        <span>Console Output {logs.length > 0 && `(${logs.length})`}</span>
        <span className="text-xs">{isVisible ? '▼' : '▲'}</span>
      </button>

      {/* Console Panel */}
      {isVisible && (
        <div className="bg-black/90 backdrop-blur-xl border border-gray-600 rounded-b-lg shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center px-3 py-2 border-b border-gray-600">
            <span className="text-xs text-green-400 font-mono">Reality Compiler Console</span>
            <div className="flex gap-2">
              <button
                onClick={clearLogs}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Logs Container */}
          <pre
            ref={logContainerRef}
            className="font-mono text-xs text-green-300 p-3 h-64 overflow-y-auto bg-black/50 whitespace-pre-wrap"
          >
            {logs.length === 0 ? (
              <span className="text-gray-500">No logs yet. Start creating systems to see output...</span>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </pre>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-gray-600 text-xs text-gray-400">
            Real-time system operations and AI decisions
          </div>
        </div>
      )}
    </div>
  );
};