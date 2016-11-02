import { MetaEdFile } from '../../grammar/MetaEdFile';

export default class SingleFileMetaEdFileIndex {
  add(metaEdFile) {
    this.metaEdFile = metaEdFile;
  }

  addContents(contents) {
    this.metaEdFile = new MetaEdFile('DirectoryName', 'FileName', contents);
  }

  getAllContents() {
    return this.metaEdFile.Contents;
  }

  getFileAndLineNumber(concatenatedLineNumber) {
    return { fileName: this.metaEdFile.fileName, lineNumber: concatenatedLineNumber };
  }

  load(metaEdFiles) {
    throw new Error('Not implemented');
  }
}
