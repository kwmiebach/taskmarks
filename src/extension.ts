'use strict';

import * as vscode from 'vscode';

import { Helper } from './Helper';
import { debLog, DebLog } from './DebLog';

const className = 'extension.ts';
function log(methodName: string, text: string) {
  debLog(className, methodName, text);
}

export function activate(context: vscode.ExtensionContext) {
  const blackList = [];
  // blackList.push('extension.ts');
  // blackList.push('File');
  // blackList.push('Mark');
  // blackList.push('Persist');
  // blackList.push('Task');
  // blackList.push('Tasks');
  // blackList.push('Helper');

  // DebLog.initLogfile('C:\\_work\\log\\debLog.txt', false, blackList);
  // log('activate', 'Start Taskmarks');

  Helper.init(context);

  let selectMarkFromListDisposable = vscode.commands.registerCommand('taskmark.selectMarkFromList', () => {
    Helper.selectMarkFromList();
  });
  context.subscriptions.push(selectMarkFromListDisposable);

  let selectTaskDisposable = vscode.commands.registerCommand('taskmark.selectTask', () => {
    Helper.selectTask();
  });
  context.subscriptions.push(selectTaskDisposable);

  let createTaskDisposable = vscode.commands.registerCommand('taskmark.createTask', () => {
    Helper.createTask();
  });
  context.subscriptions.push(createTaskDisposable);

  let toggleMarkDisposable = vscode.commands.registerCommand('taskmark.toggleMark', () => {
    Helper.toggleMark();
  });
  context.subscriptions.push(toggleMarkDisposable);

  let nextMarkDisposable = vscode.commands.registerCommand('taskmark.nextMark', () => {
    Helper.nextMark();
  });
  context.subscriptions.push(nextMarkDisposable);

  let previousMarkDisposable = vscode.commands.registerCommand('taskmark.previousMark', () => {
    Helper.previousMark();
  });
  context.subscriptions.push(previousMarkDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}