import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log("Template activated");
	
	context.subscriptions.push(
		vscode.commands.registerCommand('template.helloWorld', () => vscode.window.showInformationMessage(vscode.l10n.t('Hello')))
	);
}

export function deactivate() { 
	console.log("Template deactivated");
}
