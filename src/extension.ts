import * as vscode from 'vscode';

export async function activate(_context: vscode.ExtensionContext) {
	// The webpackIgnore: true comment is necessary here; otherwise WebPack generates code that uses require which does not work
	// when loading an ESM module (the WASI module) from a CommonJS module (this module)
	const wasiModule = await import(/* webpackIgnore: true */ '../wasi_modules/rust_wasi.mjs');
	const result = wasiModule.hello();

	const outputChannel = vscode.window.createOutputChannel('WASI Output');
	outputChannel.appendLine(`Result: ${result}`);
	outputChannel.show();
}

export function deactivate() { }
