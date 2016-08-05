"use strict";
const List_1 = require('typescript-dotnet-commonjs/System/Collections/List');
class MetaEdContext {
    constructor(metaEdFileIndex, symbolTable) {
        this._metaEdFileIndex = metaEdFileIndex;
        this._symbolTable = symbolTable;
        this._errorMessageCollection = new List_1.default();
        this._warningMessageCollection = new List_1.default();
    }
    get MetaEdFileIndex() { return this._metaEdFileIndex; }
    get ErrorMessageCollection() { return this._errorMessageCollection; }
    get WarningMessageCollection() { return this._warningMessageCollection; }
    get SymbolTable() { return this._symbolTable; }
}
exports.MetaEdContext = MetaEdContext;
//# sourceMappingURL=MetaEdContext.js.map