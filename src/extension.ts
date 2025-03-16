import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { init, runWasix } from '@wasmer/sdk/node';

export async function activate(context: vscode.ExtensionContext) {
	const wasmPath = path.join(context.extensionPath, 'wasix-modules/vscode-wasix.wasm');
	const wasmBytes = fs.readFileSync(wasmPath);
	let module = await WebAssembly.compile(wasmBytes);

	await init();

	const instance = await runWasix(module, {});
	vscode.window.showErrorMessage("It hangs right here");
	const { ok, code, stdout, stderr } = await instance.wait();
	vscode.window.showErrorMessage("after instance.wait()");

	const outputChannel = vscode.window.createOutputChannel('WASIX Output');
	outputChannel.appendLine(stdout || '(No output)');
	outputChannel.show();
}

export function deactivate() { }
