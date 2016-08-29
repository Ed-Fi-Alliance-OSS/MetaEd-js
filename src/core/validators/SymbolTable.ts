import {IPropertyWithComponents} from '../../grammar/IPropertyWithComponents';
import PropertySymbolTable from './PropertySymbolTable'

export interface ISymbolTable {
    tryAdd(entityType: string, name: string, context: any): boolean;
    get(entityType: string, name: string): EntityContext;
    identifierExists(entityType: string, identifier: string): boolean;
    identifiersForEntityType(entityType: string): IterableIterator<string>;
    identifiersForEntityProperties(entityType: string, identifier: string): IterableIterator<string>;
    contextsForMatchingPropertyIdentifiers(entityType: string, name: string, candidatePropertyIdentifiers: Array<string>): Array<any>;
}

export default class SymbolTable implements ISymbolTable {

    private symbolTable: Map<string, Map<string, EntityContext>> = new Map<string, Map<string, EntityContext>>();

    public tryAdd(entityType: string, name: string, context: any): boolean {

        let entityDictionary: Map<string, EntityContext> = this.symbolTable.get(entityType);

        if (!entityDictionary) {
            entityDictionary = new Map<string, EntityContext>();
            this.symbolTable.set(entityType, entityDictionary);
        }

        if (entityDictionary.has(name))
            return false;

        let entityContext = new EntityContext(name, context);

        entityContext.propertySymbolTable = new PropertySymbolTable(entityContext);
        entityDictionary.set(name, entityContext);

        return true;
    }

    public get(entityType: string, name: string): EntityContext {
        let entityDictionary: Map<string, EntityContext> = this.symbolTable.get(entityType);
        if (!entityDictionary)
            return null;

        let entityContext: EntityContext = entityDictionary.get(name);

        return entityContext;
    }

    public identifierExists(entityType: string, identifier: string): boolean {
        if (!this.symbolTable.has(entityType)) return false;
        return this.symbolTable[entityType].containsKey(identifier);
    }

    public identifiersForEntityType(entityType: string): IterableIterator<string> {
        let entityDictionary: Map<string, EntityContext> = this.symbolTable.get(entityType);
        if (entityDictionary) return entityDictionary.keys();
        return new Array<string>().values();
    }

    // results are prefixed by a 'with context' value if one exists for property
    public identifiersForEntityProperties(entityType: string, identifier: string): IterableIterator<string> {
        let entityContext = this.get(entityType, identifier);

        if (entityContext == null)
            return [];
        return entityContext.propertySymbolTable.identifiers();
    }

    // candidate identifiers should be prefixed by a 'with context' value if one exists for property
    public contextsForMatchingPropertyIdentifiers(entityType: string, name: string, candidatePropertyIdentifiers: Array<string>): Array<IPropertyWithComponents> {
        let entityContext = this.get(entityType, name);

        if (entityContext == null) return [];
        return entityContext.propertySymbolTable.contextsForMatchingIdentifiers(candidatePropertyIdentifiers);
    }
}

export class EntityContext {
    public propertySymbolTable: PropertySymbolTable;
    public name: string;
    public context: any;
    public constructor (name: string, context: any) {
        this.name = name;
        this.context = context;
    }
}
