"use strict";
const PropertySymbolTable_1 = require('./PropertySymbolTable');
const Dictionary_1 = require('typescript-dotnet-commonjs/System/Collections/Dictionaries/Dictionary');
const Linq_1 = require('typescript-dotnet-commonjs/System.Linq/Linq');
class SymbolTable {
    constructor() {
        this._symbolTable = new Dictionary_1.default();
    }
    tryAdd(entityType, name, context) {
        let entityDictionary = this.symbolTable.getValue(entityType);
        if (!entityDictionary) {
            entityDictionary = new Dictionary_1.default();
            this.symbolTable.addByKeyValue(entityType, entityDictionary);
        }
        if (entityDictionary.containsKey(name))
            return false;
        let entityContext = new EntityContext(name, context);
        entityContext.propertySymbolTable = new PropertySymbolTable_1.default(entityContext);
        entityDictionary.addByKeyValue(name, entityContext);
        return true;
    }
    get(entityType, name) {
        let entityDictionary = this.symbolTable.getValue(entityType);
        if (!entityDictionary)
            return null;
        let entityContext = entityDictionary.getValue(name);
        return entityContext;
    }
    identifierExists(entityType, identifier) {
        if (!this.symbolTable.containsKey(entityType))
            return false;
        return this._symbolTable[entityType].containsKey(identifier);
    }
    identifiersForEntityType(entityType) {
        let entityDictionary = this.symbolTable.getValue(entityType);
        return entityDictionary ? Linq_1.default.from(entityDictionary.keys) : Linq_1.default.empty();
    }
    // results are prefixed by a 'with context' value if one exists for property
    identifiersForEntityProperties(entityType, identifier) {
        let entityContext = this.get(entityType, identifier);
        if (entityContext == null)
            return Linq_1.default.empty();
        return entityContext.propertySymbolTable.identifiers();
    }
    // candidate identifiers should be prefixed by a 'with context' value if one exists for property
    contextsForMatchingPropertyIdentifiers(entityType, name, candidatePropertyIdentifiers) {
        let entityContext = this.get(entityType, name);
        if (entityContext == null)
            return Linq_1.default.empty();
        return entityContext.propertySymbolTable.contextsForMatchingIdentifiers(candidatePropertyIdentifiers);
    }
}
exports.SymbolTable = SymbolTable;
class EntityContext {
    constructor(name, context) {
        this.name = name;
        this.context = context;
    }
}
exports.EntityContext = EntityContext;
//# sourceMappingURL=SymbolTable.js.map