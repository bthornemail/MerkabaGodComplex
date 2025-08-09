import { compareEntropy, HyperNode } from './types';

const day6: HyperNode = {
  model: {
    name: 'day6-model',
    logic: 'create beings with shared context and judgment layer',
  },
  proto: {
    name: 'day6-proto',
    state: {
      creatures: ['human', 'animal'],
      judgment: false,
    },
  },
  vectorClock: {
    creation: 6,
    spirit: 6,
    judgment: 0,
  }
};

const day7: HyperNode = {
  model: {
    name: 'day7-model',
    logic: 'judge creation and rest if good',
  },
  proto: {
    name: 'day7-proto',
    state: {
      rest: true,
      verdict: 'pending',
    },
  },
  vectorClock: {
    creation: 6,
    spirit: 6,
    judgment: 1,
  }
};

const report = compareEntropy(day6.vectorClock, day7.vectorClock);

console.log("Day 7 Entropy Report:", report);
/*
Day 7 Entropy Report:
{
  entropy: 0.333,
  changes: 1,
  delta: [0, 0, 1],
  verdict: 'rest'
}
*/
