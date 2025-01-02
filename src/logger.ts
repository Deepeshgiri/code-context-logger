import * as vscode from 'vscode';
import { languageRules } from './languageRules'; // Import language rules

export let typingStats: { [fileName: string]: { charsTyped: number; charsDeleted: number; wordsAdded: number; wordsDeleted: number; lastContent: string } } = {};

export function logCodeContext(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return 'No active editor found.';
    }

    const document = editor.document;
    const fileName = document.fileName;
    const stats = typingStats[fileName] || { charsTyped: 0, charsDeleted: 0, wordsAdded: 0, wordsDeleted: 0, lastContent: '' };
    const functionName = getFunctionNameAtCursor(editor);
    const projectName = vscode.workspace.name || 'Untitled Project';

    return `Project: ${projectName}, File: ${fileName.split('/').pop() || 'Untitled File'}, Function: ${functionName}, 
    Chars Typed: ${stats.charsTyped}, Chars Deleted: ${stats.charsDeleted}, Words Added: ${stats.wordsAdded}, Words Deleted: ${stats.wordsDeleted} , Date: ${new Date().toLocaleString()}`;
}

function getFunctionNameAtCursor(editor: vscode.TextEditor): string {
    const cursorPosition = editor.selection.active;
    const document = editor.document;
    const language = document.languageId;
    const line = document.lineAt(cursorPosition.line).text;

    // Get rules for the current language or use generic rules
    const rules = languageRules[language] || languageRules.generic;

    // Check for matches in the line and surrounding lines for context
    const searchRange = [
        line,
        cursorPosition.line > 0 ? document.lineAt(cursorPosition.line - 1).text : '',
        cursorPosition.line < document.lineCount - 1 ? document.lineAt(cursorPosition.line + 1).text : ''
    ];

    for (const contextLine of searchRange) {
        for (const [type, regexPattern] of Object.entries(rules)) {
            const regex = new RegExp(regexPattern as string);
            const match = contextLine.match(regex);

            if (match) {
                return `${type}: ${match.slice(1).find(group => group !== undefined) || `Unnamed ${type}`}`;
            }
        }
    }

    // If no match is found, fall back to document analysis
    return analyzeSurroundingContent(document, cursorPosition) || 'Unknown Function/Class';
}

// Analyze the surrounding content in the document
function analyzeSurroundingContent(document: vscode.TextDocument, position: vscode.Position): string | null {
    const linesToCheck = 10; // Number of lines to check upwards for context
    for (let i = Math.max(0, position.line - linesToCheck); i < position.line; i++) {
        const lineText = document.lineAt(i).text.trim();

        for (const [type, regexPattern] of Object.entries(languageRules.generic)) {
            const regex = new RegExp(regexPattern as string);
            const match = lineText.match(regex);

            if (match) {
                return `${type}: ${match.slice(1).find(group => group !== undefined) || `Unnamed ${type}`}`;
            }
        }
    }
    return null;
}

// Track changes in the document
vscode.workspace.onDidChangeTextDocument(event => {
    const document = event.document;
    const fileName = document.fileName;
    const newContent = document.getText();
    const stats = typingStats[fileName] || { charsTyped: 0, charsDeleted: 0, wordsAdded: 0, wordsDeleted: 0, lastContent: '' };

    // Use contentChanges for precise edits
    let charsTyped = 0;
    let charsDeleted = 0;
    let wordsAdded = 0;
    let wordsDeleted = 0;

    event.contentChanges.forEach(change => {
        const newWords = change.text.split(/\s+/).filter(w => w.length);
        const oldWords = (stats.lastContent || '').slice(change.rangeOffset, change.rangeOffset + change.rangeLength).split(/\s+/).filter(w => w.length);

        charsTyped += Math.max(0, change.text.length - change.rangeLength);
        charsDeleted += Math.max(0, change.rangeLength - change.text.length);

        wordsAdded += Math.max(0, newWords.length - oldWords.length);
        wordsDeleted += Math.max(0, oldWords.length - newWords.length);
    });

    // Update stats
    stats.charsTyped += charsTyped;
    stats.charsDeleted += charsDeleted;
    stats.wordsAdded += wordsAdded;
    stats.wordsDeleted += wordsDeleted;
    stats.lastContent = newContent;

    typingStats[fileName] = stats;
});

// Initialize stats when a document is opened
vscode.workspace.onDidOpenTextDocument(document => {
    const fileName = document.fileName;
    typingStats[fileName] = {
        charsTyped: 0,
        charsDeleted: 0,
        wordsAdded: 0,
        wordsDeleted: 0,
        lastContent: document.getText(),
    };
});

// Reset stats when a document is closed
vscode.workspace.onDidCloseTextDocument(document => {
    const fileName = document.fileName;
    delete typingStats[fileName];
});
