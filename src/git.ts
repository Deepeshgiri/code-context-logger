import * as vscode from 'vscode';
import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as fs from 'fs';

let git: SimpleGit;
let repoPath: string | undefined;

export async function setupGitRepo(outputChannel: vscode.OutputChannel) {
    const folderUri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        title: 'Select the folder for the GitHub repository',
    });

    if (!folderUri || folderUri.length === 0) {
        vscode.window.showErrorMessage('No folder selected. GitHub integration skipped.');
        return;
    }

    repoPath = folderUri[0].fsPath;
    git = simpleGit(repoPath);

    try {
        // Check if the folder is a Git repository
        await git.status();
        outputChannel.appendLine('GitHub repository setup successfully.');
    } catch (error) {
        vscode.window.showErrorMessage('The selected folder is not a Git repository.');
        return;
    }

    // Initialize the HTML file if it doesn't exist
    const htmlFilePath = path.join(repoPath, 'logs.html');
    if (!fs.existsSync(htmlFilePath)) {
        fs.writeFileSync(htmlFilePath, getInitialHtml());
        outputChannel.appendLine('Initialized logs.html file.');
    }
}

export async function commitAndPush(outputChannel: vscode.OutputChannel, logMessage: string) {
    if (!repoPath || !git) {
        vscode.window.showErrorMessage('GitHub repository not set up.');
        return;
    }

    const htmlFilePath = path.join(repoPath, 'logs.html');

    // Read the existing HTML file
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

    // Append the new log row to the table body
    const newRow = `<tr><td>${logMessage}</td></tr>`;
    const tableId = 'code-context-logs-table';
    const tableBodyRegex = new RegExp(`<tbody[^>]*id="${tableId}"[^>]*>([\\s\\S]*?)<\/tbody>`);

    if (tableBodyRegex.test(htmlContent)) {
        htmlContent = htmlContent.replace(tableBodyRegex, (match, p1) => {
            return `<tbody id="${tableId}">${newRow}\n${p1}</tbody>`;
        });
    } else {
        outputChannel.appendLine('Table with id "code-context-logs-table" not found in logs.html. Unable to append log.');
        return;
    }

    // Write the updated HTML file
    fs.writeFileSync(htmlFilePath, htmlContent);

    try {
        // Commit and push changes
        await git.add(htmlFilePath);
        await git.commit('Update logs.html with latest logs');
        await git.push();
        outputChannel.appendLine('Logs pushed to GitHub successfully.');
    } catch (error) {
        outputChannel.appendLine(`Failed to push logs to GitHub: ${error}`);
    }
}

let autoCommitIntervalId: NodeJS.Timeout | undefined;

export function startAutoCommit(outputChannel: vscode.OutputChannel, logMessage: string) {
    if (autoCommitIntervalId) {
        vscode.window.showInformationMessage('Auto-commit is already running.');
        return;
    }

    autoCommitIntervalId = setInterval(async () => {
        await commitAndPush(outputChannel, logMessage);
    }, 60000); // 1 hour in milliseconds

    vscode.window.showInformationMessage('Auto-commit started. Logs will be pushed every hour.');
}

export function stopAutoCommit(outputChannel: vscode.OutputChannel) {
    if (autoCommitIntervalId) {
        clearInterval(autoCommitIntervalId);
        autoCommitIntervalId = undefined;
        vscode.window.showInformationMessage('Auto-commit stopped.');
    }
}

function getInitialHtml(): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Code Context Logs</title>
            <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>Code Context Logs</h1>
            <table>
                <thead>
                    <tr><th>Log Entry</th></tr>
                </thead>
                <tbody id="code-context-logs-table">
                    <!-- LOGS -->
                </tbody>
            </table>
        </body>
        </html>
    `;
}