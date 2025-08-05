// const entropy = countChangedStates(day6) / totalStates
// computeEntropy(vectorClockDay)

// checkThreshold(entropy, delta)

// advanceOrRevert(day, entropy, vectorClock)
// types.ts
export type ModelFile = {
  name: string;              // "day6-model"
  logic: string;             // LLM callable function, prompt, or rule set
  description?: string;
};

export type ProtoState = {
  name: string;              // "day6-proto"
  state: Record<string, any>;// Nested logical state representation
};

export type VectorClock = Record<string, number>; // agent/module → logical time

export type HyperNode = {
  model: ModelFile;
  proto: ProtoState;
  vectorClock: VectorClock;
};

export type EntropyReport = {
  entropy: number;
  changes: number;
  delta: number[];
  verdict: 'continue' | 'rest';
};

export function compareEntropy(prev: VectorClock, next: VectorClock, threshold = 0.5): EntropyReport {
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  let changes = 0;
  const delta: number[] = [];

  for (const key of keys) {
    const before = prev[key] ?? 0;
    const after = next[key] ?? 0;
    if (before !== after) {
      changes++;
    }
    delta.push(after - before);
  }

  const entropy = changes / keys.size;
  return {
    entropy,
    changes,
    delta,
    verdict: entropy >= threshold ? 'continue' : 'rest',
  };
}
