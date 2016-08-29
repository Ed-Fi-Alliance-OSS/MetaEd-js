"use strict";
class PropertySymbolTable {
    constructor(parent) {
        this.symbolTable = new Map();
        this._parent = parent;
    }
    get parent() { return this._parent; }
    // name should be prefixed by a 'with context' value if one exists for property
    tryAdd(name, context) {
        if (this.symbolTable.has(name))
            return false;
        this.symbolTable.set(name, context);
        return true;
    }
    // name should be prefixed by a 'with context' value if one exists for property
    get(name) {
        return this.symbolTable.get(name);
    }
    // results are prefixed by a 'with context' value if one exists for property
    identifiers() {
        return this.symbolTable.keys();
    }
    values() {
        return this.symbolTable.values();
    }
    // candidate identifiers should be prefixed by a 'with context' value if one exists for property
    contextsForMatchingIdentifiers(candidateIdentifiers) {
        return Array.from(this.symbolTable.entries()).filter(x => candidateIdentifiers.some(e => e === x[0])).map(y => y[1]);
    }
    getWithoutContext(name) {
        return Array.from(this.symbolTable.entries()).filter(x => x[1].propertyName().ID().getText() === name).map(x => x[1]);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PropertySymbolTable;
//# sourceMappingURL=PropertySymbolTable.js.map