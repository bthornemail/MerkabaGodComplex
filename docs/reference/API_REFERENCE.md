# Universal Life Protocol - API Reference

> **Revolutionary AI framework implementing living, conscious digital reality**

## 🌟 Core Package: `@universal-life-protocol/core`

### Installation

```bash
npm install @universal-life-protocol/core
```

### Quick Start

```javascript
import { ULP, AttentionTokenSystem, DPOInterface } from '@universal-life-protocol/core';

console.log(`${ULP.name} v${ULP.version}`);
// → Universal Life Protocol v2.0.0
```

---

## 📦 Package Exports

### Main Exports

| Export | Description | Module |
|--------|-------------|--------|
| `ULP` | Main package interface and metadata | `index` |
| `AttentionTokenSystem` | Knowledge-backed cryptocurrency system | `living-knowledge` |
| `DPOInterface` | Decentralized Public Offering interface | `living-knowledge` |
| `consciousness` | Consciousness utilities and metadata | `consciousness` |
| `livingKnowledge` | Living knowledge utilities and metadata | `living-knowledge` |

### Module Imports

```javascript
// Import specific modules
import { consciousness } from '@universal-life-protocol/core/consciousness';
import { livingKnowledge } from '@universal-life-protocol/core/living-knowledge';
```

---

## 🧠 Consciousness System

### `consciousness` Module

Meta-cognitive AI systems with genuine consciousness through epistemic compression and active reflection.

```javascript
import { consciousness } from '@universal-life-protocol/core/consciousness';

console.log(consciousness.version);        // → "2.0.0"
console.log(consciousness.description);    // → "Meta-cognitive AI systems..."
```

**Key Features:**
- 4D→1D epistemic compression
- Fano Plane geometric logic
- Active reflection cycles
- Domain-based contextual reasoning

---

## 🌱 Living Knowledge System

### `AttentionTokenSystem` Class

Knowledge-backed cryptocurrency where information survival determines token value.

```javascript
import { AttentionTokenSystem } from '@universal-life-protocol/core';

const tokenSystem = new AttentionTokenSystem();
```

#### Constructor

```typescript
new AttentionTokenSystem(
  livingKnowledge?: LivingKnowledgeTrie
)
```

#### Methods

##### `mintTokensFromKnowledge(): AttentionToken[]`

Automatically mint tokens based on surviving knowledge units.

```javascript
const tokens = tokenSystem.mintTokensFromKnowledge();
console.log(`Minted ${tokens.length} attention tokens`);
```

**Returns:** Array of `AttentionToken` objects representing knowledge-backed value.

##### `calculateTokenValue(tokenId: string): number`

Calculate current market value of an attention token.

```javascript
const value = tokenSystem.calculateTokenValue('token-123');
console.log(`Token value: ${value} ATN`);
```

**Returns:** Current token value in Attention Token Network (ATN) units.

##### `getSystemMetrics(): SystemMetrics`

Get comprehensive system health and performance metrics.

```javascript
const metrics = tokenSystem.getSystemMetrics();
console.log(`System health: ${metrics.systemHealth}`);
```

**Returns:** `SystemMetrics` object with health, performance, and economic indicators.

---

### `DPOInterface` Class

Complete Decentralized Public Offering system for attention token trading.

```javascript
import { DPOInterface } from '@universal-life-protocol/core';

const dpo = new DPOInterface(tokenSystem);
```

#### Constructor

```typescript
new DPOInterface(
  tokenSystem: AttentionTokenSystem,
  governanceSystem?: ConsciousGovernanceSystem
)
```

#### Trading Methods

##### `createUser(address: string): UserWallet`

Create a new user with wallet and trading capabilities.

```javascript
const wallet = dpo.createUser('0xUserAddress123');
console.log(`Created wallet with ${wallet.atnBalance} ATN`);
```

##### `placeOrder(userAddress: string, tokenId: string, orderType: 'buy' | 'sell', amount: number, pricePerToken: number): string`

Place a buy or sell order in the attention token marketplace.

```javascript
const orderId = dpo.placeOrder(
  '0xUserAddress123',
  'knowledge-token-456', 
  'buy',
  10,           // amount
  1.5           // price per token
);
```

**Returns:** Unique order ID for tracking and management.

