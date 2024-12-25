import * as vscode from 'vscode';

export let typingStats = { charsTyped: 0, charsDeleted: 0 };
export let lastDocumentContent = '';

export function logCodeContext(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return 'No active editor found.';
    }

    const document = editor.document;
    const projectName = vscode.workspace.name || 'Untitled Project';
    const fileName = document.fileName.split('/').pop() || 'Untitled File';
    const functionName = getFunctionNameAtCursor(editor);

    return `Project: ${projectName}, File: ${fileName}, Function: ${functionName}, Chars Typed: ${typingStats.charsTyped}, Chars Deleted: ${typingStats.charsDeleted}`;
}

function getFunctionNameAtCursor(editor: vscode.TextEditor): string {
    const cursorPosition = editor.selection.active;
    const document = editor.document;
    const line = document.lineAt(cursorPosition.line).text;

    // Enhanced regex to detect JSX/TSX functions
    const functionRegex = /function\s+(\w+)\s*\(|const\s+(\w+)\s*=\s*\(|let\s+(\w+)\s*=\s*\(|class\s+(\w+)|export\s+default\s+function\s+(\w+)|export\s+function\s+(\w+)/;
    const match = line.match(functionRegex);

    if (match) {
        return match[1] || match[2] || match[3] || match[4] || match[5] || match[6] || 'Unknown Function';
    }

    return 'Unknown Function';
}