// @flow
import R from 'ramda';
import MetaEdFile from './MetaEdFile';
import type { FileAndLineNumber, FilenameAndLineNumber } from './IMetaEdFileIndex';

export default class MetaEdFileIndex
{
  _fileAndLineNumbersSorted: FileAndLineNumber[];
  _totalLineCount: number;

  getAllContents(): string {
    return this._fileAndLineNumbersSorted.map(x => x.file.getContents()).join();
  }

  getFilenameAndLineNumber(concatenatedLineNumber: number): FilenameAndLineNumber {
    const matchingFileAndLineNumber = R.findLast(x => x.lineNumber <= concatenatedLineNumber, this._fileAndLineNumbersSorted);

    if (this._totalLineCount <= concatenatedLineNumber || matchingFileAndLineNumber == null) {
      return { filename: 'unknown', lineNumber: -1 };
    }

    const lineNumber = (concatenatedLineNumber - matchingFileAndLineNumber.lineNumber) + 1;
    return { filename: matchingFileAndLineNumber.file.fullName(), lineNumber };
  }

  load(metaEdFiles: MetaEdFile[]): void {
    const fileAndLineNumbers: FileAndLineNumber[] = [];
    let lineNumber = 1;
    metaEdFiles.forEach(file => {
      fileAndLineNumbers.push({ file, lineNumber });
      lineNumber += file.lineCount;
    });

    this._totalLineCount = lineNumber;
    this._fileAndLineNumbersSorted = R.sortBy(R.prop('lineNumber'))(fileAndLineNumbers);
  }
}