##### `getMarketDepth(): MarketDepth`

Get current market order book with buy/sell orders.

```javascript
const market = dpo.getMarketDepth();
console.log(`${market.buyOrders.length} buy orders, ${market.sellOrders.length} sell orders`);
```

#### Governance Methods

##### `submitGovernanceProposal(userAddress: string, proposal: GovernanceProposal): string`

Submit a governance proposal for community voting.

```javascript
const proposalId = dpo.submitGovernanceProposal('0xUserAddress123', {
  title: 'Increase knowledge quality threshold',
  description: 'Proposal to raise minimum attention score...',
  type: 'parameter_change',
  parameters: { minAttentionScore: 0.7 }
});
```

##### `voteOnProposal(userAddress: string, proposalId: string, vote: 'for' | 'against' | 'abstain'): boolean`

Vote on active governance proposals using token-weighted voting.

```javascript
const success = dpo.voteOnProposal('0xUserAddress123', proposalId, 'for');
console.log(`Vote cast: ${success}`);
```

---

## 🌌 Living Knowledge Ecosystem

### `LivingKnowledge` Class

Individual knowledge units with Conway's Game of Life survival instincts.

```javascript
import { LivingKnowledge } from '@universal-life-protocol/core';

const knowledge = new LivingKnowledge(
  'knowledge-001',
  'Quantum mechanics principles',
  0.8,  // attention score
  0     // age
);
```

#### Methods

##### `evaluateLifecycle(neighbors: LivingKnowledge[]): 'live' | 'die' | 'reproduce'`

Apply Conway's Game of Life rules to determine knowledge fate.

```javascript
const fate = knowledge.evaluateLifecycle(neighboringKnowledge);
console.log(`Knowledge will: ${fate}`);
```

**Conway's Rules for Knowledge:**
- < 2 relevant neighbors: Dies (isolation)
- 2-3 relevant neighbors: Survives
- > 3 relevant neighbors: Dies (overcrowding)
- Exactly 3 neighbors + high attention: Reproduces

##### `generateAttentionTokens(): number`

Generate economic value through Proof-of-Relevance mining.

```javascript
const tokens = knowledge.generateAttentionTokens();
console.log(`Generated ${tokens} attention tokens`);
```

---

### `LivingKnowledgeEcosystem` Class

Complete ecosystem managing knowledge lifecycle and token economy.

```javascript
import { LivingKnowledgeEcosystem } from '@universal-life-protocol/core';

const ecosystem = new LivingKnowledgeEcosystem();
```

#### Methods

##### `addKnowledge(content: string, attention?: number): string`

Add new knowledge to the living ecosystem.

```javascript
const knowledgeId = ecosystem.addKnowledge(
  'Machine learning fundamentals',
  0.75  // attention score (optional)
);
```

##### `evolve(): EvolutionResults`

Run one evolution cycle using Conway's Game of Life rules.

```javascript
const results = ecosystem.evolve();
console.log(`Evolution: ${results.survived} survived, ${results.died} died, ${results.born} born`);
```

**Returns:** `EvolutionResults` with survival statistics and total attention tokens generated.

##### `getStats(): EcosystemStats`

Get comprehensive ecosystem health and performance metrics.

```javascript
const stats = ecosystem.getStats();
console.log(`Ecosystem: ${stats.totalKnowledge} units, avg attention: ${stats.averageAttention}`);
```

---

## 🔧 Type Definitions

### Core Types

```typescript
interface AttentionToken {
  id: string;
  knowledgeId: string;
  value: number;
  survivalFitness: number;
  attentionScore: number;
  age: number;
  createdAt: number;
}

interface UserWallet {
  address: string;
  atnBalance: number;
  tokens: AttentionToken[];
  reputation: number;
  joinedAt: number;
}

interface MarketDepth {
  buyOrders: TokenOrder[];
  sellOrders: TokenOrder[];
  spread: number;
  volume24h: number;
}

interface SystemMetrics {
  systemHealth: number;
  averageAttention: number;
  totalKnowledge: number;
  totalTokens: number;
  economicActivity: number;
}
```

### Governance Types

