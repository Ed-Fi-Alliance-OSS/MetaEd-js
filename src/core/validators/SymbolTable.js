"use strict";
const PropertySymbolTable_1 = require('./PropertySymbolTable');
class SymbolTable {
    constructor() {
        this.symbolTable = new Map();
    }
    tryAdd(entityType, name, context) {
        let entityDictionary = this.symbolTable.get(entityType);
        if (!entityDictionary) {
            entityDictionary = new Map();
            this.symbolTable.set(entityType, entityDictionary);
        }
        if (entityDictionary.has(name))
            return false;
        let entityContext = new EntityContext(name, context);
        entityContext.propertySymbolTable = new PropertySymbolTable_1.default(entityContext);
        entityDictionary.set(name, entityContext);
        return true;
    }
    get(entityType, name) {
        let entityDictionary = this.symbolTable.get(entityType);
        if (!entityDictionary)
            return null;
        let entityContext = entityDictionary.get(name);
        return entityContext;
    }
    identifierExists(entityType, identifier) {
        if (!this.symbolTable.has(entityType))
            return false;
        return this.symbolTable.get(entityType).has(identifier);
    }
    identifiersForEntityType(entityType) {
        let entityDictionary = this.symbolTable.get(entityType);
        if (entityDictionary)
            return entityDictionary.keys();
        return new Array().values();
    }
    // results are prefixed by a 'with context' value if one exists for property
    identifiersForEntityProperties(entityType, identifier) {
        let entityContext = this.get(entityType, identifier);
        if (entityContext == null)
            return new Array().values();
        return entityContext.propertySymbolTable.identifiers();
    }
    // candidate identifiers should be prefixed by a 'with context' value if one exists for property
    contextsForMatchingPropertyIdentifiers(entityType, name, candidatePropertyIdentifiers) {
        let entityContext = this.get(entityType, name);
        if (entityContext == null)
            return [];
        return entityContext.propertySymbolTable.contextsForMatchingIdentifiers(candidatePropertyIdentifiers);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SymbolTable;
class EntityContext {
    constructor(name, context) {
        this.name = name;
        this.context = context;
    }
}
exports.EntityContext = EntityContext;
//# sourceMappingURL=SymbolTable.js.map