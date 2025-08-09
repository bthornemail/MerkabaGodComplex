import React, { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
import './App.css';
// IMPORTANT: Add this line to the top of your main entry file (e.g., src/main.tsx):
import 'bootstrap/dist/css/bootstrap.min.css';
// NEW DEPENDENCIES for 3D Graph. Run: npm install react-force-graph-3d three
import ForceGraph3D from 'react-force-graph-3d';
import {
    Container, Row, Col, Card, Button, Form, ProgressBar,
    Alert, ListGroup, Accordion, Spinner, Tabs, Tab, Badge, Modal, Table, ButtonGroup
} from 'react-bootstrap';

// CUE Integration
import { cueBridge, type CueKnowledgeEvent } from './services/cue-bridge';

// Training manager interface for browser compatibility
interface TrainingStatus {
    hasSession: boolean;
    state: { isTraining: boolean; currentCycle: number; totalCycles: number };
    message: string;
}

interface TrainingManager {
    createTrainingSession: (config?: Record<string, unknown>) => Promise<void>;
    startTraining: () => Promise<void>;
    getStatus: () => TrainingStatus;
    subscribe: (callback: (status: TrainingStatus) => void) => void;
}

// Mock training manager for browser environment
const trainingManager: TrainingManager = {
    async createTrainingSession(config?: Record<string, unknown>) {
    console.log('🚀 Mock training session created with config:', config);
  },
  async startTraining() {
    console.log('📚 Mock training started');
  },
    getStatus(): TrainingStatus {
        return {
            hasSession: false,
            state: { isTraining: false, currentCycle: 0, totalCycles: 0 },
            message: 'Browser environment - training mocked'
        };
    },
    subscribe(callback: (status: TrainingStatus) => void) {
    // Mock subscription - call immediately with mock status
    setTimeout(() => callback(this.getStatus()), 100);
  }
};

// --- HELPER ICONS ---
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>;
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>;

// --- CUE / UBHP Core ---

/**
 * Represents a Harmonic Vector, the core data structure of the UBHP.
 * It's a multi-dimensional signature of a piece of information.
 */
interface HarmonicSignature {
    id: string;
    text: string;
    sourceFile: string;
    sExpr: ArrayBuffer;
    vector: number[]; // Geometric position [x, y, z]
    h: number; // Euclidean norm ("Hypotenuse")
    sin: number;
    cos: number;
    tan: number;
}

/**
 * Encodes a string into a canonical UBHP S-expression (simplified as a typed array).
 * In a full implementation, this would be a complex TLV (Type-Length-Value) encoder.
 * @param text The input string.
 * @returns An ArrayBuffer representing the S-expression.
 */
const textToSExpr = (text: string): ArrayBuffer => {
    return new TextEncoder().encode(text).buffer;
};

/**
 * The core CUE function. Generates a Harmonic Signature from a binary S-expression.
 * This turns raw data into a point in a high-dimensional conceptual space.
 * @param sExpr The binary S-expression (ArrayBuffer).
 * @param text The original text for reference.
 * @param sourceFile The source file of the text.
 * @returns A HarmonicSignature.
 */
const harmonize = (sExpr: ArrayBuffer, text: string, sourceFile: string): HarmonicSignature => {
    const view = new Uint8Array(sExpr);
    const values = Array.from(view);

    const h = Math.hypot(...values); // Euclidean norm
    const sin = Math.sin(h);
    const cos = Math.cos(h);
    const tan = Math.tan(h);

    // Use the harmonic properties to generate a 3D vector for visualization
    // This maps the high-dimensional data to a 3D space based on its "vibration"
    const vector = [
        Math.sin(sin * Math.PI) * 200, // X-coordinate
        Math.cos(cos * Math.PI) * 200, // Y-coordinate
        Math.sin(tan * Math.PI) * 200  // Z-coordinate
    ];

    const id = `CUE-${h.toFixed(2)}-${sin.toFixed(3)}-${cos.toFixed(3)}`;

    return { id, text, sourceFile, sExpr, vector, h, sin, cos, tan };
};

// --- MAIN APP COMPONENT ---
const App = () => {
    // --- STATE MANAGEMENT ---
    const [status, setStatus] = useState<'idle' | 'processing' | 'paused' | 'done'>('idle');
    interface LogEntry { timestamp: string; message: string; type: string }
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<FileList | null>(null);
    const [chunkingStrategy, setChunkingStrategy] = useState('paragraph');
    const [fileFilter, setFileFilter] = useState('.txt, .md, .docx');

    // --- DATA STRUCTURES & CACHING ---
    type KnowledgeTries = Record<string, Record<string, Record<string, string>>>;
    const [knowledgeTries, setKnowledgeTries] = useState<KnowledgeTries>({});
    type TransformMeta = { model: string; chunkingStrategy: string };
    type SourceMeta = { file: string; chunkIndex: number; text: string; signatureId: string };
    type Provenance = { transform: TransformMeta; source: SourceMeta };
    const [incidenceTrie, setIncidenceTrie] = useState<Record<string, Provenance[]>>({});
    const [modelStats, setModelStats] = useState<Record<string, { family: string; parameter_size: string; quantization_level: string; context_length: string }>>({});
    const [harmonicSignatures, setHarmonicSignatures] = useState<{ [id: string]: HarmonicSignature }>({});
    const [cueIntegrationEnabled, setCueIntegrationEnabled] = useState(true);
    const [autonomousTrainingEnabled, setAutonomousTrainingEnabled] = useState(false);
    const [trainingStatus, setTrainingStatus] = useState<TrainingStatus | null>(null);


    // --- UI State for Modals ---
    const [showIncidenceModal, setShowIncidenceModal] = useState(false);
    const [showGraphModal, setShowGraphModal] = useState(false);
    const [selectedTriple, setSelectedTriple] = useState<[string, string, string] | null>(null);

    // --- REFS FOR ASYNC OPERATIONS ---
    const isPausedRef = useRef(false);
    const shouldStopRef = useRef(false);

    // --- HELPER FUNCTIONS ---
    const addLog = useCallback((message: string, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [{ timestamp, message, type }, ...prev]);
    }, []);

    // --- INITIALIZATION & CACHE LOADING ---
    useEffect(() => {
        try {
            const cachedTries = localStorage.getItem('knowledgeTries');
            const cachedIncidence = localStorage.getItem('incidenceTrie');
            const cachedSignatures = localStorage.getItem('harmonicSignatures');
            if (cachedTries) setKnowledgeTries(JSON.parse(cachedTries));
            if (cachedIncidence) setIncidenceTrie(JSON.parse(cachedIncidence));
            if (cachedSignatures) setHarmonicSignatures(JSON.parse(cachedSignatures));
            addLog("Loaded cached knowledge base from previous session.", 'info');
    } catch {
            addLog("Could not load cached data.", 'warning');
        }

        // Setup CUE event subscription
        if (cueIntegrationEnabled) {
            const handleCueEvent = (event: CueKnowledgeEvent) => {
                addLog(`🌌 CUE Event: ${event.triples.length} triples processed with signature ${event.harmonicVector.id}`, 'info');
            };
            
            cueBridge.subscribe(handleCueEvent);
            addLog("CUE integration enabled - events will be forwarded to CUE Network", 'success');
            
            return () => cueBridge.unsubscribe(handleCueEvent);
        }

        // Setup autonomous training subscription
    const handleTrainingStatus = (status: TrainingStatus) => {
            setTrainingStatus(status);
        };
        
        trainingManager.subscribe(handleTrainingStatus);
        setTrainingStatus(trainingManager.getStatus());
        
        return () => {
            // Cleanup handled by training manager
        };
    }, [addLog, cueIntegrationEnabled]);

    // --- OLLAMA & CORE LOGIC ---
    // Vite env var for Ollama base URL (e.g., https://ollama.example.com or http://localhost:11434 for dev)
    declare global {
        interface ImportMetaEnv { readonly VITE_OLLAMA_BASE_URL?: string }
        interface ImportMeta { readonly env: ImportMetaEnv }
    }
    const OLLAMA_BASE_URL: string | undefined = import.meta.env?.VITE_OLLAMA_BASE_URL;

    useEffect(() => {
        const fetchModelData = async () => {
            try {
                const base = OLLAMA_BASE_URL ?? '';
                const tagsResponse = await fetch(`${base}/api/tags`);
                if (!tagsResponse.ok) throw new Error("Ollama server not reachable.");
                const tagsData = await tagsResponse.json() as { models?: Array<{ name?: string }> };
                const modelNames: string[] = (Array.isArray(tagsData.models) ? tagsData.models : [])
                    .filter((m) => typeof m?.name === 'string' && !m.name!.includes("embed"))
                    .map((m) => m.name as string);
                setAvailableModels(modelNames);
                if (modelNames.length > 0 && !selectedModel) setSelectedModel(modelNames[0]);

                                const stats: Record<string, { family: string; parameter_size: string; quantization_level: string; context_length: string }> = {};
                for (const name of modelNames) {
                    const base = OLLAMA_BASE_URL ?? '';
                    const showResponse = await fetch(`${base}/api/show`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
                    if (showResponse.ok) {
                        const showData = await showResponse.json();
                                                const contextParam = String(showData.parameters || '')
                                                    .split('\n').find((p: string) => p.startsWith('num_ctx'));
                        stats[name] = {
                            family: showData.details.family,
                            parameter_size: showData.details.parameter_size,
                            quantization_level: showData.details.quantization_level,
                            context_length: contextParam ? contextParam.split(/\s+/)[1] : 'N/A'
                        };
                    }
                }
                setModelStats(stats);
                setError(null);
                        } catch (e: unknown) {
                                setError("Could not connect to Ollama. Ensure it's running with CORS configured.");
                                const msg = e instanceof Error ? e.message : String(e);
                                addLog(`Error: Could not connect to Ollama. ${msg}`, 'danger');
            }
        };
        fetchModelData();
    }, [addLog, selectedModel, OLLAMA_BASE_URL]);

        const extractTriples = async (textChunk: string, model: string): Promise<[string, string, string][]> => {
        const prompt = `You are a knowledge extraction engine. Extract factual statements from the text as (Subject, Predicate, Object) triples. Output a valid JSON object: { "triples": [["s","p","o"], ...] }. If no facts are found, return an empty list. Text: "${textChunk}" Output:`;
        addLog(`Sending chunk to ${model} for analysis...`, 'info');
        try {
            const base = OLLAMA_BASE_URL ?? '';
            const response = await fetch(`${base}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], format: 'json', stream: false }) });
            if (!response.ok) throw new Error(`Ollama API error: ${response.statusText}`);
            const data = await response.json();
                        const content = JSON.parse(String(data?.message?.content ?? '{}'));
                        return Array.isArray(content.triples) ? (content.triples as [string, string, string][]) : [];
                } catch (e: unknown) {
                        const msg = e instanceof Error ? e.message : String(e);
                        addLog(`Error parsing or extracting triples: ${msg}`, 'danger');
            return [];
        }
    };

    const startProcessing = async () => {
                if (!files || files.length === 0) { addLog("No files selected.", 'warning'); return; }
        if (!selectedModel) { addLog("No Ollama model selected.", 'warning'); return; }

        setStatus('processing');
        shouldStopRef.current = false;
        isPausedRef.current = false;
        addLog(`Starting processing run with model: ${selectedModel}`, 'info');

        const allChunks: { chunk: string; fileName: string; chunkIndex: number }[] = [];
        const allowedExtensions = fileFilter.split(',').map(ext => ext.trim().toLowerCase());
        addLog(`Reading files with filter: [${allowedExtensions.join(', ')}]`, 'info');
        
        const filteredFiles = Array.from(files).filter((file: File) => 
            allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        );

        addLog(`Found ${filteredFiles.length} files matching the filter.`, 'info');

        for (const file of filteredFiles) {
            try {
                const text = await file.text();
                let chunks: string[] = [];
                if (chunkingStrategy === 'paragraph') {
                    chunks = text.split(/\n\s*\n/).filter(p => p.trim().length > 50);
                } else if (chunkingStrategy === 'fixed') {
                    const chunkSize = 500;
                    for (let i = 0; i < text.length; i += chunkSize) chunks.push(text.substring(i, i + chunkSize));
                }
                chunks.forEach((chunk, index) => allChunks.push({ chunk, fileName: file.name, chunkIndex: index }));
            } catch (e: unknown) { 
                const msg = e instanceof Error ? e.message : String(e);
                addLog(`Could not read file ${file.name}: ${msg}`, 'danger'); 
            }
        }
        
        setProgress({ current: 0, total: allChunks.length });

        for (let i = 0; i < allChunks.length; i++) {
            if (shouldStopRef.current) { addLog("Processing stopped by user.", 'warning'); setStatus('idle'); break; }
            while (isPausedRef.current) { await new Promise(r => setTimeout(r, 500)); }

            const { chunk, fileName, chunkIndex } = allChunks[i];
            addLog(`[${i + 1}/${allChunks.length}] Processing chunk from ${fileName}...`, 'info');
            
            // Generate Harmonic Signature for the chunk
            const sExpr = textToSExpr(chunk);
            const signature = harmonize(sExpr, chunk, fileName);
            setHarmonicSignatures(prev => {
                const newSignatures = {...prev, [signature.id]: signature};
                localStorage.setItem('harmonicSignatures', JSON.stringify(newSignatures));
                return newSignatures;
            });
            addLog(`Generated Harmonic Signature: ${signature.id}`, 'secondary');

            const triples = await extractTriples(chunk, selectedModel);
            
            if (Array.isArray(triples) && triples.length > 0) {
                updateDataStructures(triples, { model: selectedModel, chunkingStrategy }, { file: fileName, chunkIndex, text: chunk, signatureId: signature.id });
                
                // Send to CUE if integration is enabled
                if (cueIntegrationEnabled) {
                    const cueTriples = triples.map(([subject, predicate, object]) => ({ subject, predicate, object }));
                    const cueEvent = cueBridge.createKnowledgeEvent(
                        cueTriples,
                        { sourceFile: fileName, chunkIndex, model: selectedModel, chunkingStrategy, signatureId: signature.id },
                        chunk
                    );
                    addLog(`🌌 Created CUE event ${cueEvent.id} with ${triples.length} triples`, 'secondary');
                }
            } else {
                addLog('No valid triples found in this chunk.', 'secondary');
            }
            setProgress({ current: i + 1, total: allChunks.length });
        }
        
        if (!shouldStopRef.current) { 
            setStatus('done'); 
            addLog("All files processed successfully!", 'success'); 
            
            // Process CUE events if integration is enabled
            if (cueIntegrationEnabled) {
                addLog("Forwarding events to CUE Network and CLARION-MDU...", 'info');
                await cueBridge.processPendingEvents();
                const stats = cueBridge.getStats();
                addLog(`📊 CUE Stats: ${stats.processedEvents}/${stats.totalEvents} events processed, ${stats.totalTriples} total triples`, 'success');
                
                // Start autonomous training if enabled
                if (autonomousTrainingEnabled && !trainingStatus?.state?.isTraining) {
                    addLog("🚀 Starting autonomous training session...", 'info');
                    try {
                        await trainingManager.createTrainingSession({
                            learningRate: 0.02,
                            qualityThreshold: 0.75,
                            autonomyTarget: 0.85,
                            maxTrainingCycles: 50
                        });
                        await trainingManager.startTraining();
                        addLog("✅ Autonomous training started!", 'success');
                    } catch (error: unknown) {
                        const msg = error instanceof Error ? error.message : String(error);
                        addLog(`❌ Failed to start training: ${msg}`, 'danger');
                    }
                }
            }
        }
    };

    const updateDataStructures = (triples: [string, string, string][], transform: TransformMeta, source: SourceMeta) => {
        addLog(`Updating knowledge base with ${triples.length} new fact(s).`, 'success');
        
        setKnowledgeTries(prev => {
            const newTries: KnowledgeTries = { ...prev };
            if (!newTries[transform.model]) newTries[transform.model] = {};
            triples.forEach(([subject, predicate, obj]) => {
                if (!newTries[transform.model][subject]) newTries[transform.model][subject] = {};
                newTries[transform.model][subject][predicate] = obj;
            });
            localStorage.setItem('knowledgeTries', JSON.stringify(newTries));
            return newTries;
        });

        setIncidenceTrie(prev => {
            const newIncidence: Record<string, Provenance[]> = { ...prev };
            triples.forEach((triple) => {
                const tripleKey = JSON.stringify(triple);
                if (!newIncidence[tripleKey]) newIncidence[tripleKey] = [];
                const provenance = { transform, source };
                newIncidence[tripleKey].push(provenance);
            });
            localStorage.setItem('incidenceTrie', JSON.stringify(newIncidence));
            return newIncidence;
        });
    };

    // --- UI EVENT HANDLERS ---
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles(e.target.files);
    };

    const handleStart = () => {
        setLogs([]);
        setProgress({ current: 0, total: 0 });
        setError(null);
        setTimeout(startProcessing, 100);
    };

    const handlePause = () => {
        isPausedRef.current = !isPausedRef.current;
        setStatus(isPausedRef.current ? 'paused' : 'processing');
        addLog(isPausedRef.current ? "Processing paused." : "Processing resumed.", 'warning');
    };

    const handleReset = () => {
        shouldStopRef.current = true;
        isPausedRef.current = false;
        setStatus('idle');
        setLogs([]);
        setProgress({ current: 0, total: 0 });
        setKnowledgeTries({});
        setIncidenceTrie({});
        setHarmonicSignatures({});
        setFiles(null);
        setError(null);
        localStorage.removeItem('knowledgeTries');
        localStorage.removeItem('incidenceTrie');
        localStorage.removeItem('harmonicSignatures');
        addLog("Cache and all data cleared.", 'danger');
        const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';
    };
    
    const handleTripleClick = (triple: [string, string, string]) => {
        setSelectedTriple(triple);
        setShowIncidenceModal(true);
    };

    const handleExport = () => {
        const data = JSON.stringify({ knowledgeTries, incidenceTrie, harmonicSignatures }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'knowledge-base.json';
        a.click();
        URL.revokeObjectURL(url);
        addLog("Knowledge base exported.", 'success');
    };

    const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonText = (e.target && (e.target as FileReader).result) as string | null;
                const data = JSON.parse(String(jsonText ?? '{}')) as { knowledgeTries?: KnowledgeTries; incidenceTrie?: Record<string, Provenance[]>; harmonicSignatures?: Record<string, HarmonicSignature> };
                if (data.knowledgeTries && data.incidenceTrie && data.harmonicSignatures) {
                    setKnowledgeTries(data.knowledgeTries);
                    setIncidenceTrie(data.incidenceTrie);
                    setHarmonicSignatures(data.harmonicSignatures);
                    localStorage.setItem('knowledgeTries', JSON.stringify(data.knowledgeTries));
                    localStorage.setItem('incidenceTrie', JSON.stringify(data.incidenceTrie));
                    localStorage.setItem('harmonicSignatures', JSON.stringify(data.harmonicSignatures));
                    addLog("Successfully imported knowledge base.", 'success');
                } else {
                    addLog("Invalid import file format.", 'danger');
                }
            } catch (error: unknown) {
                const msg = error instanceof Error ? error.message : String(error);
                addLog(`Error importing file: ${msg}`, 'danger');
            }
        };
        reader.readAsText(file);
    };

    const handleShare = () => {
        const data = JSON.stringify({ knowledgeTries, incidenceTrie, harmonicSignatures });
        navigator.clipboard.writeText(data).then(() => {
            addLog("Knowledge base JSON copied to clipboard.", 'success');
        }, () => {
            addLog("Failed to copy to clipboard.", 'danger');
        });
    };

    // --- RENDER ---
    return (
        <Container fluid data-bs-theme="dark" className="bg-dark text-light min-vh-100 p-4">
            <Header onExport={handleExport} onImport={handleImport} onShare={handleShare} onShowGraph={() => setShowGraphModal(true)} />
            {error && <OllamaWarning message={error} />}

            <Row className="mt-4">
                <Col lg={5} className="d-flex flex-column gap-4">
                    <ControlPanel {...{ status, files, knowledgeTries, availableModels, selectedModel, setSelectedModel, chunkingStrategy, setChunkingStrategy, fileFilter, setFileFilter, handleFileChange, handleStart, handlePause, handleReset, cueIntegrationEnabled, setCueIntegrationEnabled, autonomousTrainingEnabled, setAutonomousTrainingEnabled, trainingStatus }} />
                    <ProgressPanel status={status} progress={progress} />
                    <LogPanel logs={logs} />
                </Col>
                <Col lg={7} className="d-flex flex-column gap-4 mt-4 mt-lg-0">
                    <ResultsPanel {...{knowledgeTries, incidenceTrie, modelStats, harmonicSignatures, handleTripleClick}} />
                </Col>
            </Row>
            
            <IncidenceModal show={showIncidenceModal} handleClose={() => setShowIncidenceModal(false)} triple={selectedTriple} provenanceData={selectedTriple ? incidenceTrie[JSON.stringify(selectedTriple)] : []} />
            <GraphModal show={showGraphModal} handleClose={() => setShowGraphModal(false)} incidenceTrie={incidenceTrie} />
        </Container>
    );
};

// --- SUB-COMPONENTS ---
const Header = ({ onExport, onImport, onShare, onShowGraph }: { onExport: () => void; onImport: (e: ChangeEvent<HTMLInputElement>) => void; onShare: () => void; onShowGraph: () => void }) => (
    <header className="pb-3 mb-3 border-bottom border-secondary">
        <div className="d-flex justify-content-between align-items-center">
            <div>
                <h1>Advanced Knowledge Builder</h1>
                <p className="text-muted mb-0">Featuring Model Stats, Caching, Filtering & 3D Graph Visualization</p>
            </div>
            <ButtonGroup>
                <Button variant="outline-primary" onClick={onShowGraph}>View Graph</Button>
                <Button variant="outline-secondary" onClick={onShare}>Share</Button>
                <Button variant="outline-success" onClick={onExport}>Export</Button>
                <label className="btn btn-outline-info">
                    Import
                    <input type="file" accept=".json" onChange={onImport} className="hiddenInput" />
                </label>
            </ButtonGroup>
        </div>
    </header>
);

const OllamaWarning = ({ message }: { message: string }) => <Alert variant="danger"><Alert.Heading>Connection Error</Alert.Heading><p>{message}</p><p className="mb-0 small"><strong>To fix this:</strong> Run <code>OLLAMA_ORIGINS='*' ollama serve</code> in your terminal and restart Ollama.</p></Alert>;

const ControlPanel = ({ status, files, knowledgeTries, availableModels, selectedModel, setSelectedModel, chunkingStrategy, setChunkingStrategy, fileFilter, setFileFilter, handleFileChange, handleStart, handlePause, handleReset, cueIntegrationEnabled, setCueIntegrationEnabled, autonomousTrainingEnabled, setAutonomousTrainingEnabled, trainingStatus }: {
    status: 'idle' | 'processing' | 'paused' | 'done';
    files: FileList | null;
    knowledgeTries: KnowledgeTries;
    availableModels: string[];
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    chunkingStrategy: string;
    setChunkingStrategy: (strategy: string) => void;
    fileFilter: string;
    setFileFilter: (filter: string) => void;
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleStart: () => void;
    handlePause: () => void;
    handleReset: () => void;
    cueIntegrationEnabled: boolean;
    setCueIntegrationEnabled: (enabled: boolean) => void;
    autonomousTrainingEnabled: boolean;
    setAutonomousTrainingEnabled: (enabled: boolean) => void;
    trainingStatus: TrainingStatus | null;
}) => (
    <Card bg="dark" border="secondary">
        <Card.Header as="h5">Controls</Card.Header>
        <Card.Body>
            <Form.Group className="mb-3">
                <Form.Label>Select Chat Model</Form.Label>
                <Form.Select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} disabled={status.startsWith('proc')}><option>No models found...</option>{availableModels.map(m => <option key={m} value={m}>{m}</option>)}</Form.Select>
            </Form.Group>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Chunking Strategy</Form.Label>
                        <Form.Select value={chunkingStrategy} onChange={e => setChunkingStrategy(e.target.value)} disabled={status.startsWith('proc')}>
                            <option value="paragraph">By Paragraph</option>
                            <option value="fixed">Fixed Size (500 chars)</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>File Filter</Form.Label>
                        <Form.Control type="text" value={fileFilter} onChange={e => setFileFilter(e.target.value)} placeholder=".txt, .md" disabled={status.startsWith('proc')} />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3">
                <Form.Check 
                    type="switch" 
                    id="cue-integration-switch" 
                    label="CUE Network Integration" 
                    checked={cueIntegrationEnabled} 
                    onChange={e => setCueIntegrationEnabled(e.target.checked)} 
                    disabled={status.startsWith('proc')} 
                />
                <Form.Text className="text-muted">Forward extracted knowledge to CUE Network and CLARION-MDU</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Check 
                    type="switch" 
                    id="autonomous-training-switch" 
                    label="Autonomous Training" 
                    checked={autonomousTrainingEnabled} 
                    onChange={e => setAutonomousTrainingEnabled(e.target.checked)} 
                    disabled={status.startsWith('proc') || !cueIntegrationEnabled} 
                />
                <Form.Text className="text-muted">
                    Enable autonomous model training from extracted knowledge
                    {trainingStatus?.state?.isTraining && (
                        <span className="text-warning ms-2">
                            🚀 Training Active (Cycle {trainingStatus.state.currentCycle}/{trainingStatus.state.totalCycles})
                        </span>
                    )}
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Select Source Directory</Form.Label>
                {/* Allow directory selection via non-standard attribute */}
                {(() => {
                    type DirectoryInputProps = React.InputHTMLAttributes<HTMLInputElement> & { webkitdirectory?: string };
                    const dirProps: DirectoryInputProps = { webkitdirectory: 'true' };
                    return (
                        <Form.Control id="file-input" type="file" {...dirProps} onChange={handleFileChange} disabled={status.startsWith('proc')} />
                    );
                })()}
                <Form.Text className="text-muted mt-2">{files ? `${files.length} files selected. Ready to Start.` : "Select a folder containing text files."}</Form.Text>
            </Form.Group>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <Button variant="success" onClick={handleStart} disabled={!files || status.startsWith('proc')} className="d-flex align-items-center justify-content-center gap-2"><PlayIcon /> Start</Button>
                <Button variant="warning" onClick={handlePause} disabled={!status.startsWith('proc')} className="d-flex align-items-center justify-content-center gap-2"><PauseIcon /> {status === 'paused' ? 'Resume' : 'Pause'}</Button>
                <Button variant="danger" onClick={handleReset} disabled={status === 'idle' && Object.keys(knowledgeTries).length === 0} className="d-flex align-items-center justify-content-center gap-2"><ResetIcon /> Reset</Button>
            </div>
        </Card.Body>
    </Card>
);

const ProgressPanel = ({ status, progress }: { status: string; progress: { current: number; total: number } }) => {
    const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
    return <Card bg="dark" border="secondary"><Card.Body><div className="d-flex justify-content-between"><span>{status.charAt(0).toUpperCase() + status.slice(1)} {status === 'processing' && <Spinner animation="border" size="sm" className="ms-2" />}</span><span>{progress.current} / {progress.total} Chunks</span></div><ProgressBar animated={status === 'processing'} now={percentage} className="mt-2" /></Card.Body></Card>;
};

const LogPanel = ({ logs }: { logs: LogEntry[] }) => {
    const logContainerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => { logContainerRef.current?.scrollTo(0, 0); }, [logs]);
    const getVariant = (type: string) => ({ danger: 'danger', success: 'success', warning: 'warning', secondary: 'secondary' }[type] || 'light');
    return <Card bg="dark" border="secondary" className="flex-grow-1"><Card.Header as="h5">Activity Log</Card.Header><Card.Body><div ref={logContainerRef} className="bg-black p-2 rounded logContainer">{logs.length === 0 ? <p className="text-muted text-center mt-2">Awaiting instructions...</p> : logs.map((log, i) => (<div key={i} className={`text-${getVariant(log.type)}`}><span className="text-muted me-2">{log.timestamp}</span>{log.message}</div>))}</div></Card.Body></Card>;
};

const ResultsPanel = ({ knowledgeTries, incidenceTrie, modelStats, harmonicSignatures, handleTripleClick }: { knowledgeTries: KnowledgeTries; incidenceTrie: Record<string, Provenance[]>; modelStats: Record<string, { family: string; parameter_size: string; quantization_level: string; context_length: string }>; harmonicSignatures: Record<string, HarmonicSignature>; handleTripleClick: (triple: [string, string, string]) => void }) => {
    const allUniqueTriples = Object.keys(incidenceTrie).map(key => JSON.parse(key));
    return <Card bg="dark" border="secondary" className="flex-grow-1"><Card.Header as="h5">Knowledge Base</Card.Header><Card.Body><Tabs defaultActiveKey="combined" id="results-tabs" className="mb-3" fill><Tab eventKey="combined" title={`Combined Facts (${allUniqueTriples.length})`}><div className="panelScroll">{allUniqueTriples.length === 0 ? <p className="text-muted text-center mt-3">No facts extracted yet.</p> : <ListGroup variant="flush">{allUniqueTriples.map((triple, i) => (<ListGroup.Item key={i} action onClick={() => handleTripleClick(triple)} className="bg-dark text-light"><span><strong>{triple[0]}</strong> {`--[${triple[1]}]-->`} <strong>{triple[2]}</strong></span><Badge pill bg="info" className="ms-2">{incidenceTrie[JSON.stringify(triple)].length}</Badge></ListGroup.Item>))}</ListGroup>}</div></Tab><Tab eventKey="models" title={`Model Tries (${Object.keys(knowledgeTries).length})`}><div className="panelScroll">{Object.keys(knowledgeTries).length === 0 ? <p className="text-muted text-center mt-3">No models have processed data.</p> : <Accordion>{Object.entries(knowledgeTries).map(([model, trie], i) => (<Accordion.Item eventKey={String(i)} key={model}><Accordion.Header>{model}</Accordion.Header><Accordion.Body><TrieViewer trie={trie} onTripleClick={handleTripleClick} /></Accordion.Body></Accordion.Item>))}</Accordion>}</div></Tab><Tab eventKey="signatures" title={`Harmonic Signatures (${Object.keys(harmonicSignatures).length})`}><div className="panelScroll"><HarmonicSignatureTable signatures={harmonicSignatures} /></div></Tab><Tab eventKey="stats" title="Model Stats"><div className="panelScroll"><ModelStatsTable stats={modelStats} /></div></Tab></Tabs></Card.Body></Card>;
};

const TrieViewer = ({ trie, onTripleClick }: { trie: Record<string, Record<string, string>>; onTripleClick: (triple: [string, string, string]) => void }) => <Accordion>{Object.entries(trie).map(([subject, predicates], i) => (<Accordion.Item eventKey={String(i)} key={subject}><Accordion.Header>{subject}</Accordion.Header><Accordion.Body><ListGroup variant="flush">{Object.entries(predicates).map(([predicate, obj]) => (<ListGroup.Item key={predicate} action onClick={() => onTripleClick([subject, predicate, obj])} className="bg-dark text-light"><strong>{predicate}:</strong> "{obj}"</ListGroup.Item>))}</ListGroup></Accordion.Body></Accordion.Item>))}</Accordion>;

const ModelStatsTable = ({ stats }: { stats: Record<string, { family: string; parameter_size: string; quantization_level: string; context_length: string }> }) => <Table striped bordered hover variant="dark"><thead><tr><th>Model Name</th><th>Family</th><th>Parameters</th><th>Quantization</th><th>Context Length</th></tr></thead><tbody>{Object.entries(stats).map(([name, data]) => (<tr key={name}><td>{name}</td><td>{data.family}</td><td>{data.parameter_size}</td><td>{data.quantization_level}</td><td>{data.context_length}</td></tr>))}</tbody></Table>;

const HarmonicSignatureTable = ({ signatures }: { signatures: Record<string, HarmonicSignature> }) => <Table striped bordered hover variant="dark" size="sm"><thead><tr><th>ID</th><th>Source File</th><th>h</th><th>sin(h)</th><th>cos(h)</th><th>tan(h)</th></tr></thead><tbody>{Object.values(signatures).map((sig) => (<tr key={sig.id}><td><small>{sig.id}</small></td><td>{sig.sourceFile}</td><td>{sig.h.toFixed(4)}</td><td>{sig.sin.toFixed(4)}</td><td>{sig.cos.toFixed(4)}</td><td>{sig.tan.toFixed(4)}</td></tr>))}</tbody></Table>;

const IncidenceModal = ({ show, handleClose, triple, provenanceData }: { show: boolean; handleClose: () => void; triple: [string, string, string] | null; provenanceData: Provenance[] }) => {
    if (!triple) return null;
    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Provenance for Fact</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Card className="mb-3" bg="secondary" text="white">
                    <Card.Body><Card.Text as="h5" className="text-center font-monospace"><strong>{triple[0]}</strong> {`--[${triple[1]}]-->`} <strong>{triple[2]}</strong></Card.Text></Card.Body>
                </Card>
                <h6>Found in {provenanceData?.length || 0} locations:</h6>
                <Accordion>
                    {provenanceData?.map((evidence, i) => (
                        <Accordion.Item eventKey={String(i)} key={i}>
                            <Accordion.Header>
                                Evidence #{i + 1}: From <strong>{evidence.source.file}</strong> via <strong>{evidence.transform.model}</strong>
                            </Accordion.Header>
                            <Accordion.Body>
                                <p><strong>Source Details:</strong></p>
                                <ul>
                                    <li><strong>File:</strong> {evidence.source.file}</li>
                                    <li><strong>Chunk Index:</strong> {evidence.source.chunkIndex}</li>
                                    <li><strong>Harmonic Signature ID:</strong> <Badge bg="info">{evidence.source.signatureId}</Badge></li>
                                    <li><strong>Source Text:</strong> <blockquote className="blockquote-footer mt-1 ms-2">{evidence.source.text}</blockquote></li>
                                </ul>
                                <p><strong>Transform Details:</strong></p>
                                <ul>
                                    <li><strong>Model:</strong> <Badge bg="primary">{evidence.transform.model}</Badge></li>
                                    <li><strong>Chunking Strategy:</strong> {evidence.transform.chunkingStrategy}</li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

const GraphModal = ({ show, handleClose, incidenceTrie }: { show: boolean; handleClose: () => void; incidenceTrie: Record<string, Provenance[]> }) => {
    const [graphData, setGraphData] = useState<{ nodes: { id: string; name: string }[]; links: { source: string; target: string; name: string }[] }>({ nodes: [], links: [] });

    useEffect(() => {
        if (show) {
            const nodes = new Map<string, { id: string; name: string }>();
            const links: { source: string; target: string; name: string }[] = [];
            Object.keys(incidenceTrie).forEach(tripleKey => {
                const [subject, predicate, object] = JSON.parse(tripleKey);
                if (!nodes.has(subject)) nodes.set(subject, { id: subject, name: subject });
                if (!nodes.has(object)) nodes.set(object, { id: object, name: object });
                links.push({ source: subject, target: object, name: predicate });
            });
            setGraphData({ nodes: Array.from(nodes.values()), links });
        }
    }, [show, incidenceTrie]);

    return (
        <Modal show={show} onHide={handleClose} fullscreen={true}>
            <Modal.Header closeButton>
                <Modal.Title>Knowledge Graph</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0 m-0" style={{'backgroundColor': '#000011'}}>
                <ForceGraph3D
                    graphData={graphData}
                    nodeLabel="name"
                    linkLabel="name"
                    linkCurvature={0.2}
                    backgroundColor="#000011"
                    linkColor={() => 'rgba(255,255,255,0.2)'}
                    linkWidth={0.5}
                />
            </Modal.Body>
        </Modal>
    );
};

export default App;
