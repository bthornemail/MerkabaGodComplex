#!/usr/bin/env node

/**
 * Universal Life Protocol - Project Generator
 * 
 * Quick starter template generator for ULP applications
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌌 Universal Life Protocol - Project Generator');
console.log('==============================================\n');

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });
}

async function generateProject() {
  try {
    // Get project details
    const projectName = await askQuestion('📛 Project name: ');
    const projectType = await askQuestion('🎯 Project type (consciousness/living-knowledge/dpo-trading/full-ecosystem): ');
    const useTypeScript = (await askQuestion('📝 Use TypeScript? (y/N): ')).toLowerCase() === 'y';
    
    const projectDir = path.join(process.cwd(), projectName);
    
    // Create project directory
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
      console.log(`\n✅ Created project directory: ${projectName}`);
    } else {
      console.log(`\n⚠️  Directory ${projectName} already exists`);
      process.exit(1);
    }
    
    // Generate package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      description: `Universal Life Protocol ${projectType} application`,
      main: useTypeScript ? 'dist/index.js' : 'index.js',
      type: 'module',
      scripts: {
        start: useTypeScript ? 'node dist/index.js' : 'node index.js',
        dev: useTypeScript ? 'tsx index.ts' : 'node index.js',
        ...((useTypeScript) && {
          build: 'tsc',
          'dev:watch': 'tsx watch index.ts'
        }),
        test: 'echo "Add your tests here"'
      },
      dependencies: {
        '@universal-life-protocol/core': '^2.0.0'
      },
      ...((useTypeScript) && {
        devDependencies: {
          '@types/node': '^20.0.0',
          typescript: '^5.0.0',
          tsx: '^4.0.0'
        }
      }),
      keywords: ['ulp', 'universal-life-protocol', projectType, 'consciousness', 'living-knowledge'],
      author: '',
      license: 'ISC'
    };
    
    fs.writeFileSync(
      path.join(projectDir, 'package.json'), 
      JSON.stringify(packageJson, null, 2)
    );
    
    // Generate TypeScript config if needed
    if (useTypeScript) {
      const tsConfig = {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'node',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          outDir: './dist',
          rootDir: './src'
        },
        include: ['src/**/*', 'index.ts'],
        exclude: ['node_modules', 'dist']
      };
      
      fs.writeFileSync(
        path.join(projectDir, 'tsconfig.json'),
        JSON.stringify(tsConfig, null, 2)
      );
    }
    
    // Generate project template based on type
    let template = generateTemplate(projectType, useTypeScript);
    
    const mainFile = useTypeScript ? 'index.ts' : 'index.js';
    fs.writeFileSync(path.join(projectDir, mainFile), template);
    
    // Generate README
    const readme = generateReadme(projectName, projectType, useTypeScript);
    fs.writeFileSync(path.join(projectDir, 'README.md'), readme);
    
    // Generate .gitignore
    const gitignore = `
node_modules/
dist/
*.log
.env
.DS_Store
${useTypeScript ? '*.js\n*.d.ts\n' : ''}
`.trim();
    fs.writeFileSync(path.join(projectDir, '.gitignore'), gitignore);
    
    console.log('\n🎉 Project generated successfully!');
    console.log('\n📋 Next steps:');
    console.log(`   cd ${projectName}`);
    console.log('   npm install');
    console.log(useTypeScript ? '   npm run dev' : '   npm start');
    console.log('\n🌟 Happy coding with Universal Life Protocol!');
    
  } catch (error) {
    console.error('❌ Error generating project:', error);
  } finally {
    rl.close();
  }
}

