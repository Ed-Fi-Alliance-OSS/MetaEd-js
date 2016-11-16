// @flow
import path from 'path';

export default class MetaEdFile {
  _contents: string;
  lineCount: number;
  directoryName: string;
  filename: string;

  getContents(): string {
    return this._contents;
  }

  setContents(contents: string) {
    this._contents = contents;
    if (this._contents == null) this._contents = '';

    if (!this._contents.endsWith('\r\n') && !this._contents.endsWith('\n')) {
      this._contents += '\r\n';
    }

    this.lineCount = this._contents.split(/\r\n|\r|\n/).length - 1;
  }

  fullName(): string {
    if (!this.directoryName) return this.filename;
    return path.join(this.directoryName, this.filename);
  }
}
