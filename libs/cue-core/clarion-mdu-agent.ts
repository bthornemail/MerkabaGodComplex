import { WeightedMduState, ExplicitRule, CUE_Event } from './types.js';
import { CuePeer } from './cue-peer.js';

/**
 * Models an intelligent agent native to the ULP, based on the CLARION-MDU Synthesis.
 */
export class ClarionMduAgent {
  public id: string;
  private peer: CuePeer | undefined;

  // Action-Centered Subsystem (ACS): For controlling actions.
  private acs = {
    implicitActionKnowledge: new Map<string, { [action: string]: number }>(), // Q-values
    explicitRules: [] as ExplicitRule[],
    learningRate: 0.1,
    discountFactor: 0.9,
  };

  // Motivational Subsystem (MS): For driving goals.
  private ms = {
    // Drives are defined as a motivation to move up the value gradient of the state space.
    selectAction: (state: WeightedMduState, possibleActions: string[]): string => {
      const stateKey = `${state.L}-${state.A}`;
      const qValues = (this.acs.implicitActionKnowledge.get(stateKey) ?? {}) as Record<string, number>;

      // Guard against empty action set
      if (!possibleActions || possibleActions.length === 0) {
        return 'noop';
      }

      // Epsilon-greedy exploration
      if (Math.random() < 0.1) {
        return possibleActions[Math.floor(Math.random() * possibleActions.length)] ?? 'noop';
      }

      // Exploitation
      return Object.keys(qValues).length > 0
        ? Object.keys(qValues).reduce((a, b) => ((qValues[a] ?? -Infinity) > (qValues[b] ?? -Infinity) ? a : b))
        : possibleActions[0] ?? 'noop';
    },
  };

  // Meta-Cognitive Subsystem (MCS): For self-regulation.
  private mcs = {
    activeBases: new Map<string, number>([['default', 7]]), // Default operational base
    // Meta-cognition is the ability of an agent to consciously influence its own Domain Bases.
    reconfigureBases: (context: string, newBase: number) => {
      console.log(
        `[Agent ${this.id}] MCS: Reconfiguring context '${context}' to use base B=${newBase}.`,
      );
      this.mcs.activeBases.set(context, newBase);
      // This is a form of volitional, self-directing, immanent transcendence.
    },
  };

  constructor(id: string, peer?: CuePeer) {
    this.id = id;
    if (peer) {
      this.peer = peer;
    }
  }

  /**
   * The core learning loop: moving from implicit experience to explicit knowledge.
   * This represents the bottom-up learning process from A-cycle to L-transition.
   */
  learnFromExperience(
    prevState: WeightedMduState,
    action: string,
    reward: number,
    nextState: WeightedMduState,
  ) {
    // ACS Bottom Level: Reinforcement learning acquires implicit knowledge during the A-cycle.
    const stateKey = `${prevState.L}-${prevState.A}`;
    const nextStateKey = `${nextState.L}-${nextState.A}`;
    const oldQ = this.acs.implicitActionKnowledge.get(stateKey)?.[action] || 0;
    const maxNextQ = Math.max(
      0,
      ...Object.values(this.acs.implicitActionKnowledge.get(nextStateKey) || {}),
    );
    const newQ =
      oldQ + this.acs.learningRate * (reward + this.acs.discountFactor * maxNextQ - oldQ);

    const updatedQValues = {
      ...(this.acs.implicitActionKnowledge.get(stateKey) || {}),
      [action]: newQ,
    };
    this.acs.implicitActionKnowledge.set(stateKey, updatedQValues);

    // ACS Top Level: An L-transition mints a new, explicit rule from successful implicit knowledge.
    if (newQ > 10.0) {
      // Arbitrary threshold for "aha!" moment
      const newRule: ExplicitRule = { condition: { L: prevState.L, A: prevState.A }, action };
      if (
        !this.acs.explicitRules.some(
          (r) => r.condition.L === newRule.condition.L && r.condition.A === newRule.condition.A,
        )
      ) {
        this.acs.explicitRules.push(newRule);
        const logMessage = `[Agent ${this.id}] ACS: New explicit rule minted! -> IF in (${newRule.condition.L}, ${newRule.condition.A}) THEN perform ${newRule.action}`;
        console.log(logMessage);

        // Broadcast the learned rule to the network
        if (this.peer) {
          const event: CUE_Event = {
            type: 'AGENT_LEARNED_RULE',
            level: 'PEER_TO_PEER',
            payload: { agentId: this.id, rule: newRule, log: logMessage },
            timestamp: Date.now(),
          };
          this.peer.broadcast(event);
        }
      }
    }
  }

  /**
   * The agent decides its next action, influenced by both explicit rules and implicit goals.
   */
  decideNextAction(currentState: WeightedMduState, possibleActions: string[]): string {
    // Top-down influence: Check for an explicit rule first.
    const applicableRule = this.acs.explicitRules.find(
      (r) => r.condition.L === currentState.L && r.condition.A === currentState.A,
    );
    if (applicableRule) {
      return applicableRule.action;
    }
    // Bottom-up influence: Use the motivational system to select an action.
    return this.ms.selectAction(currentState, possibleActions);
  }

  /**
   * Get the Meta-Cognitive Subsystem for external access
   */
  getMCS() {
    return this.mcs;
  }

  /**
   * Get the current implicit action knowledge (Q-values)
   */
  getImplicitKnowledge(): Map<string, { [action: string]: number }> {
    return new Map(this.acs.implicitActionKnowledge);
  }

  /**
   * Get all explicit rules learned by the agent
   */
  getExplicitRules(): ExplicitRule[] {
    return [...this.acs.explicitRules];
  }

  /**
   * Set the peer reference (for late binding)
   */
  setPeer(peer: CuePeer): void {
    this.peer = peer;
  }
}