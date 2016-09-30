import PropertySymbolTable from './PropertySymbolTable'

export default class SymbolTable {

    constructor() {
        this.symbolTable = new Map();
    }

    tryAdd(entityType, name, ruleContext) {

        let entityDictionary = this.symbolTable.get(entityType);

        if (!entityDictionary) {
            entityDictionary = new Map();
            this.symbolTable.set(entityType, entityDictionary);
        }

        if (entityDictionary.has(name))
            return false;

        let entityContext = {name: name, context: ruleContext};

        entityContext.propertySymbolTable = new PropertySymbolTable(entityContext);
        entityDictionary.set(name, entityContext);

        return true;
    }

    get(entityType, name) {
        let entityDictionary = this.symbolTable.get(entityType);
        if (!entityDictionary) return null;

        return entityDictionary.get(name);
    }

    identifierExists(entityType, identifier) {
        if (!this.symbolTable.has(entityType)) return false;
        return this.symbolTable.get(entityType).has(identifier);
    }

    identifiersForEntityType(entityType) {
        let entityDictionary = this.symbolTable.get(entityType);
        if (entityDictionary) return entityDictionary.keys();
        return new Array().values();
    }

    // results are prefixed by a 'with context' value if one exists for property
    identifiersForEntityProperties(entityType, identifier) {
        let entityContext = this.get(entityType, identifier);

        if (entityContext == null) return new Array().values();
        return entityContext.propertySymbolTable.identifiers();
    }

    // candidate identifiers should be prefixed by a 'with context' value if one exists for property
    contextsForMatchingPropertyIdentifiers(entityType, name, candidatePropertyIdentifiers) {
        let entityContext = this.get(entityType, name);

        if (entityContext == null) return [];
        return entityContext.propertySymbolTable.contextsForMatchingIdentifiers(candidatePropertyIdentifiers);
    }
}