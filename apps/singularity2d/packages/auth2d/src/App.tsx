import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, Modal, Badge, Alert, Spinner, Container, Row, Col, Nav, Tab, ListGroup, InputGroup } from 'react-bootstrap';
import { Play, Settings, Trash2, MessageSquare, Bot, Wrench, Plus, Send, User, Copy, RefreshCw } from 'lucide-react';

// Types
interface OllamaModel {
    name: string;
    size: number;
    digest: string;
    modified_at: string;
}

interface ToolParameter {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    description: string;
    required: boolean;
}

interface Tool {
    id: string;
    name: string;
    description: string;
    parameters: ToolParameter[];
    run: (args: any) => Promise<string>;
}

interface Agent {
    id: string;
    name: string;
    model: string;
    systemPrompt: string;
    temperature: number;
    tools: string[];
    autonomy: boolean;
    maxTokens?: number;
    createdAt: Date;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'tool';
    content: string;
    toolCall?: {
        tool: string;
        args: any;
        result?: string;
    };
    timestamp: Date;
}

interface ChatSession {
    id: string;
    agentId: string;
    messages: ChatMessage[];
    createdAt: Date;
}

// Tool Registry
class ToolRegistry {
    private static tools: Map<string, Tool> = new Map();

    static register(tool: Tool) {
        this.tools.set(tool.id, tool);
    }

    static get(id: string): Tool | undefined {
        return this.tools.get(id);
    }

    static getAll(): Tool[] {
        return Array.from(this.tools.values());
    }

    static remove(id: string) {
        this.tools.delete(id);
    }
}

// Initialize default tools
ToolRegistry.register({
    id: 'search',
    name: 'Web Search',
    description: 'Search the web for information',
    parameters: [
        { name: 'query', type: 'string', description: 'Search query', required: true }
    ],
    run: async (args) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `Search results for "${args.query}": Found relevant information about ${args.query}. This is a simulated search result.`;
    }
});

ToolRegistry.register({
    id: 'calculator',
    name: 'Calculator',
    description: 'Perform mathematical calculations',
    parameters: [
        { name: 'expression', type: 'string', description: 'Mathematical expression to evaluate', required: true }
    ],
    run: async (args) => {
        try {
            // Simple evaluation for demo - in real implementation use a safe math evaluator
            const result = Function(`"use strict"; return (${args.expression})`)();
            return `Calculation result: ${args.expression} = ${result}`;
        } catch (error) {
            return `Error in calculation: ${error.message}`;
        }
    }
});

ToolRegistry.register({
    id: 'timestamp',
    name: 'Current Time',
    description: 'Get the current date and time',
    parameters: [],
    run: async () => {
        return `Current time: ${new Date().toLocaleString()}`;
    }
});

// Ollama API Service
class OllamaService {
    private static baseUrl = 'http://localhost:11434';

    static async getModels(): Promise<OllamaModel[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            const data = await response.json();
            return data.models || [];
        } catch (error) {
            console.error('Failed to fetch models:', error);
            // Return mock data for demo
            return [
                { name: 'llama3.2:latest', size: 2000000000, digest: 'abc123', modified_at: '2024-01-01T00:00:00Z' },
                { name: 'codellama:latest', size: 3000000000, digest: 'def456', modified_at: '2024-01-01T00:00:00Z' },
                { name: 'mistral:latest', size: 4000000000, digest: 'ghi789', modified_at: '2024-01-01T00:00:00Z' }
            ];
        }
    }

    static async chat(model: string, messages: any[], tools?: Tool[]): Promise<string> {
        try {
            const systemMessage = messages.find(m => m.role === 'system');
            const userMessages = messages.filter(m => m.role !== 'system');

            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model,
                    messages: [systemMessage, ...userMessages].filter(Boolean),
                    stream: false
                })
            });

            if (!response.ok) throw new Error('Ollama request failed');

            const data = await response.json();
            return data.message?.content || 'No response';
        } catch (error) {
            console.error('Ollama chat error:', error);
            // Mock response for demo
            const hasToolCall = Math.random() > 0.7 && tools && tools.length > 0;
            if (hasToolCall) {
                const randomTool = tools[Math.floor(Math.random() * tools.length)];
                const mockArgs = randomTool.id === 'search' ? { query: 'artificial intelligence' } :
                    randomTool.id === 'calculator' ? { expression: '2 + 2' } : {};
                return `I'll help you with that. CALL: {"tool": "${randomTool.id}", "args": ${JSON.stringify(mockArgs)}}`;
            }
            return `This is a simulated response from ${model}. The actual Ollama service is not available in this demo environment.`;
        }
    }
}

