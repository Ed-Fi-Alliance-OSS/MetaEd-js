export default class PropertySymbolTable {
    constructor(parent) {
        this.parent = parent;
        this.symbolTable = new Map();
    }

    // name should be prefixed by a 'with context' value if one exists for property
    tryAdd(name, entityContext) {
        if (this.symbolTable.has(name))
            return false;
        this.symbolTable.set(name, entityContext);
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