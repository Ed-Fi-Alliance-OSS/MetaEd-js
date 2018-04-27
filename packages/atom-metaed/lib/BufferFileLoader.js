/** @babel */
// @flow
import path from 'path';
import type { MetaEdFile, FileSet, State } from 'metaed-core';
import { createMetaEdFile } from 'metaed-core';
import type { MetaEdProjectMetadata } from './Projects';

function addFileSet(state: State, fileSet: FileSet): void {
  const filepaths = fileSet.files.map(file => file.fullPath);
  filepaths.forEach(filePath => state.filePathsToExclude.add(filePath));
  state.loadedFileSet.push(fileSet);
}

function filesFrom(textEditors: AtomTextEditor[]): MetaEdFile[] {
  return textEditors.map(te => createMetaEdFile(path.dirname(te.getPath()), path.basename(te.getPath()), te.getText()));
}

export function loadFromModifiedEditors(state: State, metaEdProjectMetadata: Array<MetaEdProjectMetadata>): void {
  const editors = atom.workspace
    .getTextEditors()
    .filter(editor => editor.isModified() && editor.getPath() && editor.getPath().endsWith('.metaed'));

  metaEdProjectMetadata.forEach(({ projectPath, projectNamespace, projectExtension, projectName, isExtensionProject }) => {
    const modifiedFiles: MetaEdFile[] = filesFrom(editors.filter(editor => editor.getPath().startsWith(projectPath)));
    if (modifiedFiles.length === 0) return;

    const fileSetForProject: FileSet = {
      namespace: projectNamespace,
      projectExtension,
      projectName,
      isExtension: isExtensionProject,
      files: modifiedFiles,
    };
    addFileSet(state, fileSetForProject);
  });
}
