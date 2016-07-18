import antlr4 from 'antlr4';

export default class MetaEdErrorListener {

    private errorMessageCollection : Array<any>;

    constructor(errorMessageCollection: Array<any>) {
        antlr4.error.ErrorListener.call(this);
        this.errorMessageCollection = errorMessageCollection;
    }

    syntaxError(recognizer, offendingSymbol, concatenatedLineNumber, characterPosition,
              message /* , e */) {
        this.errorMessageCollection.push({
            message,
            characterPosition,
            concatenatedLineNumber,
            fileName: 'metaEdFile.fileName',
            lineNumber: 'metaEdFile.lineNumber',
        });
    }

  // withContext(metaEdFileIndex: number, errorMessageCollection) {
  //   this.metaEdFileIndex = metaEdFileIndex;
  //   this.errorMessageCollection = errorMessageCollection;
  // }
}
