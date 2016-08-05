import {EntityContext} from './SymbolTable'
import {IPropertyWithComponents} from './../../grammar/IPropertyWithComponents'

import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable'
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary'
import ICollection from 'typescript-dotnet-commonjs/System/Collections/ICollection'
import Dictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/Dictionary'
import Enumerable from 'typescript-dotnet-commonjs/System.Linq/Linq'

export default class PropertySymbolTable {
    private _parent: EntityContext;
    private symbolTable: IDictionary<string, IPropertyWithComponents> = new Dictionary<string, IPropertyWithComponents>();

    public get parent(): EntityContext { return this._parent; }

    public constructor(parent: EntityContext) {
        this._parent = parent;
    }

    // name should be prefixed by a 'with context' value if one exists for property
    public tryAdd(name: string, context: IPropertyWithComponents): boolean {
        if (this.symbolTable.containsKey(name))
            return false;
        this.symbolTable.addByKeyValue(name, context);
        return true;
    }
    // name should be prefixed by a 'with context' value if one exists for property
    public get(name: string): IPropertyWithComponents {
        return this.symbolTable.getValue(name);
    }
    // results are prefixed by a 'with context' value if one exists for property
    public identifiers(): IEnumerable<string> {
        return Enumerable.from(this.symbolTable.keys);
    }
    public values(): IEnumerable<IPropertyWithComponents> {
        return Enumerable.from(this.symbolTable.values);
    }
    // candidate identifiers should be prefixed by a 'with context' value if one exists for property
    public contextsForMatchingIdentifiers(candidateIdentifiers: ICollection<string>): IEnumerable<IPropertyWithComponents> {
        return Enumerable.from(this.symbolTable).where(x => candidateIdentifiers.contains(x.key)).select(x => x.value);
    }
    public getWithoutContext(name: string): IEnumerable<IPropertyWithComponents> {
        return Enumerable.from(this.symbolTable).where(x => x.value.idNode().getText() == name).select(x => x.value);
    }
}