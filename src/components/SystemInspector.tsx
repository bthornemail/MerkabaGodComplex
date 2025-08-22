import React from 'react';
import { ComputationalSystemData } from '../types';

interface SystemInspectorProps {
  selectedSystem: ComputationalSystemData | null;
  isVisible: boolean;
}

export const SystemInspector: React.FC<SystemInspectorProps> = ({ 
  selectedSystem, 
  isVisible 
}) => {
  return (
    <div className={`sidebar absolute top-5 right-5 z-10 p-4 rounded-xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col gap-4 w-72 transition-transform duration-300 ease-in-out ${!isVisible ? 'translate-x-full' : ''}`}>
      <h3 className="text-lg font-bold text-yellow-300">System Inspector</h3>
      
      {selectedSystem ? (
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between border-b border-yellow-900/50 pb-1">
            <span className="font-bold text-white">ID:</span>
            <span className="font-mono text-gray-300">Sys-{selectedSystem.id}</span>
          </div>
          
          <div className="flex flex-col gap-1 border-b border-yellow-900/50 pb-1">
            <span className="font-bold text-white">Pipeline:</span>
            <span className="font-mono text-gray-300 text-xs break-all">
              {selectedSystem.pipelineName}
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="font-bold text-white">Latest Result:</span>
            <pre className="font-mono text-gray-300 text-xs bg-gray-900/50 p-2 rounded-md max-h-48 overflow-auto border border-gray-600">
              {JSON.stringify(selectedSystem.latestResult, null, 2)}
            </pre>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="font-bold text-white">Position:</span>
            <span className="font-mono text-gray-300 text-xs">
              x: {selectedSystem.position.x.toFixed(2)}, 
              y: {selectedSystem.position.y.toFixed(2)}, 
              z: {selectedSystem.position.z.toFixed(2)}
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="font-bold text-white">Execution Trace:</span>
            <span className="font-mono text-gray-300 text-xs">
              [{selectedSystem.executionTrace.join(', ')}]
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-bold text-white">Result History ({selectedSystem.resultHistory?.length || 0} runs):</span>
            <div className="max-h-32 overflow-y-auto bg-gray-900/50 p-2 rounded-md border border-gray-600">
              {selectedSystem.resultHistory?.length > 0 ? (
                selectedSystem.resultHistory.slice(-5).map((entry, index) => (
                  <div key={index} className="text-xs mb-2 border-b border-gray-700 pb-1">
                    <div className="text-gray-400">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="font-mono text-green-300">
                      Input: {JSON.stringify(entry.input)}
                    </div>
                    <div className="font-mono text-blue-300">
                      Result: {JSON.stringify(entry.result)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-xs">No computation history</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-sm">
          Click on a system to inspect its properties
        </div>
      )}
    </div>
  );
};