"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class MergePropertyAndTargetPropertyMustMatch extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable, propertyPathLookup) {
        this._symbolTable = symbolTable;
        this._propertyPathLookup = propertyPathLookup;
    }
    isValid(context) {
        var entityContext = LookupParentEntityContext(context);
        var mergePropertyPathParts = context.mergePropertyPath().propertyPath().PropertyPathParts();
        var targetPropertyPathParts = context.targetPropertyPath().propertyPath().PropertyPathParts();
        var mergeProperty = this._propertyPathLookup.FindReferencedProperty(entityContext, mergePropertyPathParts, PropertyPathLookup.MatchAllButFirstAsIdentityProperties());
        var targetProperty = this._propertyPathLookup.FindReferencedProperty(entityContext, targetPropertyPathParts, PropertyPathLookup.MatchAllIdentityProperties());
        if (mergeProperty == null || targetProperty == null)
            return true;
        var mergePropertyType = mergeProperty.GetType();
        var targetPropertyType = targetProperty.GetType();
        if (mergePropertyType != targetPropertyType) {
            if (!IsReferenceProperty(mergePropertyType) || !IsReferenceProperty(targetPropertyType))
                return false;
        }
        if (mergeProperty.IdNode().GetText() != targetProperty.IdNode().GetText()) {
            if (!IsReferenceProperty(mergePropertyType) || !IsReferenceProperty(targetPropertyType))
                return false;
            if (!MatchBaseType(mergeProperty, targetProperty.IdNode().GetText()) && !MatchBaseType(targetProperty, mergeProperty.IdNode().GetText()))
                return false;
        }
        return true;
    }
    getFailureMessage(context) {
        return `The merge paths '${}' and '${}' do not correspond to the same entity type.", context.mergePropertyPath().GetText(), context.targetPropertyPath().GetText());
    }
    private lookupParentEntityContext(context: MetaEdGrammar.MergePartOfReferenceContext): EntityContext {
        var definingEntityContext = context.parent.parent.parent;
        var domainEntityContext = __as__<MetaEdGrammar.DomainEntityContext>(definingEntityContext, MetaEdGrammar.DomainEntityContext);
        if (domainEntityContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityContext.entityName().IdText());
        }
        var domainEntityExtensionContext = __as__<MetaEdGrammar.DomainEntityExtensionContext>(definingEntityContext, MetaEdGrammar.DomainEntityExtensionContext);
        if (domainEntityExtensionContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityExtensionContext.extendeeName().IdText());
        }
        var domainEntitySubclassContext = __as__<MetaEdGrammar.DomainEntitySubclassContext>(definingEntityContext, MetaEdGrammar.DomainEntitySubclassContext);
        if (domainEntitySubclassContext != null) {
            var domainEntity = this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntitySubclassContext.baseName().IdText());
            return domainEntity != null ? domainEntity : this._symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), domainEntitySubclassContext.baseName().IdText());
        }
        var associationContext = __as__<MetaEdGrammar.AssociationContext>(definingEntityContext, MetaEdGrammar.AssociationContext);
        if (associationContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationContext.associationName().IdText());
        }
        var associationExtensionContext = __as__<MetaEdGrammar.AssociationExtensionContext>(definingEntityContext, MetaEdGrammar.AssociationExtensionContext);
        if (associationExtensionContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationExtensionContext.extendeeName().IdText());
        }
        var associationSubclassContext = __as__<MetaEdGrammar.AssociationSubclassContext>(definingEntityContext, MetaEdGrammar.AssociationSubclassContext);
        if (associationSubclassContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationSubclassContext.baseName().IdText());
        }
        var abstractContext = __as__<MetaEdGrammar.AbstractEntityContext>(definingEntityContext, MetaEdGrammar.AbstractEntityContext);
        if (abstractContext != null) {
            return this._symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), abstractContext.abstractEntityName().IdText());
        }
        return null;
    }
    private isReferenceProperty(type: Type): boolean {
        return ((type == /*typeof*/MetaEdGrammar.ReferencePropertyContext) || (type == /*typeof*/MetaEdGrammar.FirstDomainEntityContext) || (type == /*typeof*/MetaEdGrammar.SecondDomainEntityContext));
    }
    private matchBaseType(referencingProperty: IContextWithIdentifier, baseTypeName: string): boolean {
        var entityName = referencingProperty.IdNode().GetText();
        var entityContext: EntityContext = null;
        entityContext = this._symbolTable.Get(SymbolTableEntityType.DomainEntitySubclassEntityType(), entityName);
        if (entityContext != null) {
            var subclass = __as__<MetaEdGrammar.DomainEntitySubclassContext>(entityContext.Context, MetaEdGrammar.DomainEntitySubclassContext);
            return subclass.baseName().IdText() == baseTypeName;
        }
        entityContext = this._symbolTable.Get(SymbolTableEntityType.AssociationSubclassEntityType(), entityName);
        if (entityContext != null) {
            var subclass = __as__<MetaEdGrammar.AssociationSubclassContext>(entityContext.Context, MetaEdGrammar.AssociationSubclassContext);
            return subclass.baseName().IdText() == baseTypeName;
        }
        return false;
    }
}
;
    }
}
exports.MergePropertyAndTargetPropertyMustMatch = MergePropertyAndTargetPropertyMustMatch;
//# sourceMappingURL=MergePropertyAndTargetPropertyMustMatch.js.map