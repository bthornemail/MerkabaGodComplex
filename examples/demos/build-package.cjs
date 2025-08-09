#!/usr/bin/env node

/**
 * Universal Life Protocol - Package Builder
 * 
 * This script compiles the ULP packages for distribution on npm.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Universal Life Protocol package...\n');

// Ensure dist directory exists
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist', { recursive: true });
}

// Copy demo files to dist
const demoFiles = [
  'demo-complete-system.js',
  'test-consciousness-system.js',
  'walkthrough-demo.js'
];

console.log('📦 Copying demo files...');
for (const file of demoFiles) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('./dist', file));
    console.log(`   ✓ ${file}`);
  }
}

// Create ESM versions by converting require() to import
console.log('\n🔄 Creating ESM versions...');

const createESMVersion = (filename) => {
  const jsFile = `./dist/${filename}`;
  const mjsFile = `./dist/${filename.replace('.js', '.mjs')}`;
  
  if (fs.existsSync(jsFile)) {
    let content = fs.readFileSync(jsFile, 'utf8');
    
    // Basic CommonJS to ESM conversion
    content = content
      .replace(/module\.exports\s*=\s*/g, 'export default ')
      .replace(/exports\.(\w+)\s*=/g, 'export const $1 =')
      .replace(/require\(['"]([^'"]+)['"]\)/g, "import '$1'");
    
    fs.writeFileSync(mjsFile, content);
    console.log(`   ✓ ${mjsFile}`);
  }
};

// Convert main exports to ESM
const jsFiles = fs.readdirSync('./dist').filter(f => f.endsWith('.js'));
for (const file of jsFiles) {
  createESMVersion(file);
}

// Create package info
console.log('\n📋 Creating package manifest...');

// Load version/name from root package.json to keep them in sync
const rootPkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const packageInfo = {
  name: '@universal-life-protocol/core',
  version: rootPkg.version,
  description: rootPkg.description || 'Universal Life Protocol - core',
  license: rootPkg.license || 'MIT',
  type: 'module',
  // Dual entry points: adjust paths to match your actual build output
  main: './index.cjs',            // CommonJS fallback
  module: './index.mjs',          // ESM (legacy field)
  types: './index.d.ts',          // Type definitions
  exports: {
    '.': {
      import: './index.mjs',
      require: './index.cjs',
      types: './index.d.ts',
      default: './index.mjs'
    }
  },
  files: [
    '*.cjs',
    '*.mjs',
    '*.js',
    '*.d.ts',
    'consciousness.*',
    'living-knowledge.*',
    'README.md',
    'ANNOUNCEMENT.md',
    'LICENSE'
  ],
  engines: rootPkg.engines || { node: '>=18' },
  repository: {
    type: 'git',
    url: 'https://github.com/universallifeprotocol/UniversalLifeProtocol.git'
  },
  bugs: {
    url: 'https://github.com/universallifeprotocol/UniversalLifeProtocol/issues'
  },
  homepage: 'https://github.com/universallifeprotocol/UniversalLifeProtocol#readme',
  keywords: rootPkg.keywords || ['ulc', 'consciousness', 'living-knowledge']
};

fs.writeFileSync('./dist/package.json', JSON.stringify(packageInfo, null, 2));

// Copy essential files
console.log('\n📄 Copying documentation...');
const essentialFiles = ['README.md', 'ANNOUNCEMENT.md', 'LICENSE'];
for (const file of essentialFiles) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('./dist', file));
    console.log(`   ✓ ${file}`);
  }
}

console.log('\n✅ Universal Life Protocol package build complete!');
console.log(`📦 Package ready for publishing at: ./dist/`);
console.log(`🚀 Run 'npm publish ./dist' to publish to npm`);