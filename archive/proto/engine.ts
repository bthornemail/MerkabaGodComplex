// === seven_day_llm_engine.ts ===

/**
 * Core idea: 6 modular models (Day 1–6), with Day 7 acting as an adjudicator
 * using convolution or attention over outputs to filter and decide progression.
 */

import { callOllamaModel } from './utils/ollamaCaller'; // assume this wraps the Ollama API
import { scoreVectorSimilarity, vectorClockMerge } from './utils/vectorUtils';
import { VectorStore } from './utils/vectorStore';

// Interface for model response
interface DayResponse {
  day: number;
  name: string;
  content: string;
  vector: number[];
  timestamp: number;
}

// Names of your 6 days and their functions
const DAY_MODELS = [
  { day: 1, name: 'Form', model: 'day1-form' },
  { day: 2, name: 'Motion', model: 'day2-motion' },
  { day: 3, name: 'Shape', model: 'day3-shape' },
  { day: 4, name: 'Function', model: 'day4-function' },
  { day: 5, name: 'Behavior', model: 'day5-behavior' },
  { day: 6, name: 'Harmony', model: 'day6-harmony' }
];

// Simulate shared memory
const sharedContext: DayResponse[] = [];
const vectorDB = new VectorStore();

// Run all 6 days
async function runSixDays(seed: string): Promise<DayResponse[]> {
  const results: DayResponse[] = [];

  for (const day of DAY_MODELS) {
    const prompt = `Day ${day.day} (${day.name}): Given ${seed}, generate next state.`;
    const content = await callOllamaModel(day.model, prompt);
    const vector = await vectorDB.embed(content);
    const result: DayResponse = {
      day: day.day,
      name: day.name,
      content,
      vector,
      timestamp: Date.now()
    };
    sharedContext.push(result);
    vectorDB.storeVector(result);
    results.push(result);
  }

  return results;
}

// Day 7: Adjudicator
async function evaluateDay7(): Promise<'continue' | 'mutate' | 'halt'> {
  const mergedVector = vectorClockMerge(sharedContext.map(r => r.vector));
  const score = await scoreVectorSimilarity(mergedVector, vectorDB); // e.g. KNN score

  if (score > 0.85) return 'continue';
  if (score > 0.6) return 'mutate';
  return 'halt';
}

// Main engine loop
export async function startCreationLoop(seed: string) {
  let currentSeed = seed;
  let cycle = 0;

  while (true) {
    console.log(`--- Cycle ${cycle} ---`);
    await runSixDays(currentSeed);
    const verdict = await evaluateDay7();
    console.log('Verdict:', verdict);

    if (verdict === 'halt') break;
    if (verdict === 'mutate') {
      // mutate last response to seed next loop
      currentSeed = sharedContext[Math.floor(Math.random() * sharedContext.length)].content;
    }
    cycle++;
  }
}

// startCreationLoop('In the beginning...'); // 👈 Run this to start
