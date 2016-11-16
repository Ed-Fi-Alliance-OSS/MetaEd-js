// @flow
import MetaEdFile from './MetaEdFile';

export type FileAndLineNumber = {
  file: MetaEdFile,
  lineNumber: number,
}

export type FilenameAndLineNumber = {
  filename: string,
  lineNumber: number,
}

export interface IMetaEdFileIndex {
  getAllContents(): string;
  getFilenameAndLineNumber(concatenatedLineNumber: number): FileAndLineNumber;
  load(metaEdFiles: MetaEdFile[]): void;
}

