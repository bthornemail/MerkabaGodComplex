import React, { useState } from 'react';
import { TextQuantizer } from '../utils/llmIntegration';
import { log } from '../utils/consoleLogger';

interface RealityQuantizerProps {
  onQuantizedSystemAdd: (text: string, quantizedData: any) => void;
}

export const RealityQuantizer: React.FC<RealityQuantizerProps> = ({ onQuantizedSystemAdd }) => {
  const [textInput, setTextInput] = useState<string>('The cat sat on the mat.');
  const [isQuantizing, setIsQuantizing] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  const handleQuantizeAndAdd = async () => {
    if (!textInput.trim()) {
      alert("Please enter a phrase to quantize.");
      return;
    }

    if (!apiKey && !showApiKeyInput) {
      setShowApiKeyInput(true);
      return;
    }

    if (!apiKey) {
      alert("Please enter your Google Gemini API key to use AI quantization.");
      return;
    }

    setIsQuantizing(true);
    log(`Reality Quantizer: Starting quantization of "${textInput}"`);

    try {
      const quantizer = new TextQuantizer();
      quantizer.setApiKey(apiKey);
      
      const quantizedData = await quantizer.quantize(textInput);
      log(`Reality Quantizer: Quantization complete. Vector: [${quantizedData.quantizedVector.join(', ')}]`);
      log(`Reality Quantizer: Summary: ${quantizedData.summary}`);
      
      onQuantizedSystemAdd(textInput, quantizedData);
      
      // Clear the input after successful quantization
      setTextInput('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log(`Reality Quantizer: Quantization failed - ${errorMessage}`);
      alert(`Quantization failed: ${errorMessage}`);
    } finally {
      setIsQuantizing(false);
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiKeyInput(false);
      handleQuantizeAndAdd();
    } else {
      alert("Please enter a valid API key.");
    }
  };

  return (
    <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col gap-4">
      <h3 className="text-lg font-bold text-teal-300">Reality Quantizer</h3>
      
      {showApiKeyInput ? (
        <div className="space-y-3">
          <div>
            <label htmlFor="api-key" className="font-bold text-gray-300 block mb-2">
              Google Gemini API Key:
            </label>
            <input
              type="password"
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="w-full bg-gray-900/50 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 border border-gray-600"
            />
            <p className="text-xs text-gray-400 mt-1">
              Get your API key from{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-teal-300 hover:text-teal-200 underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleApiKeySubmit}
              disabled={!apiKey.trim()}
              className="flex-1 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md"
            >
              Set API Key & Quantize
            </button>
            <button
              onClick={() => setShowApiKeyInput(false)}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="text-input" className="font-bold text-gray-300 block mb-2">
              Enter a phrase to quantize:
            </label>
            <textarea
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full h-16 bg-gray-900/50 rounded-lg p-2 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-teal-400 border border-gray-600"
              placeholder="The cat sat on the mat."
              disabled={isQuantizing}
            />
          </div>
          
          <button
            onClick={handleQuantizeAndAdd}
            disabled={isQuantizing || !textInput.trim()}
            className="bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md"
          >
            {isQuantizing ? 'Quantizing...' : 'Quantize and Add System'}
          </button>
          
          {apiKey && (
            <div className="text-xs text-gray-400">
              API key configured ✓{' '}
              <button
                onClick={() => {
                  setApiKey('');
                  setShowApiKeyInput(true);
                }}
                className="text-teal-300 hover:text-teal-200 underline ml-2"
              >
                Change
              </button>
            </div>
          )}
        </>
      )}
      
      <div className="text-xs text-gray-400 space-y-1">
        <p>💡 The Reality Quantizer converts natural language into numerical vectors for computational simulation.</p>
        <p>🔮 Text-based systems appear as spheres and can interact with function-based systems through similarity.</p>
      </div>
    </div>
  );
};