const ts = require('typescript');
const fs = require('fs');
const path = require('path');

// Source and output directories
const srcDir = path.join(process.cwd(), 'src');
const distDir = path.join(process.cwd(), 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// TypeScript compiler options that ignore type checking
const compilerOptions = {
  target: ts.ScriptTarget.ES2018,
  module: ts.ModuleKind.CommonJS,
  esModuleInterop: true,
  skipLibCheck: true,
  skipDefaultLibCheck: true,
  noEmitOnError: false,
  resolveJsonModule: true,
  outDir: distDir,
};

// Function to copy non-TypeScript files
function copyNonTsFiles(directory, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  entries.forEach(entry => {
    const sourcePath = path.join(directory, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    
    if (entry.isDirectory()) {
      copyNonTsFiles(sourcePath, targetPath);
    } else if (!entry.name.endsWith('.ts')) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${sourcePath} -> ${targetPath}`);
    }
  });
}

// Function to recursively get all TypeScript files
function getAllTsFiles(directory, files = []) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      getAllTsFiles(fullPath, files);
    } else if (entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  });
  
  return files;
}

// Transpile a single file
function transpileFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(srcDir, filePath);
  const outputPath = path.join(distDir, relativePath.replace('.ts', '.js'));
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Transpile the file
  const { outputText } = ts.transpileModule(fileContent, {
    compilerOptions,
    fileName: filePath,
  });
  
  // Write transpiled code to output file
  fs.writeFileSync(outputPath, outputText);
  console.log(`Transpiled: ${filePath} -> ${outputPath}`);
}

console.log('Starting TypeScript transpilation without type checking...');

// Copy non-TypeScript files
console.log('Copying non-TypeScript files...');
copyNonTsFiles(srcDir, distDir);

// Transpile all TypeScript files
console.log('Transpiling TypeScript files...');
const tsFiles = getAllTsFiles(srcDir);
tsFiles.forEach(transpileFile);

console.log(`Successfully transpiled ${tsFiles.length} TypeScript files to ${distDir}`); 