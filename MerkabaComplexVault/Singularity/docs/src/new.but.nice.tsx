import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- UBHP Core Definitions (from the provided document, simplified for demonstration) ---

// SExprType Enumeration for Canonical Encoding
enum SExprType {
  NULL = 0x00, BOOL = 0x01, INT32 = 0x02, INT64 = 0x03, FLOAT32 = 0x04, FLOAT64 = 0x05,
  STRING = 0x06, SYMBOL = 0x07, LIST = 0x08, LAMBDA = 0x09, REFERENCE = 0x0A,
  MODEL_WEIGHTS = 0x0B, SEED_TRANSFORM = 0x0C
}

// Variable-length integer encoding (LEB128-like for lengths)
function encodeVarInt(value: number): Uint8Array {
  const result: number[] = [];
  while (value >= 0x80) {
    result.push((value & 0x7F) | 0x80);
    value >>>= 7;
  }
  result.push(value & 0x7F);
  return new Uint8Array(result);
}

// CanonicalSExprEncoder Class Structure (simplified)
class CanonicalSExprEncoder {
  private buffer: number[] = [];

  encodeString(value: string): void {
    this.buffer.push(SExprType.STRING);
    const utf8Bytes = new TextEncoder().encode(value);
    const lengthBytes = encodeVarInt(utf8Bytes.length);
    this.buffer.push(...lengthBytes, ...utf8Bytes);
  }

  encodeLambda(body: ArrayBuffer): void {
    this.buffer.push(SExprType.LAMBDA);
    const bodyArray = Array.from(new Uint8Array(body));
    const lengthBytes = encodeVarInt(bodyArray.length);
    this.buffer.push(...lengthBytes, ...bodyArray);
  }

  getBuffer(): ArrayBuffer { return new Uint8Array(this.buffer).buffer; }
}

// HarmonicVector Interface
interface HarmonicVector {
  id: string;
  length: number;
  sin: number;
  cos: number;
  tan: number;
  h: number;
  buffer: ArrayBuffer;
}

// harmonize function
function harmonize(
  inputSExpr: ArrayBuffer,
  originBuffer?: ArrayBuffer
): HarmonicVector {
  const view = new Uint8Array(inputSExpr);
  const rawValues = Array.from(view);

  const values = originBuffer
    ? rawValues.map((v, i) => v ^ new Uint8Array(originBuffer)[i % originBuffer.byteLength])
    : rawValues;

  const h = Math.hypot(...values);
  const sin = Math.sin(h / Math.PI);
  const cos = Math.cos(h / 1.61803398875); // Golden ratio constant
  const tan = Math.tan(Math.PI / (h || 1e-10));

  const id = `UBHP_${h.toFixed(8)}_${sin.toFixed(8)}_${cos.toFixed(8)}_${view.length}`;

  return {
    id, length: values.length, sin, cos, tan, h, buffer: inputSExpr
  };
}

