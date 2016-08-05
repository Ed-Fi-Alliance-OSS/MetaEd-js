"use strict";
const Dictionary_1 = require('typescript-dotnet-commonjs/System/Collections/Dictionaries/Dictionary');
const Linq_1 = require('typescript-dotnet-commonjs/System.Linq/Linq');
class PropertySymbolTable {
    constructor(parent) {
        this.symbolTable = new Dictionary_1.default();
        this._parent = parent;
    }
    get parent() { return this._parent; }
    // name should be prefixed by a 'with context' value if one exists for property
    tryAdd(name, context) {
        if (this.symbolTable.containsKey(name))
            return false;
        this.symbolTable.addByKeyValue(name, context);
        return true;
    }
    // name should be prefixed by a 'with context' value if one exists for property
    get(name) {
        return this.symbolTable.getValue(name);
    }
    // results are prefixed by a 'with context' value if one exists for property
    identifiers() {
        return Linq_1.default.from(this.symbolTable.keys);
    }
    values() {
        return Linq_1.default.from(this.symbolTable.values);
    }
    // candidate identifiers should be prefixed by a 'with context' value if one exists for property
    contextsForMatchingIdentifiers(candidateIdentifiers) {
        return Linq_1.default.from(this.symbolTable).where(x => candidateIdentifiers.contains(x.key)).select(x => x.value);
    }
    getWithoutContext(name) {
        return Linq_1.default.from(this.symbolTable).where(x => x.value.idNode().getText() == name).select(x => x.value);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PropertySymbolTable;
//# sourceMappingURL=PropertySymbolTable.js.map