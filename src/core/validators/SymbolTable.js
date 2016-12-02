// @flow
import PropertySymbolTable from './PropertySymbolTable';

declare type ParserRuleContext = any;

function emptyIterator(): any {
  return {
    next() { return { done: true }; },
  };
}

export type EntityContext = {
  name: string,
  context: ParserRuleContext,
  propertySymbolTable: PropertySymbolTable
};

export default class SymbolTable {
  symbolTable: Map<string, Map<string, EntityContext>>;

  constructor() {
    this.symbolTable = new Map();
  }

  tryAdd(entityType: string, name: string, ruleContext: ParserRuleContext): boolean {
    let entityDictionary: ?Map<string, EntityContext> = this.symbolTable.get(entityType);

    if (entityDictionary == null) {
      entityDictionary = new Map();
      this.symbolTable.set(entityType, entityDictionary);
    }

    if (entityDictionary.has(name)) return false;

    const entityContext: EntityContext = {
      name,
      context: ruleContext,
      propertySymbolTable: new PropertySymbolTable(name),
    };

    entityDictionary.set(name, entityContext);
    return true;
  }

  get(entityType: string, name: string): ?EntityContext {
    const entityDictionary = this.symbolTable.get(entityType);
    if (entityDictionary == null) return null;
    return entityDictionary.get(name);
  }

  identifierExists(entityType: string, identifier: string): boolean {
    const propertySymbolTable = this.symbolTable.get(entityType);
    if (propertySymbolTable == null) return false;
    return propertySymbolTable.has(identifier);
  }

  identifiersForEntityType(entityType: string): any {
    const entityDictionary = this.symbolTable.get(entityType);
    if (entityDictionary) return entityDictionary.keys();
    return emptyIterator();
  }

  // results are prefixed by a 'with context' value if one exists for property
  identifiersForEntityProperties(entityType: string, identifier: string): any {
    const entityContext: ?EntityContext = this.get(entityType, identifier);

    if (entityContext == null) return emptyIterator();
    return entityContext.propertySymbolTable.identifiers();
  }

  // candidate identifiers should be prefixed by a 'with context' value if one exists for property
  contextsForMatchingPropertyIdentifiers(entityType: string, name: string, candidatePropertyIdentifiers: Array<string>): Array<any> {
    const entityContext: ?EntityContext = this.get(entityType, name);

    if (entityContext == null) return [];
    return entityContext.propertySymbolTable.contextsForMatchingIdentifiers(candidatePropertyIdentifiers);
  }
}
