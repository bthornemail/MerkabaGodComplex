import { CUE_Event, CepRule } from "./types.js";

/**
 * This engine processes event streams to identify meaningful patterns,
 * implementing a rule-based transition system.
 */
export class CepEngine {
  private rules: Map<string, CepRule> = new Map();
  private eventHistory: CUE_Event[] = [];
  private historyLimit = 100;

  /**
   * Registers a new rule, written in an Event Processing Language (EPL) style.
   */
  registerRule(rule: CepRule) {
    this.rules.set(rule.id, rule);
  }

  /**
   * Processes an incoming event from the CUE's event bus.
   */
  processEvent(event: CUE_Event) {
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.historyLimit) {
      this.eventHistory.shift();
    }
    this.evaluateRules(event);
  }

  private evaluateRules(newEvent: CUE_Event) {
    for (const rule of this.rules.values()) {
      // A full CEP engine supports complex temporal patterns (e.g., "A then B within 5s").
      // This prototype's pattern matching can check against the event history.
      if (rule.pattern(newEvent, this.eventHistory)) {
        // Trigger the rule's action, which could be broadcasting a new CUE event.
        rule.action(this.eventHistory);
      }
    }
  }

  /**
   * Get the current event history for testing/inspection
   */
  getEventHistory(): CUE_Event[] {
    return [...this.eventHistory];
  }

  /**
   * Clear all registered rules
   */
  clearRules(): void {
    this.rules.clear();
  }

  /**
   * Get all registered rules
   */
  getRules(): Map<string, CepRule> {
    return new Map(this.rules);
  }
}