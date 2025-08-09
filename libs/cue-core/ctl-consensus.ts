import { CryptoUtil } from './crypto';
import { ULPTelemetry } from '../observability/telemetry.js';

/**
 * Implements the Continuous Transylvanian Lottery (CTL) consensus protocol.
 */
export class CtlConsensus {
  // The 7 points of the Fano plane represent 7 network validators.
  private readonly points: [string, string, string, string, string, string, string];

  // The 7 lines (sets of 3 points) are the pre-defined consensus quorums.
  // RECTIFIED: Corrected the Fano Plane definition for geometric integrity.
  private readonly lines: Array<Set<string>>;

  constructor(validatorIds: string[]) {
    if (validatorIds.length !== 7) {
      throw new Error('CTL requires exactly 7 validators for this Fano Plane implementation.');
    }
    const [p0, p1, p2, p3, p4, p5, p6] = validatorIds as [
      string,
      string,
      string,
      string,
      string,
      string,
      string
    ];
    this.points = [p0, p1, p2, p3, p4, p5, p6];
    this.lines = [
      new Set([this.points[0], this.points[1], this.points[3]]),
      new Set([this.points[1], this.points[2], this.points[4]]),
      new Set([this.points[2], this.points[3], this.points[5]]),
      new Set([this.points[3], this.points[4], this.points[6]]),
      new Set([this.points[4], this.points[5], this.points[0]]),
      new Set([this.points[5], this.points[6], this.points[1]]),
      new Set([this.points[6], this.points[0], this.points[2]]),
    ];
  }

  /**
   * Simulates the selection of a consensus quorum for a given round.
   * @param vrfSeed A seed for the Verifiable Random Function.
   * @returns The validator IDs of the activated consensus quorum.
   */
  getActivatedQuorum(vrfSeed: string): Set<string> | null {
    const { span, recordLatency } = ULPTelemetry.instrumentConsensus('quorum_activation');
    
    try {
      span.setAttributes({
        'consensus.seed': vrfSeed,
        'consensus.validator_count': this.points.length,
      });

      // A Verifiable Random Function (VRF) selects a small, random subset of validators.
      // We simulate selecting 3 "winning" validators based on the seed.
      const selectedValidators = this.selectRandomSubset(3, vrfSeed);

      // The mathematical properties of the Fano Plane guarantee that any 3 points will have
      // a well-defined intersection with one of the lines, deterministically activating a quorum.
      for (const line of this.lines) {
        const intersectionSize = [...selectedValidators].filter((v) => line.has(v)).length;
        // The design guarantees an intersection of at least 2 will activate a single quorum.
        if (intersectionSize >= 2) {
          span.setAttributes({
            'consensus.quorum_size': line.size,
            'consensus.intersection_size': intersectionSize,
          });
          return line;
        }
      }
      
      span.setAttributes({ 'consensus.result': 'no_quorum_found' });
      return null; // Should not happen in a correctly configured system.
      
    } finally {
      recordLatency();
      span.end();
    }
  }

  // Helper to simulate a deterministic selection based on a seed (simulating a VRF).
  private selectRandomSubset(size: number, seed: string): Set<string> {
    // Simple deterministic shuffling based on seed hash
    const sorted = [...this.points].sort((a, b) => {
      const hashA = CryptoUtil.simpleHash(a + seed);
      const hashB = CryptoUtil.simpleHash(b + seed);
      return hashA - hashB;
    });
    return new Set(sorted.slice(0, size));
  }
}