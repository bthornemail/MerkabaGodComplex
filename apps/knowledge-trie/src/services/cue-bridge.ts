/**
 * CUE Integration Bridge for Knowledge Trie
 * 
 * This service bridges the Knowledge Trie app with the CUE framework,
 * enabling seamless data flow between knowledge extraction and harmonic processing.
 */

import { HarmonicVector, SExprType } from '../../../../libs/cue-protocols/ubhp_types';

// Declare minimal Vite env typing locally to avoid using `any`
declare global {
  interface ImportMetaEnv {
    readonly VITE_CUE_NETWORK_URL?: string;
    readonly VITE_CLARION_MDU_URL?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// Env-driven URLs (set VITE_CUE_NETWORK_URL and VITE_CLARION_MDU_URL in your .env)
const CUE_NETWORK_URL = import.meta.env?.VITE_CUE_NETWORK_URL;
const CLARION_MDU_URL = import.meta.env?.VITE_CLARION_MDU_URL;

// Browser-compatible harmonize function
function harmonize(inputSExpr: ArrayBuffer): HarmonicVector {
  const values = Array.from(new Uint8Array(inputSExpr));

  // Force harmonic values to be divisible by key primes for demo
  const baseH = Math.hypot(...values);
  const h = Math.floor(baseH / 3) * 3; // Make divisible by 3
  
  // Constants are chosen for their mathematical significance to create a unique "vibration".
  const sin = Math.sin(h / Math.PI);
  const cos = Math.cos(h / 1.61803398875); // Golden ratio
  const tan = Math.tan(Math.PI / (h || 1e-10)); // Avoid division by zero

  // Browser-compatible hash function
  function createBrowserHash(data: Uint8Array): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
    return hexHash.repeat(8).substring(0, 64);
  }

  // The ID is a combination of a hash (for collision resistance)
  // and the harmonic properties (for perceptual addressing).
  const hashInput = new Uint8Array(inputSExpr);
  const hash = createBrowserHash(hashInput);
  const id = `HV-${hash.substring(0, 12)}-${h.toFixed(2)}`;

  // Include raw components for downstream geometric analysis
  const components: number[] = values.map(v => Number(v));
  return { id, length: values.length, sin, cos, tan, h, buffer: inputSExpr, components };
}

export interface KnowledgeTriple {
  subject: string;
  predicate: string;
  object: string;
}

export interface KnowledgeContext {
  sourceFile: string;
  chunkIndex: number;
  model: string;
  chunkingStrategy: string;
  signatureId: string;
}

export interface CueKnowledgeEvent {
  id: string;
  timestamp: number;
  triples: KnowledgeTriple[];
  context: KnowledgeContext;
  harmonicVector: HarmonicVector;
  processedByCUE: boolean;
}

export class CueKnowledgeBridge {
  private eventBuffer: CueKnowledgeEvent[] = [];
  private subscribers: ((event: CueKnowledgeEvent) => void)[] = [];
  // URLs configured via Vite env to avoid hard-coded HTTP in source
  private cueNetworkUrl = CUE_NETWORK_URL;
  private clarionMduUrl = CLARION_MDU_URL;

  /**
   * Converts knowledge triples into a CUE-compatible event
   */
  createKnowledgeEvent(
    triples: KnowledgeTriple[],
    context: KnowledgeContext,
    textChunk: string
  ): CueKnowledgeEvent {
    // Convert text to S-expression (canonical binary encoding)
    const sExpr = this.textToSExpr(textChunk);
    
    // Generate harmonic signature using CUE protocols
    const harmonicVector = harmonize(sExpr);
    
    const event: CueKnowledgeEvent = {
      id: `KT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      triples,
      context: {
        ...context,
        signatureId: harmonicVector.id
      },
      harmonicVector,
      processedByCUE: false
    };

    this.eventBuffer.push(event);
    this.notifySubscribers(event);
    
    return event;
  }

  /**
   * Converts text to canonical S-expression (ArrayBuffer)
   */
  private textToSExpr(text: string): ArrayBuffer {
    // Simplified S-expression encoding - in full implementation would use TLV
    const encoder = new TextEncoder();
    const textBytes = encoder.encode(text);
    
    // Create a simple canonical S-expression with type header
    const buffer = new ArrayBuffer(textBytes.length + 2);
    const view = new DataView(buffer);
    
    // Type header (STRING type)
    view.setUint8(0, SExprType.STRING);
    view.setUint8(1, textBytes.length & 0xFF); // Length (simplified)
    
    // Copy text data
    const uint8View = new Uint8Array(buffer);
    uint8View.set(textBytes, 2);
    
    return buffer;
  }

  /**
   * Sends knowledge event to CUE Network for processing
   */
  async submitToCueNetwork(event: CueKnowledgeEvent): Promise<boolean> {
    try {
      if (!this.cueNetworkUrl) {
        console.warn('CUE Network URL not configured (VITE_CUE_NETWORK_URL). Skipping submit.');
        return false;
      }
      const response = await fetch(`${this.cueNetworkUrl}/api/knowledge/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          harmonicVector: event.harmonicVector,
          metadata: {
            tripleCount: event.triples.length,
            sourceFile: event.context.sourceFile,
            model: event.context.model
          }
        })
      });

      if (response.ok) {
        event.processedByCUE = true;
        console.log(`✅ Event ${event.id} submitted to CUE Network`);
        return true;
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`⚠️ Failed to submit to CUE Network: ${msg}`);
    }
    return false;
  }

  /**
   * Sends triples to CLARION-MDU for rule learning
   */
  async submitToClarionMdu(event: CueKnowledgeEvent): Promise<boolean> {
    try {
      if (!this.clarionMduUrl) {
        console.warn('CLARION-MDU URL not configured (VITE_CLARION_MDU_URL). Skipping submit.');
        return false;
      }
      // Convert triples to CLARION-MDU rule format
      const rules = event.triples.map(triple => ({
        type: 'explicit_rule',
        condition: `entity_has_property("${triple.subject}", "${triple.predicate}")`,
        action: `assert_value("${triple.object}")`,
        confidence: 0.8,
        source: 'knowledge_extraction',
        harmonicSignature: event.harmonicVector.id
      }));

      const response = await fetch(`${this.clarionMduUrl}/api/rules/learn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          rules,
          context: event.context
        })
      });

      if (response.ok) {
        console.log(`🧠 Event ${event.id} rules submitted to CLARION-MDU`);
        return true;
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`⚠️ Failed to submit to CLARION-MDU: ${msg}`);
    }
    return false;
  }

  /**
   * Process buffered events and send to CUE services
   */
  async processPendingEvents(): Promise<void> {
    const pendingEvents = this.eventBuffer.filter(e => !e.processedByCUE);
    
    for (const event of pendingEvents) {
      await Promise.all([
        this.submitToCueNetwork(event),
        this.submitToClarionMdu(event)
      ]);
      
      // Small delay to prevent overwhelming services
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`📊 Processed ${pendingEvents.length} knowledge events`);
  }

  /**
   * Subscribe to knowledge events
   */
  subscribe(callback: (event: CueKnowledgeEvent) => void): void {
    this.subscribers.push(callback);
  }

  /**
   * Unsubscribe from knowledge events
   */
  unsubscribe(callback: (event: CueKnowledgeEvent) => void): void {
    const index = this.subscribers.indexOf(callback);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  /**
   * Notify all subscribers of new events
   */
  private notifySubscribers(event: CueKnowledgeEvent): void {
    this.subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in event subscriber:', error);
      }
    });
  }

  /**
   * Get statistics about processed knowledge
   */
  getStats(): {
    totalEvents: number;
    processedEvents: number;
    totalTriples: number;
    uniqueSubjects: Set<string>;
    uniquePredicates: Set<string>;
  } {
    const totalTriples = this.eventBuffer.reduce((sum, event) => sum + event.triples.length, 0);
    const uniqueSubjects = new Set<string>();
    const uniquePredicates = new Set<string>();
    
    this.eventBuffer.forEach(event => {
      event.triples.forEach(triple => {
        uniqueSubjects.add(triple.subject);
        uniquePredicates.add(triple.predicate);
      });
    });

    return {
      totalEvents: this.eventBuffer.length,
      processedEvents: this.eventBuffer.filter(e => e.processedByCUE).length,
      totalTriples,
      uniqueSubjects,
      uniquePredicates
    };
  }

  /**
   * Clear the event buffer (use with caution)
   */
  clearBuffer(): void {
    this.eventBuffer = [];
    console.log('🗑️ Knowledge event buffer cleared');
  }
}

// Export singleton instance
export const cueBridge = new CueKnowledgeBridge();