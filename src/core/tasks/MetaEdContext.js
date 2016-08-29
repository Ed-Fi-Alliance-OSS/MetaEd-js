"use strict";
class MetaEdContext {
    constructor(metaEdFileIndex, symbolTable) {
        this._metaEdFileIndex = metaEdFileIndex;
        this._symbolTable = symbolTable;
        this._errorMessageCollection = new Array();
        this._warningMessageCollection = new Array();
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