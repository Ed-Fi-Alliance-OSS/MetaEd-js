// @flow
import antlr4 from 'antlr4';
import type { ValidationMessage } from '../core/validators/ValidationTypes';
import type { FileIndex, FilenameAndLineNumber } from '../core/tasks/FileIndex';
import { getFilenameAndLineNumber } from '../core/tasks/FileIndex';

export default class MetaEdErrorListener {
  _messageCollection: ValidationMessage[];
  _fileIndex: FileIndex;

  constructor(messageCollection: ValidationMessage[], fileIndex: FileIndex) {
    antlr4.error.ErrorListener.call(this);
    this._messageCollection = messageCollection;
    this._fileIndex = fileIndex;
  }

  syntaxError(recognizer: any, offendingSymbol: any, concatenatedLineNumber: number, characterPosition: number,
    message: string /* , e */) {
    const metaEdFile: FilenameAndLineNumber = getFilenameAndLineNumber(this._fileIndex, concatenatedLineNumber);

    this._messageCollection.push({
      message,
      characterPosition,
      concatenatedLineNumber,
      filename: metaEdFile.filename,
      lineNumber: metaEdFile.lineNumber,
      tokenText: offendingSymbol && offendingSymbol.text ? offendingSymbol.text : '',
    });
  }

  getMessageCollection(): ValidationMessage[] {
    return this._messageCollection;
  }
}
