const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUST_PROJECT_DIR = path.join(__dirname, '..', 'rust-wasix');
const WASM_OUTPUT_DIR = path.join(__dirname, '..', 'wasix-modules');

if (!fs.existsSync(WASM_OUTPUT_DIR)) {
  fs.mkdirSync(WASM_OUTPUT_DIR, { recursive: true });
}

console.log("Building Rust project...");
execSync('cargo wasix build --release', {
  cwd: RUST_PROJECT_DIR,
  stdio: 'inherit'
});

// Locate the WASM file
const sourceDir = path.join(RUST_PROJECT_DIR, 'target', 'wasm32-wasmer-wasi', 'release');
const wasmFiles = fs.readdirSync(sourceDir)
  .filter(file => file.endsWith('.wasm') && !file.includes('.rustc.') && !file.includes('.wasi.'));

if (wasmFiles.length === 0) {
  console.error("No WASM file found in build output.");
  process.exit(1);
}

const wasmFileName = wasmFiles[0];
const wasmSourcePath = path.join(sourceDir, wasmFileName);
const wasmDestPath = path.join(WASM_OUTPUT_DIR, wasmFileName);

// Copy the WASM file to the designated output directory
fs.copyFileSync(wasmSourcePath, wasmDestPath);
console.log(`WASM file copied to ${wasmDestPath}`);
