import { useState, useCallback } from 'react';
import * as THREE from 'three';
import { ComputationalSystemData, SystemFunction, QuantizedData } from '../types';
import { ALL_FUNCTIONS, RecursiveEncoder } from '../utils/computationalSystem';
import { log } from '../utils/consoleLogger';

export const useSimulation = () => {
  const [systems, setSystems] = useState<ComputationalSystemData[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<ComputationalSystemData | null>(null);
  const [selectionQueue, setSelectionQueue] = useState<ComputationalSystemData[]>([]);
  const [nextSystemId, setNextSystemId] = useState(0);

  const addSystem = useCallback(async (
    selectedFunctionKeys: string[], 
    initialDataStr: string
  ) => {
    const selectedFunctions: SystemFunction[] = selectedFunctionKeys.map(key => ALL_FUNCTIONS[key]);
    const pipelineName = selectedFunctionKeys.join(' + ');
    
    let initialData;
    try {
      initialData = JSON.parse(initialDataStr);
    } catch (e) {
      throw new Error("Invalid JSON input");
    }

    // Create random position
    const spawnRadius = 30;
    const position = new THREE.Vector3(
      (Math.random() - 0.5) * spawnRadius,
      (Math.random() - 0.5) * spawnRadius,
      (Math.random() - 0.5) * spawnRadius
    );

    const newSystem: ComputationalSystemData = {
      id: nextSystemId,
      position,
      velocity: new THREE.Vector3(),
      acceleration: new THREE.Vector3(),
      pipeline: selectedFunctions,
      pipelineName,
      executionTrace: [],
      latestResult: {},
      resultHistory: [],
      systemType: 'function'
    };

    // Run the system to get initial results
    const encoder = new RecursiveEncoder();
    newSystem.latestResult = await encoder.execute(selectedFunctions, initialData);
    newSystem.executionTrace = encoder.getExecutionTrace();
    newSystem.resultHistory.push({
      timestamp: Date.now(),
      input: initialData,
      result: newSystem.latestResult
    });

    setSystems(prev => [...prev, newSystem]);
    setNextSystemId(prev => prev + 1);
    
    return newSystem;
  }, [nextSystemId]);

  const runSystemSequence = useCallback(async (initialDataStr: string) => {
    if (selectionQueue.length === 0) {
      throw new Error("No systems selected. Use Shift+Click to add systems to the sequence.");
    }

    let initialData;
    try {
      initialData = JSON.parse(initialDataStr);
    } catch (e) {
      throw new Error("Invalid JSON input");
    }

    // Run each system in the queue
    for (const system of selectionQueue) {
      const encoder = new RecursiveEncoder();
      system.latestResult = await encoder.execute(system.pipeline, initialData);
      system.executionTrace = encoder.getExecutionTrace();
      system.resultHistory.push({
        timestamp: Date.now(),
        input: initialData,
        result: system.latestResult
      });
    }

    // Update the selected system to show the last run system's results
    if (selectionQueue.length > 0) {
      setSelectedSystem(selectionQueue[selectionQueue.length - 1]);
    }

    // Update systems state to trigger re-render
    setSystems(prev => [...prev]);
  }, [selectionQueue]);

  const handleSystemClick = useCallback((
    clickedSystem: ComputationalSystemData | null, 
    isShiftClick: boolean
  ) => {
    if (clickedSystem) {
      if (isShiftClick) {
        // Add to queue if not already there
        setSelectionQueue(prev => 
          prev.includes(clickedSystem) ? prev : [...prev, clickedSystem]
        );
      } else {
        // Regular click resets the queue to just this one
        setSelectionQueue([clickedSystem]);
      }
      setSelectedSystem(clickedSystem);
    } else {
      // Clicking background deselects and clears queue
      setSelectionQueue([]);
      setSelectedSystem(null);
    }
  }, []);

  const removeSystem = useCallback((systemToRemove: ComputationalSystemData) => {
    // Remove from scene if mesh exists
    if (systemToRemove.mesh && systemToRemove.mesh.parent) {
      systemToRemove.mesh.parent.remove(systemToRemove.mesh);
      systemToRemove.mesh.geometry.dispose();
      if (Array.isArray(systemToRemove.mesh.material)) {
        systemToRemove.mesh.material.forEach(mat => mat.dispose());
      } else {
        systemToRemove.mesh.material.dispose();
      }
    }

    // Remove from all state
    setSystems(prev => prev.filter(s => s.id !== systemToRemove.id));
    setSelectionQueue(prev => prev.filter(s => s.id !== systemToRemove.id));
    
    if (selectedSystem?.id === systemToRemove.id) {
      setSelectedSystem(null);
    }
  }, [selectedSystem]);

  const injectDataToSystem = useCallback(async (systemId: number, dataArray: any[]) => {
    const system = systems.find(s => s.id === systemId);
    if (!system) {
      throw new Error(`System with ID ${systemId} not found`);
    }

    // Run the system with each data item in the array
    for (const dataItem of dataArray) {
      const encoder = new RecursiveEncoder();
      const result = await encoder.execute(system.pipeline, dataItem);
      system.resultHistory.push({
        timestamp: Date.now(),
        input: dataItem,
        result: result
      });
      system.latestResult = result; // Keep the last result as latest
      system.executionTrace = encoder.getExecutionTrace();
    }

    // Update systems state to trigger re-render
    setSystems(prev => [...prev]);
    
    // Update selected system if this system is selected
    if (selectedSystem?.id === systemId) {
      setSelectedSystem(system);
    }
  }, [systems, selectedSystem]);

  const addQuantizedSystem = useCallback(async (text: string, quantizedData: QuantizedData) => {
    const spawnRadius = 30;
    const position = new THREE.Vector3(
      (Math.random() - 0.5) * spawnRadius,
      (Math.random() - 0.5) * spawnRadius,
      (Math.random() - 0.5) * spawnRadius
    );

    const newSystem: ComputationalSystemData = {
      id: nextSystemId,
      position,
      velocity: new THREE.Vector3(),
      acceleration: new THREE.Vector3(),
      pipeline: [], // Text systems don't have function pipelines
      pipelineName: text,
      executionTrace: quantizedData.quantizedVector,
      latestResult: quantizedData,
      resultHistory: [{
        timestamp: Date.now(),
        input: text,
        result: quantizedData
      }],
      systemType: 'text',
      originalText: text
    };

    setSystems(prev => [...prev, newSystem]);
    setNextSystemId(prev => prev + 1);
    
    log(`Added quantized text system: "${text}" with vector [${quantizedData.quantizedVector.join(', ')}]`);
    
    return newSystem;
  }, [nextSystemId]);

  const clearAllSystems = useCallback(() => {
    // Remove all meshes from scene
    systems.forEach(system => {
      if (system.mesh && system.mesh.parent) {
        system.mesh.parent.remove(system.mesh);
      }
    });

    setSystems([]);
    setSelectionQueue([]);
    setSelectedSystem(null);
    setNextSystemId(0);
  }, [systems]);

  return {
    systems,
    selectedSystem,
    selectionQueue,
    addSystem,
    addQuantizedSystem,
    runSystemSequence,
    handleSystemClick,
    removeSystem,
    clearAllSystems,
    injectDataToSystem,
    systemCount: systems.length
  };
};