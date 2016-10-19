"use strict";
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
class PropertyPathLookup {
    constructor(symbolTable) {
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    validate(startingEntityContext, propertyPath, filter) {
        return this.findReferencedProperty(startingEntityContext, propertyPath, filter) != null;
    }
    findReferencedProperty(startingEntityContext, propertyPath, filter) {
        let entityContext = startingEntityContext;
        let entityName = null;
        let propertyContext = null;
        for (let propertyPathPart of propertyPath) {
            if (entityContext == null) {
                let entityType = this.getEntityType(entityName);
                if (entityType == null)
                    return null;
                entityContext = this.symbolTable.get(entityType, entityName);
            }
            let matchingProperties = entityContext.propertySymbolTable.getWithoutContext(propertyPathPart).Where(filter);
            if (!matchingProperties.Any()) {
                if (!this.findAssociationDomainEntityProperty(entityContext, propertyPathPart, /*out*/ propertyContext))
                    return null;
            }
            else if (matchingProperties.Count() > 1) {
                return null;
            }
            else {
                propertyContext = matchingProperties.First();
            }
            //   if ((propertyContext is MetaEdGrammar.ReferencePropertyContext)
            //         || (propertyContext is MetaEdGrammar.FirstDomainEntityContext)
            //         || (propertyContext is MetaEdGrammar.SecondDomainEntityContext))
            //   entityName = propertyContext.idNode().GetText();
            //     else
            entityName = null;
            entityContext = null;
        }
        return propertyContext;
    }
    findAssociationDomainEntityProperty(entityContext, propertyNameToMatch, /*out*/ property) {
        property = null;
        var associationContext = entityContext.context;
        if (associationContext == null)
            return false;
        if (associationContext.firstDomainEntity().IdText() == propertyNameToMatch) {
            property = associationContext.firstDomainEntity();
        }
        else if (associationContext.secondDomainEntity().IdText() == propertyNameToMatch) {
            property = associationContext.secondDomainEntity();
        }
        else
            return false;
        return true;
    }
    getEntityType(identifierToMatch) {
        var domainEntityType = this.symbolTableEntityType.domainEntityEntityType();
        if (this.symbolTable.identifierExists(domainEntityType, identifierToMatch))
            return domainEntityType;
        var associationType = this.symbolTableEntityType.associationEntityType();
        if (this.symbolTable.identifierExists(associationType, identifierToMatch))
            return associationType;
        var abstractEntityType = this.symbolTableEntityType.abstractEntityEntityType();
        if (this.symbolTable.identifierExists(abstractEntityType, identifierToMatch))
            return abstractEntityType;
        // since this is only being used to find properties that are part of the primary key
        // we won't look for extensions and subclasses now
        return null;
    }
}
exports.PropertyPathLookup = PropertyPathLookup;
//# sourceMappingURL=PropertyPathLookup.js.map