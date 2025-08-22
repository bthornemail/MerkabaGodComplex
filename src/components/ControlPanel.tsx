import React from 'react';
import { ComputationalSystemData } from '../types';

interface ControlPanelProps {
  systemCount: number;
  selectionQueue: ComputationalSystemData[];
  onRunSequence: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  systemCount,
  selectionQueue,
  onRunSequence
}) => {
  const sequenceDisplay = selectionQueue.length > 0 
    ? selectionQueue.map(s => `Sys-${s.id}`).join(' → ')
    : "None";

  return (
    <div className="controls-panel absolute bottom-5 left-1/2 -translate-x-1/2 z-10 p-4 rounded-xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-lg flex items-center flex-wrap justify-center gap-4">
      <button
        onClick={onRunSequence}
        disabled={selectionQueue.length === 0}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Run Selection Sequence
      </button>
      
      <div className="bg-gray-900/50 p-2 rounded-lg text-sm flex flex-col text-center border border-gray-600">
        <div>
          <span className="font-mono text-indigo-300">Systems Active: </span>
          <span className="font-mono text-gray-300">{systemCount}</span>
        </div>
        
        <div className="mt-1 pt-1 border-t border-indigo-900/50">
          <span className="font-mono text-indigo-300">Sequence: </span>
          <span className="font-mono text-gray-300 text-xs">{sequenceDisplay}</span>
        </div>
      </div>
      
      {selectionQueue.length === 0 && (
        <div className="text-gray-400 text-xs text-center">
          Use Shift+Click to add systems to sequence
        </div>
      )}
    </div>
  );
};