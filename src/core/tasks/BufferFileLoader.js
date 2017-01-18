// @flow
import R from 'ramda';
import { addAction, addLoadedFileSet, addFilepathsToExclude } from '../State';
import type { MetaEdFile, FileSet } from './MetaEdFile';
import type { State } from '../State';

function appendFileSet(state: State, fileSet: FileSet): State {
  const filepaths = fileSet.files.map(file => file.get('fullName'));
  return R.pipe(
    addAction('BufferFilenameLoader.appendFileSet'),
    addFilepathsToExclude(filepaths),
    addLoadedFileSet(fileSet))(state);
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
