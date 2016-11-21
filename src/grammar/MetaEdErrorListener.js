// @flow
import antlr4 from 'antlr4';
import type { ValidationMessage } from '../core/validators/ValidationMessage';
import type { IMetaEdFileIndex, FilenameAndLineNumber } from '../core/tasks/IMetaEdFileIndex';

export default class MetaEdErrorListener {
  _messageCollection: ValidationMessage[];
  _metaEdFileIndex: IMetaEdFileIndex;

  constructor(messageCollection: ValidationMessage[], metaEdFileIndex: IMetaEdFileIndex) {
    antlr4.error.ErrorListener.call(this);
    this._messageCollection = messageCollection;
    this._metaEdFileIndex = metaEdFileIndex;
  }

  syntaxError(recognizer: any, offendingSymbol: any, concatenatedLineNumber: number, characterPosition: number,
              message: string /* , e */) {
    const metaEdFile: FilenameAndLineNumber = this._metaEdFileIndex.getFilenameAndLineNumber(concatenatedLineNumber);

    this._messageCollection.push({
      message,
      characterPosition,
      concatenatedLineNumber,
      filename: metaEdFile.filename,
      lineNumber: metaEdFile.lineNumber,
    });
  }

  getMessageCollection(): ValidationMessage[] {
    return this._messageCollection;
  }
}
