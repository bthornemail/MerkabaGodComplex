import { QuantizedData } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export class LLMIntegration {
  private apiKey: string | null;
  private maxRetries: number = 3;
  private baseDelay: number = 1000;

  constructor() {
    // In a real app, this would come from environment variables or user input
    this.apiKey = null; // Will need to be set by user or environment
  }

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async callLLM(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('LLM API key not configured');
    }

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        });

        if (response.status === 429) {
          // Rate limited, exponential backoff
          const delay = this.baseDelay * Math.pow(2, attempt);
          console.log(`Rate limited, retrying in ${delay}ms...`);
          await this.sleep(delay);
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          return data.candidates[0].content.parts[0].text;
        } else {
          throw new Error('Unexpected response format from LLM API');
        }
      } catch (error) {
        console.error(`LLM call attempt ${attempt + 1} failed:`, error);
        
        if (attempt === this.maxRetries - 1) {
          throw error;
        }
        
        // Exponential backoff for retries
        const delay = this.baseDelay * Math.pow(2, attempt);
        await this.sleep(delay);
      }
    }

    throw new Error('All LLM call attempts failed');
  }
}

export class TextQuantizer {
  private llm: LLMIntegration;

  constructor() {
    this.llm = new LLMIntegration();
  }

  setApiKey(key: string): void {
    this.llm.setApiKey(key);
  }

  async quantize(text: string): Promise<QuantizedData> {
    const prompt = `Please analyze the following text and convert it into a quantized representation suitable for computational simulation.

Text: "${text}"

Return a JSON object with the following structure:
{
  "quantizedVector": [array of 5-10 numbers between -10 and 10 representing key conceptual dimensions],
  "summary": "brief description of what this text represents conceptually"
}

The quantized vector should capture the essence, sentiment, complexity, and semantic meaning of the text in numerical form. Each dimension should represent a different aspect (e.g., sentiment, complexity, concreteness, etc.).

Only return the JSON object, nothing else.`;

    try {
      const response = await this.llm.callLLM(prompt);
      const cleanedResponse = response.trim().replace(/```json|```/g, '');
      const parsed = JSON.parse(cleanedResponse);
      
      return {
        quantizedVector: parsed.quantizedVector || [0, 0, 0, 0, 0],
        summary: parsed.summary || 'Text analysis failed',
        originalText: text
      };
    } catch (error) {
      console.error('Text quantization failed:', error);
      // Fallback: simple character-based quantization
      return this.fallbackQuantize(text);
    }
  }

  private fallbackQuantize(text: string): QuantizedData {
    const length = Math.min(text.length / 10, 10);
    const wordCount = text.split(' ').length;
    const vowelRatio = (text.match(/[aeiouAEIOU]/g) || []).length / text.length;
    const upperCaseRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    const punctuationCount = (text.match(/[.!?;:,]/g) || []).length;

    return {
      quantizedVector: [
        length,
        Math.min(wordCount / 2, 10),
        vowelRatio * 10,
        upperCaseRatio * 10,
        Math.min(punctuationCount, 10)
      ],
      summary: `Fallback analysis of "${text.substring(0, 30)}..."`,
      originalText: text
    };
  }
}

// MCP Tools implementation
export const MCP_TOOLS = {
  getTimestamp: (): number => Date.now(),
  getRandomNumber: (): number => Math.random() * 100,
  convertDataToString: (data: any): string => JSON.stringify(data),
  pingServer: (): string => 'pong',
  calculateHash: (data: any): string => {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }
};

export class MCPAgent {
  private llm: LLMIntegration;

  constructor() {
    this.llm = new LLMIntegration();
  }

  setApiKey(key: string): void {
    this.llm.setApiKey(key);
  }

  async selectTool(data: any): Promise<string> {
    const availableTools = Object.keys(MCP_TOOLS).join(', ');
    const prompt = `You are a helpful assistant. Based on the following data: ${JSON.stringify(data)}, select the best tool from the list to use next: [${availableTools}]. Just respond with the tool's name and nothing else.`;
    
    try {
      const response = await this.llm.callLLM(prompt);
      const trimmedResponse = response.trim();
      
      if (MCP_TOOLS.hasOwnProperty(trimmedResponse)) {
        return trimmedResponse;
      } else {
        console.log(`MCP Agent: LLM selected unknown tool "${trimmedResponse}". Using fallback.`);
        return 'convertDataToString'; // Fallback tool
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`MCP Agent: LLM decision failed. Using fallback. Error: ${errorMessage}`);
      return 'convertDataToString'; // Fallback tool
    }
  }

  async executeTool(toolName: string, data: any): Promise<any> {
    if (toolName in MCP_TOOLS) {
      return (MCP_TOOLS as any)[toolName](data);
    } else {
      throw new Error(`Tool ${toolName} not found`);
    }
  }
}