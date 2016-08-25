"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        if (context.includeExtensionOverride() == null)
            return true;
        var topLevelEntity = context.GetAncestorContext();
        switch (topLevelEntity.RuleIndex) {
            case MetaEdGrammar.RULE_domainEntityExtension:
                return MaintainsCardinalityOnDomainEntity(context, __as__(topLevelEntity, MetaEdGrammar.DomainEntityExtensionContext));
            case MetaEdGrammar.RULE_associationExtension:
                return MaintainsCardinalityOnAssociation(context, __as__(topLevelEntity, MetaEdGrammar.AssociationExtensionContext));
            default:
                return false;
        }
    }
    getFailureMessage(context) {
        var topLevelEntity = context.GetAncestorContext();
        var propertyWithComponents = context.GetAncestorContext();
        return string.Format("'include extension' is invalid for property {0} on {1} '{2}'.  'include extension' is only valid for properties on Domain Entity extension and Association extension, and must maintain original cardinality on extendee.", propertyWithComponents.IdNode().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName());
    }
    maintainsCardinalityOnDomainEntity(overriddenIncludePropertyContext, extensionEntityContext) {
        var extendeeEntityContext = this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), extensionEntityContext.EntityName());
        return MaintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext);
    }
    maintainsCardinalityOnAssociation(overriddenIncludePropertyContext, extensionEntityContext) {
        var extendeeEntityContext = this._symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), extensionEntityContext.EntityName());
        return MaintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext);
    }
    static maintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext) {
        var originalIncludePropertyContext = extendeeEntityContext.PropertySymbolTable.Get(overriddenIncludePropertyContext.PropertyName());
        if (!(originalIncludePropertyContext instanceof MetaEdGrammar.IncludePropertyContext))
            return false;
        return CardinalitiesMatch(__as__(originalIncludePropertyContext, MetaEdGrammar.IncludePropertyContext), overriddenIncludePropertyContext);
    }
    static cardinalitiesMatch(includePropertyContext, otherIncludePropertyContext) {
        var propertyAnnotationContext = includePropertyContext.propertyComponents().propertyAnnotation();
        var otherPropertyAnnotationContext = otherIncludePropertyContext.propertyComponents().propertyAnnotation();
        if (propertyAnnotationContext.required() != null && otherPropertyAnnotationContext.required() != null)
            return true;
        if (propertyAnnotationContext.optional() != null && otherPropertyAnnotationContext.optional() != null)
            return true;
        if (propertyAnnotationContext.collection() != null && propertyAnnotationContext.collection().requiredCollection() != null && otherPropertyAnnotationContext.collection() != null && otherPropertyAnnotationContext.collection().requiredCollection() != null)
            return true;
        if (propertyAnnotationContext.collection() != null && propertyAnnotationContext.collection().optionalCollection() != null && otherPropertyAnnotationContext.collection() != null && otherPropertyAnnotationContext.collection().optionalCollection() != null)
            return true;
        return false;
    }
}
exports.IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality = IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality;
//# sourceMappingURL=IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality.js.map