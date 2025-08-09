#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const files = [
  'dist/index.js',
  'dist/libs/mcp-bridge/ulp-mcp-server.js',
  'dist/libs/mcp-bridge/personality-profiling-mcp.js',
  'dist/libs/cue-protocols/living-knowledge.js',
  'dist/consciousness.js',
  'dist/living-knowledge.js'
];

for (const file of files) {
  const src = path.resolve(file);
  const dst = src.replace(/\.js$/, '.mjs');
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
      console.log(`Copied ${path.relative(process.cwd(), src)} -> ${path.relative(process.cwd(), dst)}`);
    }
  } catch (e) {
    console.warn(`Warn: failed to copy ${src} to ${dst}:`, e.message);
  }
}
console.log('Package build post-step complete.');
