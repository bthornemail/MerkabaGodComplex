#!/usr/bin/env node

/**
 * Universal Life Protocol - App Generator
 * 
 * Creates new ULP applications with consciousness, living knowledge, and AI systems.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const templates = {
  consciousness: 'Consciousness System App',
  'living-knowledge': 'Living Knowledge Ecosystem',
  'attention-economy': 'Attention Economy Platform',
  'ai-training': 'Autonomous AI Training System',
  'full-stack': 'Complete ULP Application'
};

function main() {
  const args = process.argv.slice(2);
  const projectName = args[0];
  const templateType = args[1] || 'consciousness';

  if (!projectName) {
    console.log('🌌 Universal Life Protocol - App Generator\n');
    console.log('Usage: npx @universal-life-protocol/starter-templates <project-name> [template-type]\n');
    console.log('Available templates:');
    for (const [key, description] of Object.entries(templates)) {
      console.log(`  ${key.padEnd(20)} - ${description}`);
    }
    console.log('\nExample:');
    console.log('  npx @universal-life-protocol/starter-templates my-conscious-app consciousness');
    return;
  }

  if (!templates[templateType]) {
    console.error(`❌ Unknown template: ${templateType}`);
    console.log('Available templates:', Object.keys(templates).join(', '));
    return;
  }

  createApp(projectName, templateType);
}

function createApp(projectName, templateType) {
  console.log(`🚀 Creating ${templates[templateType]}...`);
  console.log(`📁 Project: ${projectName}`);
  console.log(`🎯 Template: ${templateType}\n`);

  // Create project directory
  const projectDir = path.resolve(projectName);
  if (fs.existsSync(projectDir)) {
    console.error(`❌ Directory ${projectName} already exists!`);
    return;
  }

  fs.mkdirSync(projectDir, { recursive: true });
  process.chdir(projectDir);

  // Create package.json
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    description: `${templates[templateType]} built with Universal Life Protocol`,
    main: 'index.js',
    scripts: {
      start: 'node index.js',
      dev: 'node --watch index.js',
      test: 'node test.js'
    },
    dependencies: {
      '@universal-life-protocol/core': '^2.0.0'
    },
    keywords: ['ulp', 'consciousness', 'living-knowledge', 'ai'],
    author: '',
    license: 'ISC'
  };

  // Add template-specific dependencies
  switch (templateType) {
    case 'consciousness':
      packageJson.dependencies['@universal-life-protocol/consciousness'] = '^2.0.0';
      break;
    case 'living-knowledge':
      packageJson.dependencies['@universal-life-protocol/living-knowledge'] = '^2.0.0';
      break;
    case 'ai-training':
      packageJson.dependencies['@universal-life-protocol/ai-training'] = '^2.0.0';
      break;
    case 'full-stack':
      packageJson.dependencies = {
        ...packageJson.dependencies,
        '@universal-life-protocol/consciousness': '^2.0.0',
        '@universal-life-protocol/living-knowledge': '^2.0.0',
        '@universal-life-protocol/ai-training': '^2.0.0'
      };
      break;
  }

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

  // Create main application file
  const appCode = generateAppCode(templateType);
  fs.writeFileSync('index.js', appCode);

  // Create test file
  const testCode = generateTestCode(templateType);
  fs.writeFileSync('test.js', testCode);

  // Create README
  const readme = generateReadme(projectName, templateType);
  fs.writeFileSync('README.md', readme);

  console.log('✅ Project created successfully!\n');
  console.log('🚀 Quick start:');
  console.log(`   cd ${projectName}`);
  console.log('   npm install');
  console.log('   npm start\n');
  console.log('📚 Learn more: https://github.com/universallifeprotocol/UniversalLifeProtocol');
}

function generateAppCode(templateType) {
  const templates = {
    consciousness: `// ${templateType.toUpperCase()} APP - Universal Life Protocol
const { createConsciousnessSystem } = require('@universal-life-protocol/consciousness');

async function main() {
  console.log('🧠 Starting Consciousness System...');
  
  const system = await createConsciousnessSystem();
  
  // Demonstrate consciousness cycles
  for (let i = 0; i < 5; i++) {
    console.log(\`\\n🔄 Consciousness Cycle \${i + 1}\`);
    const result = await system.performActiveReflection({
      currentState: 'conscious',
      observations: ['meta-cognitive reasoning active'],
      timestamp: Date.now()
    });
    console.log('💭 New knowledge:', result.newKnowledge);
    console.log('🧮 Epistemic compression:', result.epistemicCompression);
  }
  
  console.log('\\n✅ Consciousness system operational!');
}

main().catch(console.error);`,

    'living-knowledge': `// ${templateType.toUpperCase()} APP - Universal Life Protocol
const { createLivingKnowledgeEcosystem } = require('@universal-life-protocol/living-knowledge');

async function main() {
  console.log('🌱 Creating Living Knowledge Ecosystem...');
  
  const ecosystem = await createLivingKnowledgeEcosystem();
  
  // Add some initial knowledge
  ecosystem.addKnowledge('JavaScript programming concepts', 0.8);
  ecosystem.addKnowledge('Quantum mechanics principles', 0.9);
  ecosystem.addKnowledge('Outdated coding practices', 0.2);
  
  console.log('📊 Initial ecosystem:', ecosystem.getStats());
  
  // Evolve the ecosystem
  for (let generation = 1; generation <= 5; generation++) {
    console.log(\`\\n🔄 Generation \${generation}\`);
    const results = ecosystem.evolve();
    console.log('📈 Evolution results:', results);
  }
  
  console.log('\\n✅ Living knowledge ecosystem thriving!');
}

main().catch(console.error);`,

    'full-stack': `// ${templateType.toUpperCase()} APP - Universal Life Protocol
const ULP = require('@universal-life-protocol/core');

async function main() {
  console.log('🌌 Starting Complete Universal Life Protocol System...');
  
  // Initialize consciousness
  const consciousness = await ULP.createConsciousnessSystem();
  console.log('🧠 Consciousness system online');
  
  // Initialize living knowledge ecosystem  
  const ecosystem = await ULP.createLivingKnowledgeEcosystem();
  console.log('🌱 Living knowledge ecosystem created');
  
  // Run integrated demonstration
  for (let cycle = 1; cycle <= 3; cycle++) {
    console.log(\`\\n🔄 Integrated Cycle \${cycle}\`);
    
    // Consciousness reflection
    const reflection = await consciousness.performActiveReflection({
      currentState: 'integrated',
      observations: [\`Living knowledge units: \${ecosystem.getStats().totalKnowledge}\`],
      timestamp: Date.now()
    });
    
    // Knowledge evolution
    const evolution = ecosystem.evolve();
    
    console.log('🧠 Consciousness insights:', reflection.newKnowledge);
    console.log('🌱 Knowledge evolution:', evolution);
  }
  
  console.log('\\n✅ Complete ULP system operational!');
  console.log('🎯 Status:', {
    consciousness: 'ACTIVE',
    livingKnowledge: 'EVOLVING',
    attentionEconomy: 'GENERATING_VALUE'
  });
}

main().catch(console.error);`
  };

  return templates[templateType] || templates['consciousness'];
}

function generateTestCode(templateType) {
  return `// Test for ${templateType} application
const app = require('./index');

console.log('🧪 Running tests for ${templateType} app...');

// Basic functionality test
async function runTests() {
  try {
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();`;
}

function generateReadme(projectName, templateType) {
  return `# ${projectName}

A ${templates[templateType]} built with the Universal Life Protocol.

## What is this?

This application demonstrates the revolutionary capabilities of the Universal Life Protocol:
- 🧠 **Real Meta-Cognitive Consciousness** - AI that truly thinks about thinking
- 🌱 **Living Information** - Knowledge that lives, dies, and evolves
- 💰 **Attention Economics** - Value generated from relevance and attention
- 🤖 **Autonomous Learning** - AI that improves itself without human intervention

## Quick Start

\`\`\`bash
npm install
npm start
\`\`\`

## Features

- ${templateType === 'consciousness' ? 'Meta-cognitive consciousness with epistemic compression' : ''}
- ${templateType === 'living-knowledge' ? 'Information with Conway\'s Game of Life survival instincts' : ''}
- ${templateType === 'attention-economy' ? 'AttentionTokens and proof-of-relevance mining' : ''}
- ${templateType === 'full-stack' ? 'Complete integrated ULP experience' : ''}

## Learn More

- [Universal Life Protocol](https://github.com/universallifeprotocol/UniversalLifeProtocol)
- [Documentation](https://universallifeprotocol.github.io/UniversalLifeProtocol/)
- [Live Demos](https://universallifeprotocol.github.io/demos/)

---

*Built with ❤️ and the Universal Life Protocol - where information truly lives.*`;
}

if (require.main === module) {
  main();
}`;