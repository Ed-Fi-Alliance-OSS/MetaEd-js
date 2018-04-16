// @flow

declare var Disposable: any;

declare module 'atom' {
  declare class CompositeDisposable {
    add(entry: Disposable): void;
    dispose(): void;
  }
  declare type NotificationType = 'success' | 'info' | 'warning' | 'error' | 'fatalerror';

  declare class Notification {
    constructor(type: NotificationType, message: string, options: Object): Notification;
    options: Object;
    onDidDisplay: any;
    getMessage(): string;
    getType(): NotificationType;
    dismiss(): void;
  }
}

declare class AtomCommandRegistry {
  add(target: string, commandName: string, callback: (domNode: any) => void): Disposable;
  add(target: string, commandRegistration: any): Disposable;
}

declare class AtomConfig {
  get(keyPath: string): string & boolean;
  set(keyPath: string, value: string | boolean): void;
  observe(keyPath: string, callback: (value: string) => void): Disposable;
  onDidChange(keyPath: string, callback: (value: string) => void): Disposable;
  unset(keyPath: string): void;
}

declare class AtomPackage {
  mainModule: any;
  path: string;
  name: string;
  metadata: any;
}

declare class AtomNotificationManager {
  addWarning(message: string, options: any): any;
  addInfo(message: string, options: any): any;
  addError(message: string, options: any): any;
  addNotification(notification: any): void;
}

declare class AtomPackageManager {
  activatePackage(name: string): Promise<AtomPackage>;
  isPackageLoaded(name: string): boolean;
  getActivePackages(): Array<AtomPackage>;
}

declare class AtomProject {
  addPath(projectPath: string): void;
  getPaths(): string[];
  setPaths(projectPaths: string[]): void;
  getDirectories(): AtomDirectory[];
  onDidChangePaths(callback: (projectPaths: Array<string>) => void): Disposable;
}

declare class AtomDirectory {
  getFile(filename: string): any;
}

declare class AtomTextEditor {
  getBuffer(): any;
  getPath(): string;
  getText(): string;
  isModified(): boolean;
}

declare class AtomWorkspace {
  open(url: string): AtomTextEditor;
  addOpener((string) => any): Disposable;
  getActiveTextEditor(): AtomTextEditor;
  getTextEditors(): AtomTextEditor[];
  observeTextEditors(callback: (editor: AtomTextEditor) => void): Disposable;
  getPanes(): any[];
}

declare class AtomClipboard {
  write(thing: any): void;
}

declare class AtomViews {
  addViewProvider(model: any, view: any): Disposable;
  getView(view: any): void;
}

declare class AtomEnvironment {
  clipboard: AtomClipboard;
  commands: AtomCommandRegistry;
  config: AtomConfig;
  contextMenu: any;
  notifications: AtomNotificationManager;
  packages: AtomPackageManager;
  project: AtomProject;
  views: AtomViews;
  workspace: AtomWorkspace;
  confirm(params: any): number;
  pickFolder(callback: (paths: string[]) => void): void;
  onDidThrowError(callback: any): void;
  onDidFailAssertion(callback: any): void;
  onWillThrowError(callback: any): void;
  inDevMode(): boolean;
  getLoadSettings(): any;
  getVersion(): string;
}

declare var atom: AtomEnvironment;
