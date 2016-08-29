import {EntityContext} from './SymbolTable'

export default class PropertySymbolTable {
    private _parent: EntityContext;
    private symbolTable: Map<string, any> = new Map<string, any>();

    public get parent(): EntityContext { return this._parent; }

    public constructor(parent: EntityContext) {
        this._parent = parent;
    }

    // name should be prefixed by a 'with context' value if one exists for property
    public tryAdd(name: string, context: any): boolean {
        if (this.symbolTable.has(name))
            return false;
        this.symbolTable.set(name, context);
        return true;
    }
    // name should be prefixed by a 'with context' value if one exists for property
    public get(name: string): any {
        return this.symbolTable.get(name);
    }
    // results are prefixed by a 'with context' value if one exists for property
    public identifiers(): IterableIterator<string> {
        return this.symbolTable.keys();
    }
    public values(): IterableIterator<any> {
        return this.symbolTable.values();
    }
    // candidate identifiers should be prefixed by a 'with context' value if one exists for property
    public contextsForMatchingIdentifiers(candidateIdentifiers: Array<string>): Array<any> {
        return Array.from(this.symbolTable.entries()).filter(x => candidateIdentifiers.some(e => e === x[0])).map(y => y[1]);
    }
    public getWithoutContext(name: string): Array<any> {
        return Array.from(this.symbolTable.entries()).filter(x => x[1].propertyName().ID().getText() === name).map(x => x[1]);
    }
}