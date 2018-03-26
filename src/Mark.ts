'use strict';

import * as vscode from 'vscode';

import { Helper } from './Helper';
import { File } from './File';

export class Mark {
  private _isDirty: boolean;
  private _parent: File;
  private _lineNumber: number | undefined;
  private _quickPickItem: vscode.QuickPickItem | undefined;
  private _dirtyLineNumber: number | undefined;
  private _dirtyQuickPickItem: vscode.QuickPickItem | undefined;

  public get quickPickItem(): vscode.QuickPickItem | undefined {
    if (this._isDirty) {
      return this._dirtyQuickPickItem;
    }
    return this._quickPickItem;
  }

  public get lineNumberForPersist(): number | undefined {
    return this._lineNumber;
  }

  public get lineNumber(): number | undefined {
    if (this._isDirty) {
      return this._dirtyLineNumber;
    }
    return this._lineNumber;
  }

  public set lineNumber(lineNumber: number | undefined) {
    this._isDirty = true;
    this.setLineNumber(lineNumber);
  }

  public constructor(parent: File, lineNumber: number, dirty = true) {
    this._isDirty = dirty;
    this._parent = parent;
    this.setLineNumber(lineNumber);
  }

  private setLineNumber(lineNumber: number | undefined) {
    if (this._isDirty) {
      this._dirtyLineNumber = lineNumber;
    } else {
      this._lineNumber = lineNumber;
    }

    Helper.getQuickPickItem(this._parent.filepath, lineNumber)
      .then(value => {
        this._quickPickItem = value;
      })
      .catch(reason => console.log('error : ' + reason));
  }

  public unDirty() {
    if (this._isDirty) {
      this._quickPickItem = this._dirtyQuickPickItem;
      this._dirtyQuickPickItem = undefined;

      this._lineNumber = this._dirtyLineNumber;
      this._dirtyLineNumber = undefined;

      this._isDirty = false;
    }
  }
}