// Agent Creator Component
const AgentCreator = ({ onSave, editAgent, onCancel }) => {
    const [models, setModels] = useState<OllamaModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: editAgent?.name || '',
        model: editAgent?.model || '',
        systemPrompt: editAgent?.systemPrompt || 'You are a helpful AI assistant with access to tools. When you need to use a tool, respond with CALL: {"tool": "tool_name", "args": {"param": "value"}}',
        temperature: editAgent?.temperature || 0.7,
        tools: editAgent?.tools || [],
        autonomy: editAgent?.autonomy || false,
        maxTokens: editAgent?.maxTokens || 2000
    });

    useEffect(() => {
        loadModels();
    }, []);

    const loadModels = async () => {
        setLoading(true);
        try {
            const modelList = await OllamaService.getModels();
            setModels(modelList);
            if (!formData.model && modelList.length > 0) {
                setFormData(prev => ({ ...prev, model: modelList[0].name }));
            }
        } catch (error) {
            console.error('Failed to load models:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.model) return;

        const agent: Agent = {
            id: editAgent?.id || Date.now().toString(),
            name: formData.name,
            model: formData.model,
            systemPrompt: formData.systemPrompt,
            temperature: formData.temperature,
            tools: formData.tools,
            autonomy: formData.autonomy,
            maxTokens: formData.maxTokens,
            createdAt: editAgent?.createdAt || new Date()
        };

        onSave(agent);
    };

    const toggleTool = (toolId: string) => {
        setFormData(prev => ({
            ...prev,
            tools: prev.tools.includes(toolId)
                ? prev.tools.filter(id => id !== toolId)
                : [...prev.tools, toolId]
        }));
    };

    return (
        <Card>
            <Card.Header>
                <h5><Bot className="me-2" />{editAgent ? 'Edit Agent' : 'Create New Agent'}</h5>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Agent Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter agent name"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Model</Form.Label>
                                <Form.Select
                                    value={formData.model}
                                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                                    required
                                >
                                    <option value="">Select a model...</option>
                                    {models.map(model => (
                                        <option key={model.name} value={model.name}>
                                            {model.name} ({(model.size / 1e9).toFixed(1)}GB)
                                        </option>
                                    ))}
                                </Form.Select>
                                {loading && <Spinner animation="border" size="sm" className="ms-2" />}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Temperature</Form.Label>
                                <Form.Range
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    value={formData.temperature}
                                    onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                                />
                                <small className="text-muted">Current: {formData.temperature}</small>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Enable Autonomy (Agent can chain tool calls)"
                                    checked={formData.autonomy}
                                    onChange={(e) => setFormData(prev => ({ ...prev, autonomy: e.target.checked }))}
                                />
                            </Form.Group>

                            {formData.autonomy && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Max Tokens</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.maxTokens}
                                        onChange={(e) => setFormData(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                                        min={100}
                                        max={10000}
                                    />
                                </Form.Group>
                            )}
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Available Tools</Form.Label>
                                <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {ToolRegistry.getAll().map(tool => (
                                        <Form.Check
                                            key={tool.id}
                                            type="checkbox"
                                            id={tool.id}
                                            label={
                                                <div>
                                                    <strong>{tool.name}</strong>
                                                    <br />
                                                    <small className="text-muted">{tool.description}</small>
                                                </div>
                                            }
                                            checked={formData.tools.includes(tool.id)}
                                            onChange={() => toggleTool(tool.id)}
                                            className="mb-2"
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>System Prompt</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={formData.systemPrompt}
                            onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                            placeholder="Enter system prompt for the agent"
                        />
                        <Form.Text className="text-muted">
                            This prompt defines the agent's behavior and capabilities.
                        </Form.Text>
                    </Form.Group>

                    <div className="d-flex gap-2">
                        <Button type="submit" variant="primary">
                            {editAgent ? 'Update Agent' : 'Create Agent'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

// Tool Management Component
const ToolManager = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingTool, setEditingTool] = useState<Tool | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parameters: [] as ToolParameter[]
    });

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            parameters: []
        });
        setEditingTool(null);
    };

    const handleSave = () => {
        const tool: Tool = {
            id: editingTool?.id || Date.now().toString(),
            name: formData.name,
            description: formData.description,
            parameters: formData.parameters,
            run: editingTool?.run || (async (args) => `Custom tool "${formData.name}" executed with args: ${JSON.stringify(args)}`)
        };

        ToolRegistry.register(tool);
        setShowModal(false);
        resetForm();
    };

    const editTool = (tool: Tool) => {
        setEditingTool(tool);
        setFormData({
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters
        });
        setShowModal(true);
    };

    const deleteTool = (toolId: string) => {
        if (confirm('Are you sure you want to delete this tool?')) {
            ToolRegistry.remove(toolId);
        }
    };

    const addParameter = () => {
        setFormData(prev => ({
            ...prev,
            parameters: [...prev.parameters, { name: '', type: 'string', description: '', required: false }]
        }));
    };

    const updateParameter = (index: number, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            parameters: prev.parameters.map((param, i) =>
                i === index ? { ...param, [field]: value } : param
            )
        }));
    };

    const removeParameter = (index: number) => {
        setFormData(prev => ({
            ...prev,
            parameters: prev.parameters.filter((_, i) => i !== index)
        }));
    };

    return (
        <>
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5><Wrench className="me-2" />Tool Management</h5>
                    <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                        <Plus className="me-1" />Add Tool
                    </Button>
                </Card.Header>
                <Card.Body>
                    <ListGroup>
                        {ToolRegistry.getAll().map(tool => (
                            <ListGroup.Item key={tool.id} className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6>{tool.name}</h6>
                                    <p className="text-muted mb-1">{tool.description}</p>
                                    <div>
                                        {tool.parameters.map(param => (
                                            <Badge key={param.name} variant="outline-secondary" className="me-1">
                                                {param.name}: {param.type}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => editTool(tool)}>
                                        <Settings size="14" />
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => deleteTool(tool.id)}>
                                        <Trash2 size="14" />
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingTool ? 'Edit Tool' : 'Add New Tool'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Tool Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter tool name"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe what this tool does"
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6>Parameters</h6>
                        <Button variant="outline-primary" size="sm" onClick={addParameter}>
                            <Plus size="14" className="me-1" />Add Parameter
                        </Button>
                    </div>

                    {formData.parameters.map((param, index) => (
                        <div key={index} className="border rounded p-2 mb-2">
                            <Row>
                                <Col md={3}>
                                    <Form.Control
                                        size="sm"
                                        placeholder="Parameter name"
                                        value={param.name}
                                        onChange={(e) => updateParameter(index, 'name', e.target.value)}
                                    />
                                </Col>
                                <Col md={2}>
                                    <Form.Select
                                        size="sm"
                                        value={param.type}
                                        onChange={(e) => updateParameter(index, 'type', e.target.value)}
                                    >
                                        <option value="string">String</option>
                                        <option value="number">Number</option>
                                        <option value="boolean">Boolean</option>
                                        <option value="array">Array</option>
                                        <option value="object">Object</option>
                                    </Form.Select>
                                </Col>
                                <Col md={5}>
                                    <Form.Control
                                        size="sm"
                                        placeholder="Description"
                                        value={param.description}
                                        onChange={(e) => updateParameter(index, 'description', e.target.value)}
                                    />
                                </Col>
                                <Col md={1}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Req"
                                        checked={param.required}
                                        onChange={(e) => updateParameter(index, 'required', e.target.checked)}
                                    />
                                </Col>
                                <Col md={1}>
                                    <Button variant="outline-danger" size="sm" onClick={() => removeParameter(index)}>
                                        <Trash2 size="12" />
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={!formData.name || !formData.description}>
                        {editingTool ? 'Update Tool' : 'Add Tool'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

// Agent Chat Component
const AgentChat = ({ agent, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [autoMode, setAutoMode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const newMessage: ChatMessage = {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
    };

    const parseToolCall = (content: string) => {
        const match = content.match(/CALL:\s*({.*})/);
        if (match) {
            try {
                return JSON.parse(match[1]);
            } catch (error) {
                console.error('Failed to parse tool call:', error);
            }
        }
        return null;
    };

    const executeToolCall = async (toolCall: any) => {
        const tool = ToolRegistry.get(toolCall.tool);
        if (!tool) {
            return `Error: Tool "${toolCall.tool}" not found`;
        }

        try {
            const result = await tool.run(toolCall.args);
            addMessage({
                role: 'tool',
                content: result,
                toolCall: { ...toolCall, result }
            });
            return result;
        } catch (error) {
            const errorMsg = `Error executing tool "${toolCall.tool}": ${error.message}`;
            addMessage({
                role: 'tool',
                content: errorMsg,
                toolCall: { ...toolCall, result: errorMsg }
            });
            return errorMsg;
        }
    };

    const sendMessage = async (userMessage?: string) => {
        const messageText = userMessage || input;
        if (!messageText.trim() && !autoMode) return;

        if (!autoMode) {
            addMessage({ role: 'user', content: messageText });
            setInput('');
        }

        setLoading(true);

        try {
            const conversationMessages = [
                {
                    role: 'system',
                    content: `${agent.systemPrompt}\n\nAvailable tools: ${agent.tools.map(toolId => {
                        const tool = ToolRegistry.get(toolId);
                        return tool ? `${tool.name}: ${tool.description}` : '';
                    }).filter(Boolean).join(', ')}`
                },
                ...messages.map(msg => ({
                    role: msg.role === 'tool' ? 'user' : msg.role,
                    content: msg.role === 'tool' ? `Tool result: ${msg.content}` : msg.content
                })),
                ...(messageText ? [{ role: 'user', content: messageText }] : [])
            ];

            const availableTools = agent.tools.map(toolId => ToolRegistry.get(toolId)).filter(Boolean);
            const response = await OllamaService.chat(agent.model, conversationMessages, availableTools);

            const assistantMessage = addMessage({ role: 'assistant', content: response });

            // Check for tool calls
            const toolCall = parseToolCall(response);
            if (toolCall && agent.tools.includes(toolCall.tool)) {
                const toolResult = await executeToolCall(toolCall);

                // If autonomy is enabled, continue the conversation
                if (agent.autonomy && autoMode) {
                    setTimeout(() => {
                        sendMessage(`Tool "${toolCall.tool}" executed successfully. Result: ${toolResult}`);
                    }, 1000);
                }
            }
        } catch (error) {
            addMessage({ role: 'assistant', content: `Error: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    const toggleAutoMode = () => {
        setAutoMode(!autoMode);
        if (!autoMode && messages.length === 0) {
            // Start autonomous mode with initial message
            sendMessage("Hello! I'm ready to help you autonomously.");
        }
    };

    const clearChat = () => {
        if (confirm('Clear all messages?')) {
            setMessages([]);
        }
    };

    return (
        <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                    <h5><MessageSquare className="me-2" />Chat with {agent.name}</h5>
                    <small className="text-muted">Model: {agent.model} | Tools: {agent.tools.length}</small>
                </div>
                <div className="d-flex gap-2">
                    <Form.Check
                        type="switch"
                        id="auto-mode"
                        label="Auto Mode"
                        checked={autoMode}
                        onChange={toggleAutoMode}
                        disabled={loading}
                    />
                    <Button variant="outline-secondary" size="sm" onClick={clearChat}>
                        <RefreshCw size="14" />
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={onClose}>
                        ×
                    </Button>
                </div>
            </Card.Header>

            <Card.Body className="d-flex flex-column p-0">
                <div className="flex-grow-1 p-3" style={{ height: '400px', overflowY: 'auto' }}>
                    {messages.length === 0 && (
                        <div className="text-center text-muted mt-5">
                            <Bot size="48" className="mb-3" />
                            <p>Start a conversation with {agent.name}</p>
                        </div>
                    )}

                    {messages.map(message => (
                        <div key={message.id} className={`mb-3 d-flex ${message.role === 'user' ? 'justify-content-end' : ''}`}>
                            <div className={`p-2 rounded max-w-75 ${message.role === 'user'
                                    ? 'bg-primary text-white'
                                    : message.role === 'tool'
                                        ? 'bg-warning text-dark'
                                        : 'bg-light'
                                }`} style={{ maxWidth: '75%' }}>
                                <div className="d-flex align-items-center mb-1">
                                    {message.role === 'user' ? <User size="16" /> :
                                        message.role === 'tool' ? <Wrench size="16" /> : <Bot size="16" />}
                                    <small className="ms-2 opacity-75">
                                        {message.role === 'tool' ? 'Tool Result' :
                                            message.role === 'user' ? 'You' : agent.name}
                                    </small>
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
                                {message.toolCall && (
                                    <div className="mt-2 p-2 bg-dark bg-opacity-10 rounded">
                                        <small>
                                            <strong>Tool:</strong> {message.toolCall.tool}<br />
                                            <strong>Args:</strong> {JSON.stringify(message.toolCall.args)}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="text-center">
                            <Spinner animation="border" size="sm" className="me-2" />
                            <span>Thinking...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="border-top p-3">
                    <Form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={autoMode ? "Auto mode active..." : "Type your message..."}
                                disabled={loading || autoMode}
                            />
                            <Button type="submit" variant="primary" disabled={loading || autoMode || !input.trim()}>
                                <Send size="16" />
                            </Button>
                        </InputGroup>
                    </Form>
                </div>
            </Card.Body>
        </Card>
    );
};

// Agent Manager Component
const AgentManager = ({ agents, onEdit, onDelete, onChat }) => {
    return (
        <Card>
            <Card.Header>
                <h5><Bot className="me-2" />Deployed Agents</h5>
            </Card.Header>
            <Card.Body>
                {agents.length === 0 ? (
                    <div className="text-center text-muted py-4">
                        <Bot size="48" className="mb-3" />
                        <p>No agents created yet. Create your first agent to get started!</p>
                    </div>
                ) : (
                    <Row>
                        {agents.map(agent => (
                            <Col key={agent.id} md={6} lg={4} className="mb-3">
                                <Card className="h-100">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6>{agent.name}</h6>
                                            <div>
                                                <Button variant="outline-primary" size="sm" className="me-1" onClick={() => onEdit(agent)}>
                                                    <Settings size="14" />
                                                </Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => onDelete(agent.id)}>
                                                    <Trash2 size="14" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mb-2">
                                            <Badge variant="outline-primary" className="me-1">
                                                {agent.model}
                                            </Badge>
                                            <Badge variant="outline-secondary" className="me-1">
                                                {agent.tools.length} tools
                                            </Badge>
                                            {agent.autonomy && (
                                                <Badge variant="outline-success">
                                                    Autonomous
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-muted small" style={{ height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {agent.systemPrompt.substring(0, 100)}{agent.systemPrompt.length > 100 ? '...' : ''}
                                        </p>
                                    </Card.Body>
                                    <Card.Footer className="d-flex justify-content-between">
                                        <small className="text-muted">
                                            Created: {new Date(agent.createdAt).toLocaleDateString()}
                                        </small>
                                        <Button variant="primary" size="sm" onClick={() => onChat(agent)}>
                                            <MessageSquare size="14" className="me-1" /> Chat
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Card.Body>
        </Card>
    );
};

// Main App Component
const App = () => {
    const [activeTab, setActiveTab] = useState('agents');
    const [agents, setAgents] = useState<Agent[]>([]);
    const [showAgentCreator, setShowAgentCreator] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
    const [activeChatAgent, setActiveChatAgent] = useState<Agent | null>(null);
    const [sessions, setSessions] = useState<ChatSession[]>([]);

    useEffect(() => {
        // Load saved agents and sessions from localStorage
        const savedAgents = localStorage.getItem('ollama-agents');
        const savedSessions = localStorage.getItem('ollama-sessions');

        if (savedAgents) {
            try {
                const parsedAgents = JSON.parse(savedAgents);
                setAgents(parsedAgents.map(agent => ({
                    ...agent,
                    createdAt: new Date(agent.createdAt)
                })));
            } catch (error) {
                console.error('Failed to parse saved agents:', error);
            }
        }

        if (savedSessions) {
            try {
                const parsedSessions = JSON.parse(savedSessions);
                setSessions(parsedSessions.map(session => ({
                    ...session,
                    createdAt: new Date(session.createdAt),
                    messages: session.messages.map(msg => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }))
                })));
            } catch (error) {
                console.error('Failed to parse saved sessions:', error);
            }
        }
    }, []);

    useEffect(() => {
        // Save agents and sessions to localStorage
        localStorage.setItem('ollama-agents', JSON.stringify(agents));
        localStorage.setItem('ollama-sessions', JSON.stringify(sessions));
    }, [agents, sessions]);

    const handleSaveAgent = (agent: Agent) => {
        if (editingAgent) {
            setAgents(prev => prev.map(a => a.id === agent.id ? agent : a));
        } else {
            setAgents(prev => [...prev, agent]);
        }
        setShowAgentCreator(false);
        setEditingAgent(null);
    };

    const handleEditAgent = (agent: Agent) => {
        setEditingAgent(agent);
        setShowAgentCreator(true);
    };

    const handleDeleteAgent = (agentId: string) => {
        if (confirm('Are you sure you want to delete this agent?')) {
            setAgents(prev => prev.filter(a => a.id !== agentId));
            // Also delete any sessions associated with this agent
            setSessions(prev => prev.filter(s => s.agentId !== agentId));
        }
    };

    const handleStartChat = (agent: Agent) => {
        setActiveChatAgent(agent);
        // Create a new session if one doesn't exist
        if (!sessions.some(s => s.agentId === agent.id)) {
            setSessions(prev => [...prev, {
                id: Date.now().toString(),
                agentId: agent.id,
                messages: [],
                createdAt: new Date()
            }]);
        }
    };

    const handleCloseChat = () => {
        setActiveChatAgent(null);
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h1 className="display-5">
                        <Bot className="me-2" />Ollama Agent Framework
                    </h1>
                    <p className="text-muted">
                        Create, manage, and interact with AI agents powered by Ollama models
                    </p>
                </Col>
            </Row>

            {activeChatAgent ? (
                <Row>
                    <Col>
                        <AgentChat
                            agent={activeChatAgent}
                            onClose={handleCloseChat}
                        />
                    </Col>
                </Row>
            ) : (
                <>
                    <Row className="mb-3">
                        <Col>
                            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                                <Card>
                                    <Card.Header>
                                        <Nav variant="tabs">
                                            <Nav.Item>
                                                <Nav.Link eventKey="agents">Agents</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="tools">Tools</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Card.Header>
                                    <Card.Body>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="agents">
                                                <div className="d-flex justify-content-end mb-3">
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => {
                                                            setEditingAgent(null);
                                                            setShowAgentCreator(true);
                                                        }}
                                                    >
                                                        <Plus className="me-1" /> Create Agent
                                                    </Button>
                                                </div>

                                                {showAgentCreator ? (
                                                    <AgentCreator
                                                        onSave={handleSaveAgent}
                                                        editAgent={editingAgent}
                                                        onCancel={() => setShowAgentCreator(false)}
                                                    />
                                                ) : (
                                                    <AgentManager
                                                        agents={agents}
                                                        onEdit={handleEditAgent}
                                                        onDelete={handleDeleteAgent}
                                                        onChat={handleStartChat}
                                                    />
                                                )}
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="tools">
                                                <ToolManager />
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Card.Body>
                                </Card>
                            </Tab.Container>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default App;
