// @flow
import R from 'ramda';
import { Record } from 'immutable';
import type { MetaEdFile } from './MetaEdFile';

export type FileAndLineNumber = {
  file: MetaEdFile,
  lineNumber: number,
}

export type FilenameAndLineNumber = {
  filename: string,
  lineNumber: number,
}

type FileIndexRecord = {
  fileAndLineNumbersSorted: FileAndLineNumber[];
  totalLineCount: number;
}

export type FileIndex = Record<FileIndexRecord>;

export const FileIndexInstance: FileIndex = Record({
  fileAndLineNumbersSorted: null,
  totalLineCount: null,
});

export function getAllContents(fileIndex: FileIndex): string {
  return fileIndex.get('fileAndLineNumbersSorted').map(x => x.file.get('contents')).join('');
}

export function getFilenameAndLineNumber(fileIndex: FileIndex, concatenatedLineNumber: number): FilenameAndLineNumber {
  const matchingFileAndLineNumber = R.findLast(x => x.lineNumber <= concatenatedLineNumber, fileIndex.get('fileAndLineNumbersSorted'));

  if (matchingFileAndLineNumber == null) {
    return { filename: 'Error/matchingFileAndLineNumber/null', lineNumber: -1 };
  }

  const lineNumber = (concatenatedLineNumber - matchingFileAndLineNumber.lineNumber) + 1;
  return { filename: matchingFileAndLineNumber.file.fullName, lineNumber };
}

export function createFileIndex(metaEdFiles: MetaEdFile[]): FileIndex {
  const fileAndLineNumbers: FileAndLineNumber[] = [];
  let lineNumber = 1;
  metaEdFiles.forEach(file => {
    fileAndLineNumbers.push({ file, lineNumber });
    lineNumber += file.get('lineCount');
  });

  // $FlowFixMe -- doesn't like constructor call on Immutable.Record
  return new FileIndexInstance({
    fileAndLineNumbersSorted: R.sortBy(R.prop('lineNumber'))(fileAndLineNumbers),
    totalLineCount: lineNumber,
  });
}