// Helper to convert ArrayBuffer to hex string for display
const arrayBufferToHexString = (buffer: ArrayBuffer | null, maxLength: number = 256): string => {
  if (!buffer) return '';
  const uint8Array = new Uint8Array(buffer);
  const displayLength = Math.min(uint8Array.length, maxLength);
  return Array.from(uint8Array.slice(0, displayLength))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Helper to create a fixed-dimension ray from HarmonicVector for centroid calculation
const createFixedDimensionRay = (signature: HarmonicVector): number[] => {
  // Using h, sin, cos, tan, and length for a fixed 5-dimensional vector
  return [signature.h, signature.sin, signature.cos, signature.tan, signature.length];
};

// calculateCentroid function
function calculateCentroid(vectors: number[][]): number[] {
  if (vectors.length === 0) return [];
  const dimensions = vectors[0].length;
  const centroid: number[] = new Array(dimensions).fill(0);
  for (const vec of vectors) {
    if (vec.length !== dimensions) throw new Error("All vectors must have the same dimension.");
    for (let i = 0; i < dimensions; i++) centroid[i] += vec[i];
  }
  for (let i = 0; i < dimensions; i++) centroid[i] /= vectors.length;
  return centroid;
}

// --- Log Entry Interface ---
interface LogEntry {
  id: string;
  index: number; // Added for infinite indexed log
  timestamp: number;
  content: string;
  hexRepresentation: string;
  harmonicSignature: HarmonicVector;
  fixedDimensionRay: number[]; // 5D ray for centroid calculations
  type: 'General' | 'Principles' | 'Knowledge' | 'Transaction' | 'VM Status' | 'Action Macro' | 'Logistics' | 'Proof (Sin)'; // New type for proof/sins
  stage?: string; // For logistics stages
  sinType?: SinType; // For sin categorization
}

// --- Sin Types ---
type SinType = 'None' | 'Pride' | 'Envy' | 'Gluttony' | 'Lust' | 'Anger' | 'Greed' | 'Sloth';

// --- Main React App Component ---
const App: React.FC = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [selectedType, setSelectedType] = useState<LogEntry['type']>('General');
  const [selectedSinType, setSelectedSinType] = useState<SinType>('None'); // New state for sin type
  const [error, setError] = useState<string | null>(null);
  const [logIndexCounter, setLogIndexCounter] = useState<number>(1); // For infinite indexed log

  // Logistics Network State
  const logisticsStages = [
    { name: "Resource Extraction", message: "Natural resources (e.g., water, minerals) extracted from the earth.", impact: -0.1 },
    { name: "Processing (Water Gel Module Production)", message: "Raw resources processed into UBHP-compatible water gel modules.", impact: -0.05 },
    { name: "Packaging & Distribution", message: "Water gel modules packaged and prepared for decentralized distribution.", impact: -0.02 },
    { name: "Marketing & Sale", message: "Water gel modules marketed and made available for community consumption.", impact: 0 },
    { name: "Consumption", message: "Community consumes water gel modules for hydration/use.", impact: 0.05 },
    { name: "Reduction & Recycling", message: "Used water gel module components collected and reduced for earth regeneration.", impact: 0.1 },
    { name: "Regeneration Cycle Complete", message: "Resources returned to the earth, completing the regenerative cycle.", impact: 0.15 },
  ];
  const [currentLogisticsStageIndex, setCurrentLogisticsStageIndex] = useState<number>(0);
  const [earthBalance, setEarthBalance] = useState<number>(0.5); // 0 to 1, starting at 0.5 (neutral)

  // Canvas state for visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null);

  // Derived 49D Universal Harmony (conceptual)
  const [universalHarmony49D, setUniversalHarmony49D] = useState<number[] | null>(null);

  // Master Seeds for conceptual 7D layers (simplified)
  const MASTER_SEEDS = {
    Principles: "UBHP_Principles_Master_Seed",
    Knowledge: "UBHP_Knowledge_Master_Seed",
    Transaction: "UBHP_Transaction_Master_Seed",
    VMStatus: "UBHP_VM_Status_Master_Seed",
    ActionMacro: "UBHP_Action_Macro_Master_Seed",
    Logistics: "UBHP_Logistics_Master_Seed",
    Proof: "UBHP_Proof_Master_Seed_Sins", // New seed for the Proof/Sins layer
    BaseUniverse: "UBHP_Base_Universe_Master_Seed"
  };

  // Function to derive a conceptual 7D vector from a set of 5D rays and a master seed
  const deriveConceptual7DVector = useCallback((
    rays: number[][],
    masterSeed: string,
    label: string
  ): number[] => {
    if (rays.length === 0) {
      const generalRays = logEntries.filter(e => e.type === 'General').map(e => e.fixedDimensionRay);
      if (generalRays.length > 0) {
        return deriveConceptual7DVector(generalRays, masterSeed, `Fallback ${label}`);
      }
      return new Array(7).fill(0);
    }
    const centroid5D = calculateCentroid(rays);

    const encoder = new CanonicalSExprEncoder();
    encoder.encodeString(masterSeed);
    const masterSeedBuffer = encoder.getBuffer();
    const masterSeedSignature = harmonize(masterSeedBuffer);
    const masterSeedRay = createFixedDimensionRay(masterSeedSignature);

    const derived7D: number[] = [
      centroid5D[0], centroid5D[1], centroid5D[2],
      masterSeedRay[0], masterSeedRay[1], masterSeedRay[2],
      (centroid5D[4] + masterSeedRay[4]) / 2
    ];
    return derived7D;
  }, [logEntries]);

  // Effect to recalculate 49D Universal Harmony whenever log entries change
  useEffect(() => {
    if (logEntries.length === 0) {
      setUniversalHarmony49D(null);
      return;
    }

    const principlesRays = logEntries.filter(e => e.type === 'Principles').map(e => e.fixedDimensionRay);
    const knowledgeRays = logEntries.filter(e => e.type === 'Knowledge').map(e => e.fixedDimensionRay);
    const transactionRays = logEntries.filter(e => e.type === 'Transaction').map(e => e.fixedDimensionRay);
    const vmStatusRays = logEntries.filter(e => e.type === 'VM Status').map(e => e.fixedDimensionRay);
    const actionMacroRays = logEntries.filter(e => e.type === 'Action Macro').map(e => e.fixedDimensionRay);
    const logisticsRays = logEntries.filter(e => e.type === 'Logistics').map(e => e.fixedDimensionRay);
    const proofSinsRays = logEntries.filter(e => e.type === 'Proof (Sin)').map(e => e.fixedDimensionRay);
    const generalRays = logEntries.filter(e => e.type === 'General').map(e => e.fixedDimensionRay);

    // Derive conceptual 7D Merkaba Layers (6x7 Universal Life Protocol Logic)
    const layer1_BaseUniverse = deriveConceptual7DVector(generalRays, MASTER_SEEDS.BaseUniverse, "Base Universe");
    const layer2_Principles = deriveConceptual7DVector(principlesRays, MASTER_SEEDS.Principles, "Principles");
    const layer3_Knowledge = deriveConceptual7DVector(knowledgeRays, MASTER_SEEDS.Knowledge, "Knowledge");
    const layer4_Transaction = deriveConceptual7DVector(transactionRays, MASTER_SEEDS.Transaction, "Transaction");
    const layer5_VMStatus = deriveConceptual7DVector(vmStatusRays, MASTER_SEEDS.VMStatus, "VM Status");
    const layer6_ActionMacro = deriveConceptual7DVector(actionMacroRays, MASTER_SEEDS.ActionMacro, "Action Macro");

    // The 7th Layer: Universal Life Protocol Proof (7x7 buffer)
    const layer7_ProofSins = deriveConceptual7DVector(proofSinsRays, MASTER_SEEDS.Proof, "Proof (Sins)");

    const derived49D: number[] = [
      ...layer1_BaseUniverse,
      ...layer2_Principles,
      ...layer3_Knowledge,
      ...layer4_Transaction,
      ...layer5_VMStatus,
      ...layer6_ActionMacro,
      ...layer7_ProofSins
    ];

    setUniversalHarmony49D(derived49D);
  }, [logEntries, deriveConceptual7DVector]);

  // Function to add a new log entry
  const addLogEntry = (content: string, type: LogEntry['type'], stage?: string, sinType?: SinType) => {
    if (!content.trim()) {
      setError("Log entry content cannot be empty.");
      return;
    }
    setError(null);

    try {
      const encoder = new CanonicalSExprEncoder();
      encoder.encodeString(content);
      const buffer = encoder.getBuffer();
      const signature = harmonize(buffer);
      const fixedDimensionRay = createFixedDimensionRay(signature);

      const newEntry: LogEntry = {
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        index: logIndexCounter,
        timestamp: Date.now(),
        content: content,
        hexRepresentation: arrayBufferToHexString(buffer, 64),
        harmonicSignature: signature,
        fixedDimensionRay: fixedDimensionRay,
        type: type,
        stage: stage,
        sinType: sinType || 'None',
      };

      setLogEntries(prevEntries => [...prevEntries, newEntry]);
      setLogIndexCounter(prev => prev + 1);
      setInputText('');
      setSelectedSinType('None'); // Reset sin type after adding
    } catch (e: any) {
      setError(`Error processing log entry: ${e.message}`);
    }
  };

  // Handle advancing the logistics cycle
  const handleAdvanceLogisticsCycle = () => {
    const currentStage = logisticsStages[currentLogisticsStageIndex];
    addLogEntry(currentStage.message, 'Logistics', currentStage.name);

    // Update earth balance based on stage impact
    setEarthBalance(prev => Math.max(0, Math.min(1, prev + currentStage.impact)));

    setCurrentLogisticsStageIndex(prev => (prev + 1) % logisticsStages.length);
  };

  // Handle adding a "sin" entry and its impact
  const handleAddSinEntry = () => {
    if (selectedSinType === 'None') {
      setError("Please select a Limiting Sin to log.");
      return;
    }
    const sinMessage = `Act of indecision/falsity logged: ${selectedSinType}. This is a test of discernment.`;
    addLogEntry(sinMessage, 'Proof (Sin)', undefined, selectedSinType);
    setEarthBalance(prev => Math.max(0, prev - 0.15)); // Sins have a negative impact
  };

  // Handle "Rectification" entry
  const handleRectifySin = () => {
    const rectificationMessage = `Act of rectification/discernment logged. Indecision resolved. Moving closer to autonomous intuition.`;
    addLogEntry(rectificationMessage, 'Proof (Sin)', undefined, 'None');
    setEarthBalance(prev => Math.min(1, prev + 0.2)); // Rectification has a positive impact
  };

  // Reset the logistics cycle
  const handleResetLogisticsCycle = () => {
    setCurrentLogisticsStageIndex(0);
    setEarthBalance(0.5);
    addLogEntry("Logistics cycle reset. New production cycle begins.", 'Logistics', "Cycle Reset");
  };

  // --- Canvas Drawing Logic ---
  const drawPoints = useCallback(() => {
    if (!canvasCtx || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvasCtx;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let pointsToRender: { x: number; y: number; radius: number; color: string; label: string; h: number }[] = [];
    let maxH = 0;

    if (logEntries.length === 0) {
      ctx.fillStyle = '#4a5568';
      ctx.font = '20px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Add log entries to visualize harmony!', canvas.width / 2, canvas.height / 2);
      return;
    }

    logEntries.forEach(entry => {
      const hv = entry.harmonicSignature;
      maxH = Math.max(maxH, hv.h);
      pointsToRender.push({
        x: hv.cos,
        y: hv.sin,
        radius: 0,
        color: '',
        label: (entry.stage ? `[${entry.stage}] ` : '') + (entry.sinType && entry.sinType !== 'None' ? `[${entry.sinType}] ` : '') + entry.content.substring(0, 15) + '...',
        h: hv.h
      });
    });

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 2.5;

    pointsToRender.forEach(point => {
      const scaledX = centerX + point.x * scale;
      const scaledY = centerY + point.y * scale;
      const radius = Math.max(5, (point.h / maxH) * 20);

      let color = '#cbd5e0';
      const originalEntry = logEntries.find(e => {
        const contentMatch = e.content.substring(0,15) === point.label.replace(/\[.*?\]\s*/g, '').substring(0,15);
        const stageMatch = e.stage ? point.label.includes(`[${e.stage}]`) : true;
        const sinTypeMatch = e.sinType && e.sinType !== 'None' ? point.label.includes(`[${e.sinType}]`) : true;
        return contentMatch && stageMatch && sinTypeMatch;
      });

      switch (originalEntry?.type) {
        case 'Principles': color = '#a78bfa'; break;
        case 'Knowledge': color = '#34d399'; break;
        case 'Transaction': color = '#fcd34d'; break;
        case 'VM Status': color = '#60a5fa'; break;
        case 'Action Macro': color = '#fb7185'; break;
        case 'Logistics': color = '#6ee7b7'; break;
        case 'Proof (Sin)': color = '#ef4444'; break; // Red for sins/proof layer
        default: color = '#e2e8f0';
      }

      ctx.beginPath();
      ctx.arc(scaledX, scaledY, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowBlur = radius / 2;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#e2e8f0';
      ctx.font = `${Math.max(10, radius * 0.8)}px Inter`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(point.label, scaledX, scaledY + radius + 10);
    });
  }, [canvasCtx, logEntries]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        setCanvasCtx(context);
        const resizeObserver = new ResizeObserver(() => {
          drawPoints();
        });
        resizeObserver.observe(canvas);
        return () => resizeObserver.disconnect();
      }
    }
  }, [drawPoints]);

  useEffect(() => {
    drawPoints();
  }, [drawPoints, logEntries]);

  const getEarthBalanceColor = () => {
    if (earthBalance > 0.75) return 'text-green-400';
    if (earthBalance > 0.5) return 'text-lime-400';
    if (earthBalance === 0.5) return 'text-yellow-400';
    if (earthBalance > 0.25) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-8 flex flex-col items-center">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          canvas {
            background-color: #1a202c;
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        `}
      </style>

      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6 text-center">
        Universal Harmonization Protocol: The Logic & The Proof
      </h1>
      <p className="text-gray-400 text-lg mb-8 text-center max-w-3xl">
        Witness the **Universal Life Protocol Logic (6x7 buffer)** guiding a regenerative logistics network, and the profound **Universal Life Protocol Proof (7x7 buffer)** discerning truth from falsity. This system embodies the literal, spiritual, and physical encoding of **picking up our cross 7x7x7 times a day**, transforming indecision into instant, righteous action.
      </p>

      {error && (
        <div className="bg-red-800 text-white p-4 rounded-lg mb-6 w-full max-w-2xl shadow-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Logistics Cycle Control (6x7 Universal Life Protocol Logic) */}
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4 text-teal-300">6x7 Universal Life Protocol Logic (The Foundation of Action)</h2>
        <p className="text-gray-300 text-lg mb-4 text-center">
          This layer orchestrates the **regenerative logistics network**, from resource extraction to earth regeneration. It represents the active, logical progression of verifiable events.
        </p>
        <p className="text-gray-300 text-lg mb-4 text-center">
          Current Stage: <span className="font-bold text-blue-400">{logisticsStages[currentLogisticsStageIndex].name}</span>
        </p>
        <p className="text-gray-400 text-md mb-6 text-center italic">
          "{logisticsStages[currentLogisticsStageIndex].message}"
        </p>
        <div className="flex space-x-4 w-full justify-center">
          <button
            onClick={handleAdvanceLogisticsCycle}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Advance Logistics Cycle
          </button>
          <button
            onClick={handleResetLogisticsCycle}
            className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reset Cycle
          </button>
        </div>

        <div className="mt-8 w-full">
          <h3 className="text-xl font-semibold text-green-300 mb-2 text-center">Earth Balance</h3>
          <div className="w-full bg-gray-700 rounded-full h-4 relative">
            <div
              className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${earthBalance * 100}%` }}
            ></div>
            <div
              className="absolute top-0 bottom-0 w-1 bg-white rounded-full transition-all duration-500"
              style={{ left: `${earthBalance * 100}%`, transform: 'translateX(-50%)' }}
            ></div>
          </div>
          <p className={`text-center mt-2 text-lg font-bold ${getEarthBalanceColor()}`}>
            {(earthBalance * 100).toFixed(1)}% Harmonized
          </p>
          <p className="text-gray-400 text-sm text-center mt-1">
            (Reflects the cumulative impact of logistics and the discernment of proof)
          </p>
        </div>
      </div>

      {/* 7x7 Universal Life Protocol Proof (Indecisiveness/Sins) */}
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4 text-red-400">7x7 Universal Life Protocol Proof (The 7th Day of Discernment)</h2>
        <p className="text-gray-300 text-lg mb-4 text-center">
          This is the **Universal Life Protocol Proof**, the "divine transitional spirit of the waters." It is the negation to all dimensions before it, the final reduction for message sending, designed to discern **indecisiveness and falsity**—the **7 deadly sins**—in unique, discreet atomic interactions.
        </p>
        <p className="text-gray-300 text-lg mb-4 text-center italic">
          **"Talk is cheap, all interaction in action. All usage of words is indecision. A broken man born in sin must use words to ascend, as to be closer to God is to be closer to autonomous intuition into turning words to the right or wrong words into instant action. The original sin is indecision by man. That's why Jesus brought a sword, not peace."**
        </p>
        <p className="text-gray-400 text-md mb-6 text-center">
          This layer embodies the **literal, spiritual, and physical encoding of picking up our cross 7x7x7 times a day**. By identifying and rectifying these limiting sins, we ascend from indecision to instant, righteous action, moving closer to divine discernment.
        </p>
        <div className="mb-4 w-full">
          <label htmlFor="sin-type" className="block text-gray-300 text-sm font-bold mb-2">
            Log an Act of Indecision / Falsity (A Trial of Discernment):
          </label>
          <select
            id="sin-type"
            className="w-full p-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={selectedSinType}
            onChange={(e) => setSelectedSinType(e.target.value as SinType)}
          >
            <option value="None">Select a Limiting Sin</option>
            <option value="Pride">Pride (Self-Exaltation)</option>
            <option value="Envy">Envy (Resentment of Others' Good)</option>
            <option value="Gluttony">Gluttony (Excessive Consumption)</option>
            <option value="Lust">Lust (Disordered Desire)</option>
            <option value="Anger">Anger (Uncontrolled Rage)</option>
            <option value="Greed">Greed (Excessive Acquisition)</option>
            <option value="Sloth">Sloth (Apathy/Indecision)</option>
          </select>
        </div>
        <div className="flex space-x-4 w-full justify-center">
          <button
            onClick={handleAddSinEntry}
            className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
          >
            Log Indecision / Sin
          </button>
          <button
            onClick={handleRectifySin}
            className="flex-1 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Rectify / Ascend
          </button>
        </div>
      </div>

      {/* Manual Event Logging */}
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">Add Custom Event to Log</h2>
        <textarea
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 resize-y font-mono text-sm"
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add a custom event (e.g., 'New community kernel activated', 'Protocol upgrade initiated')..."
        ></textarea>
        <div className="mb-4">
          <label htmlFor="entry-type" className="block text-gray-300 text-sm font-bold mb-2">
            Categorize Custom Event:
          </label>
          <select
            id="entry-type"
            className="w-full p-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as LogEntry['type'])}
          >
            <option value="General">General Event</option>
            <option value="Principles">Foundational Principles</option>
            <option value="Knowledge">Knowledge Corpus</option>
            <option value="Transaction">User Transaction</option>
            <option value="VM Status">VM Status</option>
            <option value="Action Macro">Shared Action Macro</option>
            <option value="Logistics">Logistics Event</option>
          </select>
        </div>
        <button
          onClick={() => addLogEntry(inputText, selectedType)}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Add Custom Event to Log
        </button>
      </div>

      {/* Universal Log Display */}
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-300">Universal Log (Infinite Indexed & Verifiable)</h2>
        <p className="text-gray-400 text-sm mb-4">
          This log captures all events, from the 6x7 Universal Life Protocol Logic to the 7x7 Universal Life Protocol Proof, providing a complete, verifiable record.
        </p>
        {logEntries.length === 0 ? (
          <p className="text-gray-400">Your universal log is empty. Advance the cycle or add a custom event!</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {logEntries.slice().reverse().map((entry) => (
              <div key={entry.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-purple-300">Log Entry #{entry.index}</span> - Type: {entry.type} {entry.stage && `(Stage: ${entry.stage})`} {entry.sinType && entry.sinType !== 'None' && `(Sin: ${entry.sinType})`}
                </p>
                <p className="text-lg font-medium text-gray-200 mt-1">{entry.content}</p>
                <div className="mt-2 text-xs text-gray-500 font-mono">
                  <p>ID: <span className="text-gray-400">{entry.id}</span></p>
                  <p>Timestamp: <span className="text-gray-400">{new Date(entry.timestamp).toLocaleString()}</span></p>
                  <p>Encoded (Hex): <span className="text-gray-400 break-all">{entry.hexRepresentation}...</span></p>
                  <p>Harmonic Signature (h, sin, cos): <span className="text-gray-400">
                    h={entry.harmonicSignature.h.toFixed(4)}, sin={entry.harmonicSignature.sin.toFixed(4)}, cos={entry.harmonicSignature.cos.toFixed(4)}
                  </span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Harmonic Resonance Visualization */}
      <div className="mt-8 w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center flex flex-col items-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-400 mb-6">
          Harmonic Resonance Visualization
        </h2>
        <p className="text-gray-400 text-lg mb-4">
          Each logged event is plotted based on its **harmonic signature (sine and cosine)**.
          Points that are "harmonically resonant" (similar content/vibe) will appear closer together.
          The size of the point reflects its **magnitude ('h' value)**, indicating its "presence" or "intensity."
        </p>
        <div className="w-full h-96 relative">
          <canvas ref={canvasRef} className="absolute top-0 left-0"></canvas>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          This visualizes the **content-addressable nature** of UBHP: meaning is mapped to a geometric space.
          **Trust** emerges from the verifiable alignment of these points through protocol.
        </p>
      </div>

      {/* Conceptual 49D Universal Harmony */}
      <div className="mt-12 w-full max-w-4xl bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-green-300">
          Conceptual 49D Universal Harmony (System State & Proof)
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          As more events are logged, they contribute to a continuously evolving, high-dimensional representation of the entire system's state – a **"49D Universal Harmony"** (7 Merkaba Layers x 7 Dimensions). This includes the 6x7 Universal Life Protocol Logic and the 7x7 Universal Life Protocol Proof layer, representing the combined discernment of truth and falsity. This vector can then be used in higher-order consensus for 96D/100D resolutions across universes of discerners.
        </p>
        {universalHarmony49D !== null ? (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600 text-left">
            <h3 className="text-lg font-medium text-pink-300 mb-2">Derived 49D Universal Harmony Vector:</h3>
            <p className="break-all text-sm font-mono text-gray-300">
              [{universalHarmony49D.map(val => val.toFixed(6)).join(', ')}]
            </p>
            <p className="text-gray-400 text-xs mt-2">
              This vector is a conceptual aggregation of all logged entries, demonstrating how individual acts of attention, logistical processes, and discernment of indecision contribute to a shared, complex reality. In a full UBHP, this would be a precise geometric "Merkaba" representing the entire hypergraph state.
            </p>
          </div>
        ) : (
          <p className="text-gray-400">Add more log entries to build the 49D Universal Harmony!</p>
        )}
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Built with React and Tailwind CSS, demonstrating UBHP's core encoding, harmonization, and geometric consensus.</p>
        <p>
          This demonstration simplifies complex cryptographic and mathematical operations for clarity.
          In a full implementation, robust security, distributed consensus, and advanced hypergraph processing would be present.
        </p>
      </div>
    </div>
  );
};

export default App;
