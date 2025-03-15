const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUST_PROJECT_DIR = path.join(__dirname, '..', 'rust-wasi');
const WASM_OUTPUT_DIR = path.join(__dirname, '..', 'wasi_modules');

if (!fs.existsSync(WASM_OUTPUT_DIR)) {
  fs.mkdirSync(WASM_OUTPUT_DIR, { recursive: true });
}

execSync('cargo +nightly build --target wasm32-wasip2', {
  cwd: RUST_PROJECT_DIR,
  stdio: 'inherit'
});

const WASM_FILE_PATH = path.join(
  RUST_PROJECT_DIR,
  'target',
  'wasm32-wasip2',
  'debug',
  'rust_wasi.wasm'
);

execSync(
  `jco transpile ${WASM_FILE_PATH} -o wasi_modules`
);

fs.renameSync("wasi_modules/rust_wasi.js", "wasi_modules/rust_wasi.mjs")
fs.renameSync("wasi_modules/rust_wasi.d.ts", "wasi_modules/rust_wasi.d.mts")
