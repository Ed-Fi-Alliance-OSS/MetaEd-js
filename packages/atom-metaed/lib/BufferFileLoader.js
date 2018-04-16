/** @babel */
// @flow
import path from 'path';
import type { MetaEdFile, FileSet, State } from 'metaed-core';
import { createMetaEdFile } from 'metaed-core';

import { getCoreMetaEdSourceDirectory } from './PackageSettings';

function appendFileSet(state: State, fileSet: FileSet): State {
  const filepaths = fileSet.files.map(file => file.fullPath);
  filepaths.forEach(filePath => state.filePathsToExclude.add(filePath));
  state.loadedFileSet.push(fileSet);
  return state;
}

function loadCoreBufferedFiles(state: State, files: MetaEdFile[]): State {
  if (files.length === 0) return state;
  const fileSet: FileSet = {
    namespace: 'edfi',
    projectExtension: '',
    projectName: 'Ed-Fi',
    isExtension: false,
    files,
  };
  return appendFileSet(state, fileSet);
}

function loadExtensionBufferedFiles(state: State, files: MetaEdFile[]): State {
  if (files.length === 0) return state;
  const fileSet: FileSet = {
    namespace: 'extension',
    projectExtension: 'EXTENSION',
    projectName: 'Extension',
    isExtension: true,
    files,
  };
  return appendFileSet(state, fileSet);
}

function filesFrom(textEditors: AtomTextEditor[]): MetaEdFile[] {
  return textEditors.map(te => createMetaEdFile(path.dirname(te.getPath()), path.basename(te.getPath()), te.getText()));
}

// support multiple extension projects
export function loadFromModifiedEditors(state: State): State {
  const editors = atom.workspace
    .getTextEditors()
    .filter(editor => editor.isModified() && editor.getPath() && editor.getPath().endsWith('.metaed'));
  const coreFiles = filesFrom(editors.filter(editor => editor.getPath().startsWith(getCoreMetaEdSourceDirectory())));
  const extensionFiles = filesFrom(editors.filter(editor => editor.getPath().startsWith(atom.project.getPaths()[1])));

  return loadCoreBufferedFiles(loadExtensionBufferedFiles(state, extensionFiles), coreFiles);
}
