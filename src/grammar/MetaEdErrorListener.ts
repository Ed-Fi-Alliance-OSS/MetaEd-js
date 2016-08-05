/// <reference path="../../typings/globals/node/index.d.ts" />
let antlr4 = require('antlr4');

export default class MetaEdErrorListener {

    private errorMessageCollection: Array<any>;

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
}
