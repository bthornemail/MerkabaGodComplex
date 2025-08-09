import { MduState } from "./types.js";

/**
 * Provides functions for multi-domain state resolution and harmonic resonance detection.
 * NOTE: This is a simplified implementation. A production system would use a BigInt library.
 */
export class CrtModule {
  /**
   * Solves a system of congruences x ≡ a_i (mod n_i) to find the unique Universal Counter N.
   * @param congruences An array of [address, base] pairs, e.g., [[A_1, B_1], [A_2, B_2]].
   * @returns The smallest non-negative integer solution for N.
   */
  static solve(congruences: [number, number][]): number {
    const product = congruences.reduce((acc, [, base]) => acc * BigInt(base), 1n);
    let sum = 0n;
    for (const [address, base] of congruences) {
      const bigBase = BigInt(base);
      const partialProduct = product / bigBase;
      const inverse = this.multiplicativeInverse(partialProduct, bigBase);
      sum += BigInt(address) * partialProduct * inverse;
    }
    return Number(sum % product);
  }

  /**
   * Checks for a harmonic resonance event, which occurs if an entity's address aligns
   * across multiple specified domains, often at a zero-state.
   * @param states A map of an entity's current states across different domains.
   * @param targetDomains An array of domain names (e.g., 'daily_cycle', 'weekly_cycle').
   * @param targetAddress The address to check for alignment (typically 0).
   * @returns True if all target domains are at the target address.
   */
  static checkHarmonicResonance(
    states: Map<string, MduState>,
    targetDomains: string[],
    targetAddress: number = 0
  ): boolean {
    return targetDomains.every(domainId => {
      const state = states.get(domainId);
      return state && state.A === targetAddress;
    });
  }

  // Extended Euclidean Algorithm for modular multiplicative inverse with BigInts.
  private static multiplicativeInverse(a: bigint, m: bigint): bigint {
    const b = a % m;
    for (let x = 1n; x < m; x++) {
      if ((b * x) % m === 1n) {
        return x;
      }
    }
    return 1n;
  }
}