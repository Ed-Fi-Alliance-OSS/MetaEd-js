"use strict";
const List_1 = require('typescript-dotnet-commonjs/System/Collections/List');
class MetaEdContext {
    constructor(metaEdFileIndex, symbolTable) {
        this._metaEdFileIndex = metaEdFileIndex;
        this._symbolTable = symbolTable;
        this._errorMessageCollection = new List_1.default();
        this._warningMessageCollection = new List_1.default();
    }
    get metaEdFileIndex() { return this._metaEdFileIndex; }
    get errorMessageCollection() { return this._errorMessageCollection; }
    ;
    get warningMessageCollection() { return this._warningMessageCollection; }
    ;
    get symbolTable() { return this._symbolTable; }
    ;
}
exports.MetaEdContext = MetaEdContext;
//# sourceMappingURL=MetaEdContext.js.map