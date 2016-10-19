"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
class IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        if (context.includeExtensionOverride() == null)
            return true;
        let topLevelEntity = context.GetAncestorContext();
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
        let topLevelEntity = context.GetAncestorContext();
        let propertyWithComponents = context.GetAncestorContext();
        return `'include extension' is invalid for property ${propertyWithComponents.IdNode().GetText()} on ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}'.  'include extension' is only valid for properties on Domain Entity extension and Association extension, and must maintain original cardinality on extendee.`;
    }
    maintainsCardinalityOnDomainEntity(overriddenIncludePropertyContext, extensionEntityContext) {
        let extendeeEntityContext = this.symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), extensionEntityContext.EntityName());
        return MaintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext);
    }
    maintainsCardinalityOnAssociation(overriddenIncludePropertyContext, extensionEntityContext) {
        let extendeeEntityContext = this.symbolTable.Get(this.symbolTableEntityType.associationEntityType(), extensionEntityContext.EntityName());
        return MaintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext);
    }
    static maintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext) {
        let originalIncludePropertyContext = extendeeEntityContext.PropertySymbolTable.Get(overriddenIncludePropertyContext.PropertyName());
        if (!(originalIncludePropertyContext instanceof MetaEdGrammar.IncludePropertyContext))
            return false;
        return CardinalitiesMatch(__as__(originalIncludePropertyContext, MetaEdGrammar.IncludePropertyContext), overriddenIncludePropertyContext);
    }
    static cardinalitiesMatch(includePropertyContext, otherIncludePropertyContext) {
        let propertyAnnotationContext = includePropertyContext.propertyComponents().propertyAnnotation();
        let otherPropertyAnnotationContext = otherIncludePropertyContext.propertyComponents().propertyAnnotation();
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