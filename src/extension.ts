import * as vscode from 'vscode';
import { setupGitRepo, commitAndPush, startAutoCommit, stopAutoCommit } from './git';
import { logCodeContext } from './logger';

let intervalId: NodeJS.Timeout | undefined;
let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "code-context-logger" is now active!');

    // Initialize output channel
    outputChannel = vscode.window.createOutputChannel('Code Context Logger');

    // Register the start logging command
    let startCommand = vscode.commands.registerCommand('code-context-logger.startLogging', () => {
        if (intervalId) {
            outputChannel.appendLine('Logging is already active.');
            return;
        }

        outputChannel.clear();
        outputChannel.show(true);
        outputChannel.appendLine('Code context logging started.');

        // Start logging every 5 seconds
        intervalId = setInterval(() => {
            const logMessage = logCodeContext();
            outputChannel.appendLine(logMessage);
            commitAndPush(outputChannel, logMessage);
        }, 5000);
    });

    // Register the stop logging command
    let stopCommand = vscode.commands.registerCommand('code-context-logger.stopLogging', () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
            outputChannel.appendLine('Code context logging stopped.');
            vscode.window.showInformationMessage('Code context logging stopped.');
        } else {
            outputChannel.appendLine('Logging is not active.');
        }
    });

    // Register the setup GitHub command
    let setupGitCommand = vscode.commands.registerCommand('code-context-logger.setupGit', async () => {
        await setupGitRepo(outputChannel);
    });

    // Register the start auto-commit command
    let startAutoCommitCommand = vscode.commands.registerCommand('code-context-logger.startAutoCommit', () => {
        startAutoCommit(outputChannel, logCodeContext());
    });

    // Register the stop auto-commit command
    let stopAutoCommitCommand = vscode.commands.registerCommand('code-context-logger.stopAutoCommit', () => {
        stopAutoCommit(outputChannel);
    });

    context.subscriptions.push(
        startCommand,
        stopCommand,
        setupGitCommand,
        startAutoCommitCommand,
        stopAutoCommitCommand
    );
}

export function deactivate() {
    if (intervalId) {
        clearInterval(intervalId);
    }
}