// @flow
import { MetaEdFile } from '../../grammar/MetaEdFile';
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

  load(metaEdFiles: MetaEdFile[]) {
    throw new Error('Not implemented');
  }
}
