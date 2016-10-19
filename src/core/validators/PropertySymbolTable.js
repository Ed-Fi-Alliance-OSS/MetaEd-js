// @flow
import type SymbolTable, { EntityContext } from './SymbolTable';

export default class PropertySymbolTable {
    _symbolTable: Map<string, EntityContext>;
    _parentName: string;
    
    constructor(parentName: string) {
        this._parentName = parentName;
        this._symbolTable = new Map();
    }
    
    parentName(): string {
        return this._parentName;
    }

    // name should be prefixed by a 'with context' value if one exists for property
    tryAdd(name: string, entityContext: EntityContext): boolean {
        if (this._symbolTable.has(name)) return false;
        this._symbolTable.set(name, entityContext);
        return true;
    }

    // name should be prefixed by a 'with context' value if one exists for property
    get(name: string): ?EntityContext {
        return this._symbolTable.get(name);
    }

    // results are prefixed by a 'with context' value if one exists for property
    identifiers(): Iterator<string> {
        return this._symbolTable.keys();
    }

    values(): Iterator<EntityContext> {
        return this._symbolTable.values();
    }

    // candidate identifiers should be prefixed by a 'with context' value if one exists for property
    contextsForMatchingIdentifiers(candidateIdentifiers: Array<string>): Array<any> {
        return Array.from(this._symbolTable.entries()).filter(x => candidateIdentifiers.some(e => e === x[0])).map(y => y[1]);
    }

    getWithoutContext(name: string): Array<any> {
        return Array.from(this._symbolTable.entries()).filter(x => x[1].propertyName().ID().getText() === name).map(x => x[1]);
    }
}