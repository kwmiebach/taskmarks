'use strict';

import * as _ from 'lodash';

import { ITasks } from './Models';
import { Task } from './Task';
import { DebLog } from './DebLog';
import { DecoratorHelper } from './DecoratorHelper';

export class Tasks extends DebLog implements ITasks {
  private static _instance: Tasks;

  public static instance(): Tasks {
    if (!this._instance) {
      this._instance = new Tasks();
    }

    return this._instance;
  }

  private _allTasks: Array<Task>;
  private _activeTask: Task;

  public get allTasks(): Array<Task> {
    return this._allTasks;
  }

  public get activeTask(): Task {
    return this._activeTask;
  }

  public set activeTask(task: Task) {
    this._activeTask = task;
  }

  private constructor() {
    super();
    this._allTasks = [];
    this._activeTask = this.use('default');
  }

  public setActiveTask(taskname: string) {
    let activeTask = _.find(this._allTasks, task => task.name === taskname);
    if (activeTask) {
      this._activeTask = activeTask;
    }
  }

  public addTask(task: Task) {
    this.ind('addTask', 'with task.name === ' + task.name);
    let current = this.use(task.name);

    current.mergeWith(task);
    this.out();
  }

  public use(taskname: string): Task {
    let task = _.find(this._allTasks, task => task.name === taskname);

    if (!task) {
      task = new Task(taskname);

      this._allTasks.push(task);
    }
    this._activeTask = task;

    return task;
  }

  public nextMark(activeFile: string, currentline: number) {
    let activeTask = this.activeTask;
    if (!activeTask || !activeTask.files || activeTask.files.length === 0) {
      return;
    }

    if (!activeTask.activeFile) {
      return;
    }
    for (let mark of activeTask.activeFile.marks) {
      if (mark > currentline) {
        DecoratorHelper.showLine(mark);
        return;
      }
    }

    this.nextDocument();
  }

  public previousMark(activeFile: string, currentline: number) {
    let activeTask = this.activeTask;
    if (!activeTask || !activeTask.files || activeTask.files.length === 0) {
      return;
    }

    if (!activeTask.activeFile) {
      return;
    }
    for (let index = activeTask.activeFile.marks.length - 1; index > -1; index--) {
      const mark = activeTask.activeFile.marks[index];

      if (mark < currentline) {
        DecoratorHelper.showLine(mark);
        return;
      }
    }

    this.previousDocument();
  }

  public nextDocument() {
    if (!this.activeTask || this.activeTask.files.length === 0) {
      return;
    }

    let currentFile = this.activeTask.activeFile;
    let nextFile = this.activeTask.files.next;
    while (currentFile !== nextFile) {
      if (nextFile.marks.length > 0) {
        currentFile = nextFile;
      } else {
        nextFile = this.activeTask.files.next;
      }
    }
    DecoratorHelper.openAndShow(currentFile.filepath, currentFile.marks[0]);
  }

  public previousDocument() {
    if (!this.activeTask || this.activeTask.files.length === 0) {
      return;
    }

    let currentFile = this.activeTask.activeFile;
    let previousFile = this.activeTask.files.previous;
    while (currentFile !== previousFile) {
      if (previousFile.marks.length > 0) {
        currentFile = previousFile;
      } else {
        previousFile = this.activeTask.files.next;
      }
    }
    DecoratorHelper.openAndShow(currentFile.filepath, currentFile.marks[0]);
  }

  public get taskNames(): Array<string> {
    let taskNames: Array<string> = [];

    this._allTasks.forEach(task => {
      taskNames.push(task.name);
    });

    return taskNames;
  }
}
