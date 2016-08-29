"use strict";
/// <reference path="../../typings/globals/node/index.d.ts" />
let antlr4 = require('antlr4');
class MetaEdErrorListener {
    constructor(errorMessageCollection) {
        antlr4.error.ErrorListener.call(this);
        this.errorMessageCollection = errorMessageCollection;
    }
    syntaxError(recognizer, offendingSymbol, concatenatedLineNumber, characterPosition, message /* , e */) {
        this.errorMessageCollection.push({
            message,
            characterPosition,
            concatenatedLineNumber,
            fileName: 'metaEdFile.fileName',
            lineNumber: 'metaEdFile.lineNumber',
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MetaEdErrorListener;
//# sourceMappingURL=MetaEdErrorListener.js.map