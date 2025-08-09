#!/usr/bin/env node

/**
 * Universal Life Protocol - Release Manager
 * 
 * Handles versioning, building, and publishing of all ULP packages.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packages = [
  { name: '@universal-life-protocol/core', dir: '.' },
  { name: '@universal-life-protocol/consciousness', dir: 'packages/consciousness' },
  { name: '@universal-life-protocol/living-knowledge', dir: 'packages/living-knowledge' },
  { name: '@universal-life-protocol/starter-templates', dir: 'packages/starter-templates' }
];

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const version = args[1];

  switch (command) {
    case 'version':
      updateVersions(version);
      break;
    case 'build':
      buildPackages();
      break;
    case 'test':
      testPackages();
      break;
    case 'publish':
      publishPackages(args.includes('--beta'));
      break;
    case 'release':
      fullRelease(version, args.includes('--beta'));
      break;
    default:
      showHelp();
  }
}

function showHelp() {
  console.log('🌌 Universal Life Protocol - Release Manager\\n');
  console.log('Commands:');
  console.log('  version <version>     Update version numbers');
  console.log('  build                 Build all packages');
  console.log('  test                  Test all packages');
  console.log('  publish [--beta]      Publish to npm');
  console.log('  release <version>     Complete release process\\n');
  console.log('Examples:');
  console.log('  node release.js version 2.0.1');
  console.log('  node release.js release 2.1.0 --beta');
  console.log('  node release.js publish');
}

function updateVersions(newVersion) {
  if (!newVersion) {
    console.error('❌ Version required');
    return;
  }

  console.log(\`🔄 Updating versions to \${newVersion}...\\n\`);

  for (const pkg of packages) {
    const packageJsonPath = path.join(pkg.dir, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.version = newVersion;
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(\`✅ Updated \${pkg.name} to \${newVersion}\`);
    }
  }

  console.log('\\n✅ All versions updated!');
}

function buildPackages() {
  console.log('🔨 Building all packages...\\n');

  try {
    // Build core package
    console.log('📦 Building core package...');
    execSync('npm run build:package', { stdio: 'inherit' });
    
    console.log('\\n✅ All packages built successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

function testPackages() {
  console.log('🧪 Testing all packages...\\n');

  try {
    // Run core tests
    console.log('🧪 Testing core systems...');
    execSync('npm run test', { stdio: 'inherit' });
    
    console.log('\\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Tests failed:', error.message);
    process.exit(1);
  }
}

function publishPackages(isBeta = false) {
  const tag = isBeta ? '--tag beta' : '';
  console.log(\`📦 Publishing packages\${isBeta ? ' (beta)' : ''}...\\n\`);

  try {
    // Publish core package first (others depend on it)
    console.log('📦 Publishing @universal-life-protocol/core...');
    execSync(\`npm publish ./dist \${tag}\`, { stdio: 'inherit' });
    
    // Publish other packages
    for (const pkg of packages.slice(1)) {
      if (fs.existsSync(pkg.dir)) {
        console.log(\`📦 Publishing \${pkg.name}...\`);
        try {
          execSync(\`cd \${pkg.dir} && npm publish \${tag}\`, { stdio: 'inherit' });
        } catch (error) {
          console.warn(\`⚠️  Could not publish \${pkg.name}:, error.message\`);
        }
      }
    }
    
    console.log('\\n✅ All packages published!');
  } catch (error) {
    console.error('❌ Publishing failed:', error.message);
    process.exit(1);
  }
}

function fullRelease(version, isBeta = false) {
  if (!version) {
    console.error('❌ Version required for release');
    return;
  }

  console.log(\`🚀 Starting full release process for v\${version}\${isBeta ? '-beta' : ''}...\\n\`);

  try {
    // Update versions
    updateVersions(isBeta ? \`\${version}-beta.1\` : version);
    
    // Run tests
    testPackages();
    
    // Build packages
    buildPackages();
    
    // Create git tag
    const tagName = \`v\${isBeta ? version + '-beta.1' : version}\`;
    console.log(\`🏷️  Creating git tag: \${tagName}\`);
    execSync(\`git add -A\`);
    execSync(\`git commit -m "Release \${tagName}"\`);
    execSync(\`git tag \${tagName}\`);
    
    // Publish to npm
    publishPackages(isBeta);
    
    // Push to GitHub
    console.log('📤 Pushing to GitHub...');
    execSync('git push origin main --tags');
    
    console.log(\`\\n🎉 Release \${tagName} completed successfully!\`);
    console.log('\\n📋 Next steps:');
    console.log('  • Update CHANGELOG.md');
    console.log('  • Create GitHub release with release notes');
    console.log('  • Announce on social media');
    console.log('  • Update documentation');
    
  } catch (error) {
    console.error('❌ Release failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}