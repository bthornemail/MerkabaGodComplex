import { Vec7HarmonyUnit, ConsensusLevel } from './types';
import chalk from 'chalk';

const getVectorSum = (unit: Vec7HarmonyUnit): number => {
  return unit.vec1.byteLength + unit.vec2.byteLength +
         unit.vec3.reduce((a,b)=>a+b,0) +
         unit.vec4.bufferLengths.reduce((a,b)=>a+b,0) +
         unit.vec5.byteLength + unit.vec6.byteLength + unit.vec7.byteLength;
}

/**
 * Implements the Harmonic Axioms, defining the prime moduli checks for each phase.
 */
class HarmonicAxioms {
  private static readonly CONSENSUS_PRIMES: Record<ConsensusLevel, number[]> = {
    LOCAL: [3],
    PEER_TO_PEER: [3, 5],
    GROUP: [3, 5, 7],
    GLOBAL: [3, 5, 7, 11]
  };

  private static universalPhaseCheck = (data: Vec7HarmonyUnit, prime: number): boolean => {
    const magnitude = data.vec1.byteLength + data.vec5.byteLength + data.vec7.byteLength + data.harmonicSignature.h;
    return magnitude % prime === 0;
  }

  static validateHarmonyUnit(vec7: Vec7HarmonyUnit, level: ConsensusLevel): boolean {
    const requiredPrimes = this.CONSENSUS_PRIMES[level];
    for (const prime of requiredPrimes) {
      if (!this.universalPhaseCheck(vec7, prime)) {
        console.error(chalk.red(`[Axiom] Check failed for phase ${vec7.phase} against prime base ${prime}.`));
        return false;
      }
    }
    return true;
  }
}

/**
 * The Harmony Processor is the Grand Unified Axiom engine.
 */
export class HarmonyProcessor {
  // RECTIFICATION_BASE (24) is a critical higher-order universal constant.
  // A state transition must be harmonically balanced by this base.
  private static readonly RECTIFICATION_BASE = 24;

  static validateTransition(
    inputUnit: Vec7HarmonyUnit,
    outputUnit: Vec7HarmonyUnit,
    level: ConsensusLevel
  ): boolean {
    // 1. Validate input and output states' intrinsic coherence.
    if (!HarmonicAxioms.validateHarmonyUnit(inputUnit, level) || !HarmonicAxioms.validateHarmonyUnit(outputUnit, level)) {
      console.error(chalk.red.dim(`[HarmonyProcessor] Validation failed: Input or output state is invalid at consensus level '${level}'.`));
      return false;
    }

    // 2. Apply the Rectification Law.
    const transitionDelta = Math.abs(getVectorSum(outputUnit) - getVectorSum(inputUnit));
    if (transitionDelta % this.RECTIFICATION_BASE !== 0) {
      console.error(chalk.red.dim(`[HarmonyProcessor] Validation failed: State transition (delta=${transitionDelta}) not balanced by base ${this.RECTIFICATION_BASE}.`));
      return false;
    }

    console.log(chalk.green.dim(`[HarmonyProcessor] Transition at level '${level}' is valid against primes: [${HarmonicAxioms['CONSENSUS_PRIMES'][level].join(', ')}].`));
    return true;
  }
}