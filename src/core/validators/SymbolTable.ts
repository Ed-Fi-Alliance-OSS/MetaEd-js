import {IPropertyWithComponents} from '../../grammar/IPropertyWithComponents';
import PropertySymbolTable from './PropertySymbolTable'
import Dictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/Dictionary'

import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable'
import ICollection from 'typescript-dotnet-commonjs/System/Collections/ICollection'
import Enumerable from 'typescript-dotnet-commonjs/System.Linq/Linq'
import ParserRuleContext = MetaEdGrammar.ParserRuleContext;

export interface ISymbolTable {
    tryAdd(entityType: string, name: string, context: ParserRuleContext): boolean
    get(entityType: string, name: string): EntityContext
    identifierExists(entityType: string, identifier: string): boolean
    identifiersForEntityType(entityType: string): IEnumerable<string>
    identifiersForEntityProperties(entityType: string, identifier: string): IEnumerable<string>
    contextsForMatchingPropertyIdentifiers(entityType: string, name: string, candidatePropertyIdentifiers: ICollection<string>): IEnumerable<IPropertyWithComponents>
}

export class SymbolTable implements ISymbolTable {

    private _symbolTable: Dictionary<string, Dictionary<string, EntityContext>> = new Dictionary<string, Dictionary<string, EntityContext>>();

    public tryAdd(entityType: string, name: string, context: ParserRuleContext): boolean {

        let entityDictionary: Dictionary<string, EntityContext> = this.symbolTable.getValue(entityType);

        if (!entityDictionary) {
            entityDictionary = new Dictionary<string, EntityContext>();
            this.symbolTable.addByKeyValue(entityType, entityDictionary);
        }

        if (entityDictionary.containsKey(name))
            return false;

        let entityContext = new EntityContext(name, context);

        entityContext.propertySymbolTable = new PropertySymbolTable(entityContext);
        entityDictionary.addByKeyValue(name, entityContext);

        return true;
    }

    public get(entityType: string, name: string): EntityContext {
        let entityDictionary: Dictionary<string, EntityContext> = this.symbolTable.getValue(entityType);
        if (!entityDictionary)
            return null;

        let entityContext: EntityContext = entityDictionary.getValue(name);

        return entityContext;
    }

    public identifierExists(entityType: string, identifier: string): boolean {
        if (!this.symbolTable.containsKey(entityType)) return false;
        return this._symbolTable[entityType].containsKey(identifier);
    }
    public identifiersForEntityType(entityType: string): IEnumerable<string> {
        let entityDictionary: Dictionary<string, EntityContext> = this.symbolTable.getValue(entityType);
        return entityDictionary ? Enumerable.from(entityDictionary.keys) : Enumerable.empty<string>();
    }

    // results are prefixed by a 'with context' value if one exists for property
    public identifiersForEntityProperties(entityType: string, identifier: string): IEnumerable<string> {
        let entityContext = this.get(entityType, identifier);

        if (entityContext == null)
            return Enumerable.empty<string>();
        return entityContext.propertySymbolTable.identifiers();
    }

    // candidate identifiers should be prefixed by a 'with context' value if one exists for property
    public contextsForMatchingPropertyIdentifiers(entityType: string, name: string, candidatePropertyIdentifiers: ICollection<string>): IEnumerable<IPropertyWithComponents> {
        let entityContext = this.get(entityType, name);

        if (entityContext == null) return Enumerable.empty<IPropertyWithComponents>();
        return entityContext.propertySymbolTable.contextsForMatchingIdentifiers(candidatePropertyIdentifiers);
    }
}

export class EntityContext {
    public propertySymbolTable: PropertySymbolTable;
    public name: string;
    public context: ParserRuleContext;
    public constructor(name: string, context: ParserRuleContext) {
        this.name = name;
        this.context = context;
    }
}
