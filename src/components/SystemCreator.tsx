import React, { useState } from 'react';
import { ALL_FUNCTIONS } from '../utils/computationalSystem';

interface SystemCreatorProps {
  onAddSystem: (selectedFunctions: string[], initialData: string) => void;
  onInjectData: (systemId: number, dataArray: any[]) => void;
  systems: Array<{ id: number; pipelineName: string }>;
}

export const SystemCreator: React.FC<SystemCreatorProps> = ({ onAddSystem, onInjectData, systems }) => {
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const [initialData, setInitialData] = useState<string>('{"value":10}');
  const [dataInjectionText, setDataInjectionText] = useState<string>('{"value":1}\n{"value":2}\n{"value":3}');
  const [selectedSystemId, setSelectedSystemId] = useState<number>(-1);
  const [functionFilter, setFunctionFilter] = useState<string>('All');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(Object.values(ALL_FUNCTIONS).map(f => f.category).filter(Boolean)))];
  
  // Filter functions based on selected category
  const filteredFunctions = Object.entries(ALL_FUNCTIONS).filter(([, func]) => 
    functionFilter === 'All' || func.category === functionFilter
  );

  // Context-aware input templates
  const getInputTemplate = (category: string): string => {
    switch (category) {
      case 'Math':
        return '{"value": 10}';
      case 'String':
        return '{"text": "Hello World"}';
      case 'Data':
        return '{"array": [1, 2, 3, 4, 5]}';
      case 'MCP':
        return '{"input_data": "I need to know the current timestamp."}';
      default:
        return '{"value": 10}';
    }
  };

  // Update initial data when filter changes
  const handleFilterChange = (category: string) => {
    setFunctionFilter(category);
    setInitialData(getInputTemplate(category));
  };

  const handleFunctionToggle = (functionKey: string) => {
    setSelectedFunctions(prev => 
      prev.includes(functionKey)
        ? prev.filter(key => key !== functionKey)
        : [...prev, functionKey]
    );
  };

  const handleAddSystem = () => {
    if (selectedFunctions.length === 0) {
      alert("Please select at least one function.");
      return;
    }

    try {
      JSON.parse(initialData);
    } catch (e) {
      alert("Invalid JSON input.");
      return;
    }

    onAddSystem(selectedFunctions, initialData);
  };

  const handleInjectData = () => {
    if (selectedSystemId === -1) {
      alert("Please select a system to inject data into.");
      return;
    }

    try {
      // Parse each line as separate JSON objects
      const lines = dataInjectionText.trim().split('\n').filter(line => line.trim());
      const dataArray = lines.map(line => JSON.parse(line.trim()));
      
      onInjectData(selectedSystemId, dataArray);
      alert(`Injected ${dataArray.length} data items into system ${selectedSystemId}`);
    } catch (e) {
      alert("Invalid JSON format. Each line should be a valid JSON object.");
      return;
    }
  };

  return (
    <div className="sidebar absolute top-5 left-5 z-10 p-4 rounded-xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col gap-4 w-80 max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-bold text-indigo-300">System Creator</h3>
      
      <div id="pipeline-functions">
        <div className="flex justify-between items-center mb-2">
          <label className="font-bold text-gray-300">1. Select Functions:</label>
          <div className="flex items-center gap-2">
            <label htmlFor="function-filter" className="text-sm text-gray-400">Filter:</label>
            <select
              id="function-filter"
              value={functionFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="bg-gray-900/50 text-white rounded-lg p-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-600"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
          {filteredFunctions.map(([key, func]) => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={key}
                checked={selectedFunctions.includes(key)}
                onChange={() => handleFunctionToggle(key)}
                className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <label htmlFor={key} className="text-sm text-white cursor-pointer flex-1">
                {func.description}
              </label>
              {func.category && (
                <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
                  {func.category}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="pipeline-input" className="font-bold text-gray-300">
          2. Initial Data (JSON):
        </label>
        <textarea
          id="pipeline-input"
          value={initialData}
          onChange={(e) => setInitialData(e.target.value)}
          className="w-full h-24 bg-gray-900/50 rounded-lg p-2 text-xs font-mono mt-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-600"
          placeholder='{"value": 10}'
        />
      </div>
      
      <button
        onClick={handleAddSystem}
        className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Add Custom System
      </button>

      {/* Data Injection Section */}
      {systems.length > 0 && (
        <>
          <hr className="border-gray-600" />
          <h4 className="text-md font-bold text-purple-300">Data Injection</h4>
          
          <div>
            <label htmlFor="system-select" className="font-bold text-gray-300">
              Select System:
            </label>
            <select
              id="system-select"
              value={selectedSystemId}
              onChange={(e) => setSelectedSystemId(Number(e.target.value))}
              className="w-full mt-1 bg-gray-900/50 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400 border border-gray-600"
            >
              <option value={-1}>Choose a system...</option>
              {systems.map(system => (
                <option key={system.id} value={system.id}>
                  Sys-{system.id}: {system.pipelineName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="data-injection" className="font-bold text-gray-300">
              Data Array (one JSON per line):
            </label>
            <textarea
              id="data-injection"
              value={dataInjectionText}
              onChange={(e) => setDataInjectionText(e.target.value)}
              className="w-full h-32 bg-gray-900/50 rounded-lg p-2 text-xs font-mono mt-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 border border-gray-600"
              placeholder='{"value":1}&#10;{"value":2}&#10;{"value":3}'
            />
          </div>

          <button
            onClick={handleInjectData}
            disabled={selectedSystemId === -1}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Inject Data Array
          </button>
        </>
      )}
    </div>
  );
};