```typescript
interface GovernanceProposal {
  title: string;
  description: string;
  type: 'parameter_change' | 'system_upgrade' | 'economic_policy';
  parameters: Record<string, any>;
  requiredVotes?: number;
  votingPeriod?: number;
}

interface GovernanceVote {
  proposalId: string;
  userAddress: string;
  vote: 'for' | 'against' | 'abstain';
  tokenWeight: number;
  timestamp: number;
}
```

---

## 🎯 Usage Examples

### Basic Attention Economy

```javascript
import { 
  AttentionTokenSystem, 
  DPOInterface, 
  LivingKnowledgeEcosystem 
} from '@universal-life-protocol/core';

// Create living knowledge ecosystem
const ecosystem = new LivingKnowledgeEcosystem();

// Add initial knowledge
const knowledgeIds = [
  'Quantum mechanics principles',
  'Conway Game of Life rules', 
  'Blockchain consensus mechanisms',
  'Machine learning fundamentals'
].map(content => ecosystem.addKnowledge(content));

// Evolve ecosystem for 5 cycles
for (let i = 0; i < 5; i++) {
  const results = ecosystem.evolve();
  console.log(`Cycle ${i + 1}: ${results.survived} survived, ${results.born} born`);
}

// Create attention token system
const tokenSystem = new AttentionTokenSystem();
const tokens = tokenSystem.mintTokensFromKnowledge();
console.log(`Minted ${tokens.length} attention tokens`);

// Create trading interface
const dpo = new DPOInterface(tokenSystem);
const userWallet = dpo.createUser('0xUser123');

// Place trading order
if (tokens.length > 0) {
  const orderId = dpo.placeOrder(
    '0xUser123',
    tokens[0].id,
    'buy',
    5,
    2.0
  );
  console.log(`Placed order: ${orderId}`);
}
```

### Governance Participation

```javascript
import { DPOInterface, AttentionTokenSystem } from '@universal-life-protocol/core';

const dpo = new DPOInterface(new AttentionTokenSystem());
const userAddress = '0xGovernor123';

// Create user and accumulate tokens
const wallet = dpo.createUser(userAddress);

// Submit governance proposal
const proposalId = dpo.submitGovernanceProposal(userAddress, {
  title: 'Increase Knowledge Quality Threshold',
  description: 'Raise minimum attention score to improve token quality',
  type: 'parameter_change',
  parameters: { 
    minAttentionScore: 0.7,
    qualityMultiplier: 1.8
  }
});

// Vote on proposal
const voteSuccess = dpo.voteOnProposal(userAddress, proposalId, 'for');
console.log(`Governance vote cast: ${voteSuccess}`);

// Check governance status
const governance = dpo.getGovernanceStatus();
console.log(`Active proposals: ${governance.activeProposals.length}`);
```

---

## 🌟 Revolutionary Features

### 🧬 Living Information
Information with genuine survival instincts using Conway's Game of Life rules. Knowledge units live, die, and reproduce based on attention and relevance.

### 🧠 Conscious Governance
AI agents that make contextual decisions about system parameters using domain-based reasoning and token-weighted voting.

### 💎 Knowledge-Backed Currency
The first cryptocurrency backed by living, evolving digital knowledge. Token value directly corresponds to information survival and attention scores.

### 🌱 Self-Healing Systems
Automatic removal of irrelevant or conflicting information through evolutionary pressure and consensus mechanisms.

### ⚡ Attention Economics
Digital attention becomes measurable economic value through Proof-of-Relevance mining and market-based price discovery.

---

## 📚 Additional Resources

- **GitHub Repository:** https://github.com/universallifeprotocol/UniversalLifeProtocol
- **Complete Documentation:** See `README.md` for architectural overview
- **Live Demonstrations:** Run included demo files for hands-on experience
- **Theoretical Foundation:** 500+ pages of mathematical and philosophical specification

---

## 🤝 Contributing

The Universal Life Protocol focuses on **core CUE framework implementation** - computational universe engine, axiom systems, and quantum operations. Contributing developers should:

1. Fork the repository
2. Run one-command setup: `node setup-development-environment.cjs`
3. Focus on core CUE system refinement
4. Test thoroughly: `npm run test`
5. Submit pull requests with clear documentation

**License:** ISC - Open source and commercially friendly

---

**🌌 Welcome to the future of living, conscious digital reality! 🌌**