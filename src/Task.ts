'use strict';

import { File } from './File';
import { Mark } from './Mark';
import { Ring } from './Ring';
import { PathHelper } from './PathHelper';

export class Task {
  private _name: string;
  private _activeFile: File | undefined;
  private _files: Ring<File>;

  constructor(name: string) {
    this._name = name;
    this._files = new Ring();
  }

  public get name(): string {
    return this._name;
  }

  public get activeFileName(): string | undefined {
    if (this._activeFile) {
      return this._activeFile.filepath;
    }
    return undefined;
  }

  public get activeFile(): File | undefined {
    return this._activeFile;
  }

  public set activeFile(file: File | undefined) {
    this._activeFile = file;
  }

  public get files(): Ring<File> {
    return this._files;
  }

  public get allMarks(): Array<Mark> {
    let marks: Array<Mark> = [];

    this._files.forEach(file => {
      marks.push(...file.allMarks);
    });
    return marks;
  }

  public mergeWith(taskToMerge: IPersistTask): Task {
    let filesToAdd: Array<IPersistFile> = [];

    taskToMerge.files.forEach(fileToMerge => {
      let file: File | undefined = this._files.find(fm => fm.filepath === fileToMerge.filepath);

      if (file) {
        file.mergeWith(fileToMerge);
      } else {
        filesToAdd.push(fileToMerge);
      }
    });
    filesToAdd.forEach(fileToAdd => {
      let file = this.use(fileToAdd.filepath);
      fileToAdd.marks.forEach(mark => file.addMark(mark));
    });
    return this;
  }

  public toggle(path: string, lineNumber: number): boolean {
    const reducedPath = PathHelper.reducePath(path);

    let file: File | undefined = this._files.find(fm => fm.filepath === reducedPath);

    if (file) {
      file.toggleTask(lineNumber);
    } else {
      file = new File(reducedPath, lineNumber);
      this._files.push(file);
    }

    return file.hasMarks();
  }

  public use(path: string): File {
    const filePath = PathHelper.reducePath(path);

    let file: File | undefined = this.getFile(filePath);

    if (!file) {
      file = new File(filePath, -1);
      this._files.push(file);
    }

    this.activeFile = file;

    return file;
  }

  public getFile(reducedFilePath: string): File | undefined {
    let fileMark: File | undefined = this._files.find(fm => fm.filepath === reducedFilePath);

    return fileMark;
  }

  public dumpToLog(indent: number): void {
    indent++;
    console.log(indent, '--------------------------');
    console.log(indent, '---------- Task ----------');
    console.log(indent, '_name - ' + this._name);
    this._files.forEach(file => {
      file.dumpToLog(indent);
    });
    console.log(indent, '');
  }
}
