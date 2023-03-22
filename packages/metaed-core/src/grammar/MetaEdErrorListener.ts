import { ErrorListener } from 'antlr4';
import { ValidationFailure } from '../validator/ValidationFailure';

export class MetaEdErrorListener extends ErrorListener<any> {
  messageCollection: ValidationFailure[];

  validatorName: string;

  constructor(messageCollection: ValidationFailure[], validatorName: string = 'MetaEdErrorListener') {
    super();
    this.messageCollection = messageCollection;
    this.validatorName = validatorName;
  }

  syntaxError(
    _recognizer: any,
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