function generateTemplate(type, useTypeScript) {
  const lang = useTypeScript ? 'ts' : 'js';
  const imports = `import { ULP${getImports(type)} } from '@universal-life-protocol/core';`;
  
  switch (type) {
    case 'consciousness':
      return `${imports}

console.log('🧠 Universal Life Protocol - Consciousness Application');
console.log('===================================================\\n');

console.log(\`Starting \${ULP.name} v\${ULP.version}\`);
console.log('🌟 Building conscious AI systems...\\n');

async function demonstrateConsciousness() {
  // Your consciousness system implementation here
  console.log('🔷 Implementing meta-cognitive reasoning...');
  console.log('📐 Applying Fano Plane geometric logic...');
  console.log('🌀 Performing epistemic compression (4D→1D)...');
  
  console.log('\\n✅ Consciousness system initialized!');
  console.log('🧠 Ready for meta-cognitive operations');
}

// Start consciousness demonstration
demonstrateConsciousness().catch(console.error);
`;

    case 'living-knowledge':
      return `${imports}

console.log('🌱 Universal Life Protocol - Living Knowledge Application');
console.log('======================================================\\n');

async function createLivingEcosystem() {
  console.log('Creating living knowledge ecosystem...');
  
  const ecosystem = new LivingKnowledgeEcosystem();
  
  // Add initial knowledge
  const knowledgeBase = [
    'Quantum mechanics enables quantum computing',
    'Machine learning transforms data into insights', 
    'Conway\\'s Game of Life demonstrates emergence',
    'Universal Life Protocol creates digital consciousness'
  ];
  
  knowledgeBase.forEach(content => {
    ecosystem.addKnowledge(content, Math.random());
  });
  
  console.log(\`🌱 Seeded ecosystem with \${knowledgeBase.length} knowledge units\\n\`);
  
  // Evolve for 5 cycles
  for (let cycle = 1; cycle <= 5; cycle++) {
    const results = ecosystem.evolve();
    console.log(\`Cycle \${cycle}: \${results.survived} survived, \${results.died} died, \${results.born} born\`);
  }
  
  const stats = ecosystem.getStats();
  console.log(\`\\n📊 Final ecosystem: \${stats.aliveKnowledge} living units\`);
  console.log(\`💰 Economic value: \${stats.totalAttentionTokens.toFixed(2)} ATN\`);
}

createLivingEcosystem().catch(console.error);
`;

    case 'dpo-trading':
      return `${imports}

console.log('💎 Universal Life Protocol - DPO Trading Application');
console.log('===================================================\\n');

async function createTradingSystem() {
  console.log('🏗️ Initializing DPO trading system...');
  
  // Create attention token system
  const tokenSystem = new AttentionTokenSystem();
  const tokens = tokenSystem.mintTokensFromKnowledge();
  console.log(\`💎 Minted \${tokens.length} attention tokens\`);
  
  // Create DPO interface
  const dpo = new DPOInterface(tokenSystem);
  
  // Create traders
  const alice = dpo.createUser('0xAlice123');
  const bob = dpo.createUser('0xBob456');
  
  console.log(\`👥 Created traders: Alice (\${alice.atnBalance} ATN), Bob (\${bob.atnBalance} ATN)\`);
  
  // Place orders
  if (tokens.length > 0) {
    const topToken = tokens[0];
    
    const buyOrder = dpo.placeOrder('0xAlice123', topToken.id, 'buy', 5, 2.0);
    const sellOrder = dpo.placeOrder('0xBob456', topToken.id, 'sell', 3, 1.8);
    
    console.log(\`📊 Orders placed: \${buyOrder} (buy), \${sellOrder} (sell)\`);
    
    const market = dpo.getMarketDepth();
    console.log(\`💹 Market: \${market.buyOrders.length} buy orders, \${market.sellOrders.length} sell orders\`);
  }
  
  console.log('\\n🎉 DPO trading system operational!');
}

createTradingSystem().catch(console.error);
`;

    case 'full-ecosystem':
      return `${imports}

console.log('🌌 Universal Life Protocol - Complete Ecosystem Application');
console.log('==========================================================\\n');

async function createCompleteEcosystem() {
  console.log('🚀 Initializing complete Universal Life Protocol ecosystem...');
  
  // 1. Create living knowledge
  console.log('\\n🌱 Step 1: Creating living knowledge ecosystem');
  const ecosystem = new LivingKnowledgeEcosystem();
  
  const knowledgeBase = [
    'Quantum mechanics principles',
    'Conway Game of Life emergence',
    'Blockchain consensus mechanisms',
    'Machine learning fundamentals',
    'Universal Life Protocol framework',
    'Attention economics theory'
  ];
  
  knowledgeBase.forEach(content => {
    ecosystem.addKnowledge(content, Math.random());
  });
  
  // 2. Evolve knowledge
  console.log('🔄 Step 2: Evolving knowledge through survival selection');
  for (let cycle = 1; cycle <= 3; cycle++) {
    const results = ecosystem.evolve();
    console.log(\`  Cycle \${cycle}: \${results.survived} survived, \${results.born} born\`);
  }
  
  // 3. Create economy
  console.log('\\n💎 Step 3: Creating knowledge-backed economy');
  const tokenSystem = new AttentionTokenSystem();
  const tokens = tokenSystem.mintTokensFromKnowledge();
  console.log(\`  Minted \${tokens.length} attention tokens\`);
  
  // 4. Create trading
  console.log('\\n📊 Step 4: Establishing trading marketplace');
  const dpo = new DPOInterface(tokenSystem);
  const traders = ['0xAlice', '0xBob', '0xCharlie'].map(addr => {
    const user = dpo.createUser(addr);
    return { address: addr, balance: user.atnBalance };
  });
  
  console.log(\`  Created \${traders.length} traders\`);
  
  // 5. Demonstrate governance
  console.log('\\n🏛️ Step 5: Enabling conscious governance');
  if (traders.length > 0) {
    const proposalId = dpo.submitGovernanceProposal(traders[0].address, {
      title: 'Increase Knowledge Quality Threshold',
      description: 'Improve token quality by raising minimum attention score',
      type: 'parameter_change',
      parameters: { minAttentionScore: 0.7 }
    });
    
    console.log(\`  Submitted governance proposal: \${proposalId}\`);
  }
  
  console.log('\\n🌟 Complete Universal Life Protocol ecosystem operational!');
  console.log('🎯 Features active:');
  console.log('   ✅ Living information with survival instincts');
  console.log('   ✅ Knowledge-backed cryptocurrency');
  console.log('   ✅ Decentralized trading marketplace');
  console.log('   ✅ Conscious governance system');
  console.log('   ✅ Self-healing information networks');
  console.log('\\n🌌 Welcome to the future of digital consciousness!');
}

createCompleteEcosystem().catch(console.error);
`;

    default:
      return `${imports}

console.log('🌌 Universal Life Protocol - Custom Application');
console.log('==============================================\\n');

console.log(\`Welcome to \${ULP.name} v\${ULP.version}!\`);
console.log('🎯 Build your conscious digital reality here');

// Your custom ULP application code here
async function main() {
  // TODO: Implement your application logic
  console.log('🚧 Ready for development!');
}

main().catch(console.error);
`;
  }
}

