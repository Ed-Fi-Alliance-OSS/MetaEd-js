// @flow
import antlr4 from 'antlr4';
import type { ValidationFailure } from '../validator/ValidationFailure';

export class MetaEdErrorListener {
  messageCollection: ValidationFailure[];
  validatorName: string;

  constructor(messageCollection: ValidationFailure[], validatorName: string = 'MetaEdErrorListener') {
    antlr4.error.ErrorListener.call(this);
    this.messageCollection = messageCollection;
    this.validatorName = validatorName;
  }

  syntaxError(
    recognizer: any,
    offendingSymbol: any,
    concatenatedLineNumber: number,
    characterPosition: number,
    message: string,
  ) {
    this.messageCollection.push({
      validatorName: this.validatorName,
      category: 'error',
      message,
      sourceMap: {
        line: concatenatedLineNumber,
        column: characterPosition,
        tokenText: offendingSymbol && offendingSymbol.text ? offendingSymbol.text : '',
      },
      fileMap: null,
    });
  }

  getMessageCollection(): ValidationFailure[] {
    return this.messageCollection;
  }
}
