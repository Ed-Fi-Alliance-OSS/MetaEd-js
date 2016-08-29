"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
class MergePropertyPathMustExist extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable, propertyPathLookup) {
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this._propertyPathLookup = propertyPathLookup;
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let entityContext = LookupParentEntityContext(context);
        let propertyPathParts = context.propertyPath().PropertyPathParts();
        return this._propertyPathLookup.Validate(entityContext, propertyPathParts, PropertyPathLookup.MatchAllButFirstAsIdentityProperties());
    }
    getFailureMessage(context) {
        return `Path ${context.GetText()} is not valid.`;
    }
    lookupParentEntityContext(context) {
        let definingEntityContext = context.parent.parent.parent.parent;
        let domainEntityContext = __as__(definingEntityContext, MetaEdGrammar.DomainEntityContext);
        if (domainEntityContext != null) {
            return this.symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), domainEntityContext.entityName().IdText());
        }
        let domainEntityExtensionContext = __as__(definingEntityContext, MetaEdGrammar.DomainEntityExtensionContext);
        if (domainEntityExtensionContext != null) {
            return this.symbolTable.Get(this.symbolTableEntityType.domainEntityExtensionEntityType(), domainEntityExtensionContext.extendeeName().IdText());
        }
        let domainEntitySubclassContext = __as__(definingEntityContext, MetaEdGrammar.DomainEntitySubclassContext);
        if (domainEntitySubclassContext != null) {
            return this.symbolTable.Get(this.symbolTableEntityType.domainEntitySubclassEntityType(), domainEntitySubclassContext.entityName().IdText());
        }
        let associationContext = __as__(definingEntityContext, MetaEdGrammar.AssociationContext);
        if (associationContext != null) {
            return this.symbolTable.Get(this.symbolTableEntityType.associationEntityType(), associationContext.associationName().IdText());
        }
        let associationExtensionContext = __as__(definingEntityContext, MetaEdGrammar.AssociationExtensionContext);
        if (associationExtensionContext != null) {
            return this.symbolTable.Get(this.symbolTableEntityType.associationExtensionEntityType(), associationExtensionContext.extendeeName().IdText());
        }
        let associationSubclassContext = __as__(definingEntityContext, MetaEdGrammar.AssociationSubclassContext);
        if (associationSubclassContext != null) {
            return this.symbolTable.Get(this.symbolTableEntityType.associationSubclassEntityType(), associationSubclassContext.associationName().IdText());
        }
        let abstractContext = __as__(definingEntityContext, MetaEdGrammar.AbstractEntityContext);
        if (abstractContext != null) {
            return this.symbolTable.Get(this.symbolTableEntityType.abstractEntityEntityType(), abstractContext.abstractEntityName().IdText());
        }
        return null;
    }
}
exports.MergePropertyPathMustExist = MergePropertyPathMustExist;
//# sourceMappingURL=MergePropertyPathMustExist.js.map