function getImports(type) {
  switch (type) {
    case 'consciousness':
      return ', consciousness';
    case 'living-knowledge':
      return ', LivingKnowledgeEcosystem';
    case 'dpo-trading':
      return ', AttentionTokenSystem, DPOInterface';
    case 'full-ecosystem':
      return ', LivingKnowledgeEcosystem, AttentionTokenSystem, DPOInterface';
    default:
      return '';
  }
}

function generateReadme(projectName, projectType, useTypeScript) {
  return `# ${projectName}

> Universal Life Protocol ${projectType} application

## 🚀 Quick Start

\`\`\`bash
npm install
${useTypeScript ? 'npm run dev' : 'npm start'}
\`\`\`

## 📦 Built With

- **Universal Life Protocol v2.0** - Living, conscious digital reality framework
${useTypeScript ? '- **TypeScript** - Type-safe development' : ''}

## 🌟 Features

This ${projectType} application demonstrates:

${getFeaturesList(projectType)}

## 🎯 Development

### Available Scripts

- \`npm start\` - Run the application
${useTypeScript ? '- `npm run dev` - Run in development mode with hot reload\n- `npm run build` - Build for production' : ''}
- \`npm test\` - Run tests (add your own!)

### Project Structure

\`\`\`
${projectName}/
├── ${useTypeScript ? 'index.ts' : 'index.js'}           # Main application entry
├── package.json        # Dependencies and scripts
${useTypeScript ? '├── tsconfig.json       # TypeScript configuration\n' : ''}├── README.md          # This file
└── .gitignore         # Git ignore patterns
\`\`\`

## 📚 Learn More

- **[Universal Life Protocol](https://github.com/universallifeprotocol/UniversalLifeProtocol)** - Main repository
- **[API Reference](https://github.com/universallifeprotocol/UniversalLifeProtocol/blob/main/API_REFERENCE.md)** - Complete API documentation
- **[Getting Started](https://github.com/universallifeprotocol/UniversalLifeProtocol/blob/main/GETTING_STARTED.md)** - Comprehensive guide

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

ISC License - Open source and commercially friendly.

---

**🌌 Built with Universal Life Protocol - Where information truly lives! 🌌**
`;
}

function getFeaturesList(type) {
  switch (type) {
    case 'consciousness':
      return `- 🧠 Meta-cognitive AI reasoning
- 🔷 Fano Plane geometric logic
- 📐 4D→1D epistemic compression
- 🌀 Conscious domain selection`;
    
    case 'living-knowledge':
      return `- 🌱 Information with survival instincts
- 🔄 Conway's Game of Life for knowledge
- 💰 Attention token generation
- 📊 Ecosystem evolution tracking`;
    
    case 'dpo-trading':
      return `- 💎 Knowledge-backed attention tokens
- 📊 Decentralized trading marketplace
- 👥 Multi-user wallet management
- 🏛️ Token-weighted governance voting`;
    
    case 'full-ecosystem':
      return `- 🌱 Living knowledge with survival instincts
- 💎 Knowledge-backed cryptocurrency
- 📊 Decentralized trading marketplace
- 🏛️ Conscious governance system
- 🔄 Self-healing information networks`;
    
    default:
      return `- 🌌 Universal Life Protocol integration
- 🎯 Custom application logic
- ⚡ Production-ready foundation`;
  }
}

// Start the generator
generateProject();