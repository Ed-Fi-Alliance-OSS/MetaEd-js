// @flow
// eslint-disable-next-line no-duplicate-imports
import type { MetaEdFile, FileSet } from './MetaEdFile';
import type { State } from '../State';

function appendFileSet(state: State, fileSet: FileSet): State {
  const filepaths = fileSet.files.map(file => file.fullName);

  return state.set('loadedFileSet', state.get('loadedFileSet').push(fileSet))
  .set('filepathsToExclude', state.get('filepathsToExclude').concat(filepaths))
  .set('action', state.get('action').push('BufferFilenameLoader.loadCoreBufferedFiles'));
}

export function loadCoreBufferedFiles(state: State, files: MetaEdFile[]): State {
  const fileSet: FileSet = {
    namespace: 'edfi',
    projectExtension: '',
    isExtension: false,
    files,
  };
  return appendFileSet(state, fileSet);
}

export function loadExtensionBufferedFiles(state: State, files: MetaEdFile[]): State {
  const fileSet: FileSet = {
    namespace: 'extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
    files,
  };
  return appendFileSet(state, fileSet);
}
