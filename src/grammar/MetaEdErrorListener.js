/// <reference path="../../typings/globals/node/index.d.ts" />
import antlr4 from 'antlr4';

export default class MetaEdErrorListener {

    _errorMessageCollection: Array<any>;

    constructor(errorMessageCollection: Array<any>) {
        antlr4.error.ErrorListener.call(this);
        this._errorMessageCollection = errorMessageCollection;
    }

    syntaxError(recognizer, offendingSymbol, concatenatedLineNumber, characterPosition,
        message /* , e */) {
        this._errorMessageCollection.push({
            message,
            characterPosition,
            concatenatedLineNumber,
            fileName: 'metaEdFile.fileName',
            lineNumber: 'metaEdFile.lineNumber',
        });
    }
}
