// @flow
import type { FilenameAndLineNumber } from '../../src/core/tasks/IMetaEdFileIndex';
import MetaEdFile from '../../src/core/tasks/MetaEdFile';

export default class StubMetaEdFileIndex {
  static getAllContents(): string {
    return '';
  }

  getFilenameAndLineNumber(concatenatedLineNumber: number): FilenameAndLineNumber {
    return { filename: '', lineNumber: concatenatedLineNumber };
  }

  load(metaEdFiles: MetaEdFile[]) {
    return;
  }
}
