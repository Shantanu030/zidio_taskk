const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Building TypeScript code without type checking...');

// Create dist directory if it doesn't exist
if (!fs.existsSync(path.join(process.cwd(), 'dist'))) {
  fs.mkdirSync(path.join(process.cwd(), 'dist'), { recursive: true });
}

try {
  // Use ts-node with --transpile-only flag to bypass type checking
  console.log('Transpiling TypeScript to JavaScript...');
  execSync('npx ttsc --project tsconfig.json', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Error during ttsc build, falling back to simple transpilation');
  
  try {
    console.log('Using ts-node transpile-only as fallback...');
    // Use the simplest possible transpilation
    execSync('npx ts-node --transpile-only scripts/transpile.js', { stdio: 'inherit' });
    console.log('Fallback build completed!');
  } catch (fallbackError) {
    console.error('All build attempts failed:', fallbackError);
    process.exit(1);
  }
}