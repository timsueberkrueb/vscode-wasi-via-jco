/** @type {import('@vscode/test-cli').TestConfiguration} */
module.exports = {
  files: 'out/test/**/*.test.js',
  workspaceFolder: '.',
  mocha: {
    ui: 'tdd',
    timeout: 20000
  }
};