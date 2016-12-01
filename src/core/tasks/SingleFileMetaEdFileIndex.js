// @flow
import winston from 'winston';
import MetaEdFile from './MetaEdFile';
import type { FilenameAndLineNumber } from './IMetaEdFileIndex';

export default class SingleFileMetaEdFileIndex {
  metaEdFile: MetaEdFile;

  add(metaEdFile: MetaEdFile) {
    this.metaEdFile = metaEdFile;
  }

  addContents(contents: string) {
    this.metaEdFile = new MetaEdFile('DirectoryName', 'FileName', contents);
  }

  getAllContents(): string {
    return this.metaEdFile.getContents();
  }

  getFilenameAndLineNumber(concatenatedLineNumber: number): FilenameAndLineNumber {
    return { filename: this.metaEdFile.filename, lineNumber: concatenatedLineNumber };
  }

  // eslint-disable-next-line class-methods-use-this
  load(metaEdFiles: MetaEdFile[]): void {
    winston.error(`SingleFileMetaEdFileIndex: load method called with ${metaEdFiles.join()}, but not implemented`);
  }
}
