using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.IncludeProperty
{
    public class IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality : ValidationRuleBase<MetaEdGrammar.IncludePropertyContext>
    {
        private readonly ISymbolTable _symbolTable;

        public IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.IncludePropertyContext context)
        {
            if (context.includeExtensionOverride() == null) return true;

            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();

            switch (topLevelEntity.RuleIndex)
            {
                case MetaEdGrammar.RULE_domainEntityExtension:
                    return MaintainsCardinalityOnDomainEntity(context, topLevelEntity as MetaEdGrammar.DomainEntityExtensionContext);
                case MetaEdGrammar.RULE_associationExtension:
                    return MaintainsCardinalityOnAssociation(context, topLevelEntity as MetaEdGrammar.AssociationExtensionContext);
                default:
                    return false;
            }    
        }

        public override string GetFailureMessage(MetaEdGrammar.IncludePropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            var propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();

            return
                string.Format(
                    "'include extension' is invalid for property {0} on {1} '{2}'.  'include extension' is only valid for properties on Domain Entity extension and Association extension, and must maintain original cardinality on extendee.",
                    propertyWithComponents.IdNode().GetText(),
                    topLevelEntity.EntityIdentifier(),
                    topLevelEntity.EntityName());
        }

        private bool MaintainsCardinalityOnDomainEntity(MetaEdGrammar.IncludePropertyContext overriddenIncludePropertyContext, MetaEdGrammar.DomainEntityExtensionContext extensionEntityContext)
        {
            var extendeeEntityContext = _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), extensionEntityContext.EntityName());
            return MaintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext);
        }

        private bool MaintainsCardinalityOnAssociation(MetaEdGrammar.IncludePropertyContext overriddenIncludePropertyContext, MetaEdGrammar.AssociationExtensionContext extensionEntityContext)
        {
            var extendeeEntityContext = _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), extensionEntityContext.EntityName());
            return MaintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext);
        }

        private static bool MaintainsCardinality(MetaEdGrammar.IncludePropertyContext overriddenIncludePropertyContext, EntityContext extendeeEntityContext)
        {
            var originalIncludePropertyContext = extendeeEntityContext.PropertySymbolTable.Get(overriddenIncludePropertyContext.PropertyName());
            if (!(originalIncludePropertyContext is MetaEdGrammar.IncludePropertyContext)) return false;
            return CardinalitiesMatch(originalIncludePropertyContext as MetaEdGrammar.IncludePropertyContext, overriddenIncludePropertyContext);
        }

        public static bool CardinalitiesMatch(MetaEdGrammar.IncludePropertyContext includePropertyContext, MetaEdGrammar.IncludePropertyContext otherIncludePropertyContext)
        {
            var propertyAnnotationContext = includePropertyContext.propertyComponents().propertyAnnotation();
            var otherPropertyAnnotationContext = otherIncludePropertyContext.propertyComponents().propertyAnnotation();
            if (propertyAnnotationContext.required() != null && otherPropertyAnnotationContext.required() != null) return true;
            if (propertyAnnotationContext.optional() != null && otherPropertyAnnotationContext.optional() != null) return true;
            if (propertyAnnotationContext.collection() != null && propertyAnnotationContext.collection().requiredCollection() != null &&
                otherPropertyAnnotationContext.collection() != null && otherPropertyAnnotationContext.collection().requiredCollection() != null) return true;
            if (propertyAnnotationContext.collection() != null && propertyAnnotationContext.collection().optionalCollection() != null &&
                otherPropertyAnnotationContext.collection() != null && otherPropertyAnnotationContext.collection().optionalCollection() != null) return true;
            return false;
        }

    }
}
