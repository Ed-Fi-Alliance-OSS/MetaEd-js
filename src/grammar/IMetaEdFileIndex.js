export class MetaEdFileIndex {
  // Based on the logic in the load method. This should be sorted by default.
  _filesByLineNumber: any;
  _totalLineCount: any;

  getAllContents() {
    let concatenation = '';

    for (const value of this._filesByLineNumber) {
      concatenation += value.Contents;
    }

    return concatenation;
  }

  getFileAndLineNumber(concatenatedLineNumber) {
    let selectedValue;
    let selectedKey;

    for (let i = 1; i < this._totalLineCount; i++) {
      const value = this._filesByLineNumber[i];
      if (!value) continue;
      if (i <= concatenatedLineNumber) {
        selectedValue = value;
        selectedKey = i;
      } else break;
    }

    if (this._totalLineCount <= concatenatedLineNumber || selectedValue == null) {
      return { fileName: 'unknown', lineNumber: -1 };
    }

    const lineNumber = concatenatedLineNumber - selectedKey + 1;

    return { fileName: selectedValue.fullName, lineNumber };
  }

  load(metaEdFiles) {
    this._filesByLineNumber = [];
    let lineNumber = 1;
    //FIXME: the C# translation here is wrong -- this is iterating over properties on an object
    for (const key in metaEdFiles) {
      this._filesByLineNumber[lineNumber] = metaEdFiles[key];
      lineNumber += metaEdFiles[key].LineCount;
    }

    this._totalLineCount = lineNumber;
  }
}
