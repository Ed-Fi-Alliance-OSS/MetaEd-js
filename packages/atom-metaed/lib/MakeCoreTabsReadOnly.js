/** @babel */
// @flow

import path from 'path';
import { getCoreMetaEdSourceDirectory } from './PackageSettings';

export const CONFIG_NAME: string = 'package.json';

// monkey patches a TextBuffer by removing the transact() and applyChange() function behaviors
// to simulate read only behavior in the TextBuffer
//
// this is a bit of overkill, in that pretty much all actions on a TextBuffer flow through transact(), even
// ones that don't modify the TextBuffer
function patchBuffer(buffer: any) {
  if (buffer.__hasTROPatch === true) {
    return;
  }
  const editedBuffer = buffer;
  editedBuffer.__hasTROPatch = true;
  editedBuffer.__isReadOnly = false;
  editedBuffer.__transact = buffer.transact;
  editedBuffer.__applyChange = buffer.applyChange;
  editedBuffer.setReadOnly = function setReadOnly(state: boolean) {
    if (state === false) {
      editedBuffer.__isReadOnly = false;
      editedBuffer.transact = buffer.__transact;
      editedBuffer.applyChange = buffer.__applyChange;
    } else {
      editedBuffer.__isReadOnly = true;
      editedBuffer.transact = function transact() {};
      editedBuffer.applyChange = function applyChange() {};
    }
    return this.emitter.emit('did-change-path', buffer.getPath()); // Force tab update
  };
}

// monkey patches a TextEditor by modifying the getTitle() function to add a visible indication
// when the file is to be considered read only.  Delegates to a TextBuffer monkey patch for
// actual read only behavior.
function patchEditor(editor: any) {
  if (editor.__hasTROPatch === true) {
    return patchBuffer(editor.getBuffer());
  }
  const editedEditor = editor;
  editedEditor.__hasTROPatch = true;
  editedEditor.__getTitle = editor.getTitle;
  editedEditor.__getReadOnlyTitle = function getReadOnlyTitle() {
    const left = this.getFileName();
    return `[${left != null ? left : 'undefined'}]`;
  };
  editedEditor.updateReadOnlyTitle = function updateReadOnlyTitle(state) {
    if (state === false) {
      editedEditor.getTitle = editor.__getTitle;
    } else {
      editedEditor.getTitle = editor.__getReadOnlyTitle;
    }
  };
  editedEditor.setReadOnly = function setReadOnly(state) {
    return this.getBuffer().setReadOnly(state);
  };
  patchBuffer(editor.getBuffer());
  const disp = editor.onDidChangePath(
    function onDidChangePath() {
      return this.updateReadOnlyTitle(this.getBuffer().__isReadOnly);
    }.bind(editor),
  );
  editor.onDidDestroy(() => disp.dispose());
  return editor.setReadOnly(editor.getBuffer().__isReadOnly); // Sync state with buffer
}

export function isCoreMetaEdFile(filePath: any): boolean {
  if (filePath == null) return false;
  const resolvedFilePath = path.resolve(process.cwd(), filePath);
  return resolvedFilePath.startsWith(path.resolve(process.cwd(), getCoreMetaEdSourceDirectory()));
}

export function updateEditorIfCore(editor: any) {
  if (!isCoreMetaEdFile(editor.getPath())) return;

  patchEditor(editor);
  editor.setReadOnly(!editor.getBuffer().__isReadOnly);
}

// monkey patching a TextEditor by removing transact() behavior stops a TextEditor from handling a core:copy event
// this is a replacement to bring the functionality back
export function addCopyBackToCore(commandEvent: any) {
  const target = commandEvent.currentTarget;
  if (!target) return;
  const editor = target.getModel();
  if (!editor) return;
  if (!isCoreMetaEdFile(editor.getPath())) return;

  const selectedText = editor.getSelectedText();
  if (!selectedText) return;

  atom.clipboard.write(selectedText);
}
