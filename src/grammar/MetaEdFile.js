export class MetaEdFile {
  constructor(directoryName, filename, contents) {
    this.directoryName = directoryName;
    this.filename = filename;
    this._contents = contents;
  }

  get Contents() {
    return this._contents;
  }

  set Contents(value) {
    this._contents = value;
    if (this._contents == null) {
      this._contents = '';
    }

    if (!this._contents.endsWith('\n')) {
      this._contents += '\n';
    }
    this._lineCount = this._contents.split('\n').length - 1;
  }

  get FullName() {
    if (this.directoryName == null || this.directoryName === '') return this.filename;

    return `${this.directoryName}/${this.filename}`;
  }

  get LineCount() {
    return this._lineCount;
  }
}
