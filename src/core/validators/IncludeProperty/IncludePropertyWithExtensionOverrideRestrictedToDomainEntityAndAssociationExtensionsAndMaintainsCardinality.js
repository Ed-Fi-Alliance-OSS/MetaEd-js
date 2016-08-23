using;
MetaEd.Grammar.Antlr;
using;
MetaEd.Grammar.Antlr.Extensions;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var IncludeProperty;
            (function (IncludeProperty) {
                class IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality {
                }
                ValidationRuleBase < MetaEdGrammar.IncludePropertyContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, IncludePropertyContext = context) {
                            if (context.includeExtensionOverride() == null)
                                return true;
                            var topLevelEntity = context.GetAncestorContext();
                            switch (topLevelEntity.RuleIndex) {
                                case MetaEdGrammar.RULE_domainEntityExtension:
                                    return MaintainsCardinalityOnDomainEntity(context, topLevelEntity);
                                case MetaEdGrammar.RULE_associationExtension:
                                    return MaintainsCardinalityOnAssociation(context, topLevelEntity);
                                default:
                                    return false;
                            }
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, IncludePropertyContext = context) {
                            var topLevelEntity = context.GetAncestorContext();
                            var propertyWithComponents = context.GetAncestorContext();
                            return;
                            string.Format("'include extension' is invalid for property {0} on {1} '{2}'.  'include extension' is only valid for properties on Domain Entity extension and Association extension, and must maintain original cardinality on extendee.", propertyWithComponents.IdNode().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName());
                        },
                        bool: MaintainsCardinalityOnDomainEntity(MetaEdGrammar.IncludePropertyContext, overriddenIncludePropertyContext, MetaEdGrammar.DomainEntityExtensionContext, extensionEntityContext) };
                {
                    var extendeeEntityContext = _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), extensionEntityContext.EntityName());
                    return MaintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext);
                }
                bool;
                MaintainsCardinalityOnAssociation(MetaEdGrammar.IncludePropertyContext, overriddenIncludePropertyContext, MetaEdGrammar.AssociationExtensionContext, extensionEntityContext);
                {
                    var extendeeEntityContext = _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), extensionEntityContext.EntityName());
                    return MaintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext);
                }
                bool;
                MaintainsCardinality(MetaEdGrammar.IncludePropertyContext, overriddenIncludePropertyContext, EntityContext, extendeeEntityContext);
                {
                    var originalIncludePropertyContext = extendeeEntityContext.PropertySymbolTable.Get(overriddenIncludePropertyContext.PropertyName());
                    if (!(originalIncludePropertyContext))
                        is;
                    MetaEdGrammar.IncludePropertyContext;
                    return false;
                    return CardinalitiesMatch(originalIncludePropertyContext, overriddenIncludePropertyContext);
                }
                bool;
                CardinalitiesMatch(MetaEdGrammar.IncludePropertyContext, includePropertyContext, MetaEdGrammar.IncludePropertyContext, otherIncludePropertyContext);
                {
                    var propertyAnnotationContext = includePropertyContext.propertyComponents().propertyAnnotation();
                    var otherPropertyAnnotationContext = otherIncludePropertyContext.propertyComponents().propertyAnnotation();
                    if (propertyAnnotationContext.required() != null && otherPropertyAnnotationContext.required() != null)
                        return true;
                    if (propertyAnnotationContext.optional() != null && otherPropertyAnnotationContext.optional() != null)
                        return true;
                    if (propertyAnnotationContext.collection() != null && propertyAnnotationContext.collection().requiredCollection() != null &&
                        otherPropertyAnnotationContext.collection() != null && otherPropertyAnnotationContext.collection().requiredCollection() != null)
                        return true;
                    if (propertyAnnotationContext.collection() != null && propertyAnnotationContext.collection().optionalCollection() != null &&
                        otherPropertyAnnotationContext.collection() != null && otherPropertyAnnotationContext.collection().optionalCollection() != null)
                        return true;
                    return false;
                }
            })(IncludeProperty = Validator.IncludeProperty || (Validator.IncludeProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality.js.map