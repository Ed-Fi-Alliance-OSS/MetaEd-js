using System;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.MergePartOfReference
{
    public class MergePropertyAndTargetPropertyMustMatch : ValidationRuleBase<MetaEdGrammar.MergePartOfReferenceContext>
    {
        private readonly ISymbolTable _symbolTable;
        private readonly IPropertyPathLookup _propertyPathLookup;

        public MergePropertyAndTargetPropertyMustMatch(ISymbolTable symbolTable, IPropertyPathLookup propertyPathLookup)
        {
            _symbolTable = symbolTable;
            _propertyPathLookup = propertyPathLookup;
        }

        public override bool IsValid(MetaEdGrammar.MergePartOfReferenceContext context)
        {
            var entityContext = LookupParentEntityContext(context);
            var mergePropertyPathParts = context.mergePropertyPath().propertyPath().PropertyPathParts();
            var targetPropertyPathParts = context.targetPropertyPath().propertyPath().PropertyPathParts();

            var mergeProperty = _propertyPathLookup.FindReferencedProperty(entityContext, mergePropertyPathParts, PropertyPathLookup.MatchAllButFirstAsIdentityProperties());
            var targetProperty = _propertyPathLookup.FindReferencedProperty(entityContext, targetPropertyPathParts, PropertyPathLookup.MatchAllIdentityProperties());

            // let other rules check that the property actually has to exist
            if (mergeProperty == null || targetProperty == null)
                return true;

            var mergePropertyType = mergeProperty.GetType();
            var targetPropertyType = targetProperty.GetType();
            if (mergePropertyType != targetPropertyType)
            {
                if (!IsReferenceProperty(mergePropertyType) || !IsReferenceProperty(targetPropertyType))
                    return false;
            }

            if (mergeProperty.IdNode().GetText() != targetProperty.IdNode().GetText())
            {
                if (!IsReferenceProperty(mergePropertyType) || !IsReferenceProperty(targetPropertyType))
                    return false;

                if (!MatchBaseType(mergeProperty, targetProperty.IdNode().GetText()) && !MatchBaseType(targetProperty, mergeProperty.IdNode().GetText()))
                    return false;
            }

            return true;
        }

        public override string GetFailureMessage(MetaEdGrammar.MergePartOfReferenceContext context)
        {
            return string.Format("The merge paths '{0}' and '{1}' do not correspond to the same entity type.", context.mergePropertyPath().GetText(), context.targetPropertyPath().GetText());
        }

        private EntityContext LookupParentEntityContext(MetaEdGrammar.MergePartOfReferenceContext context)
        {
            // first parent - referenceProperty
            // second parent - property collection
            // third parent - Association/Extension/Subclass or DomainEntity/Extension/Subclass
            var definingEntityContext = context.parent.parent.parent;

            var domainEntityContext = definingEntityContext as MetaEdGrammar.DomainEntityContext;
            if (domainEntityContext != null)
            {
                return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityContext.entityName().IdText());
            }

            var domainEntityExtensionContext = definingEntityContext as MetaEdGrammar.DomainEntityExtensionContext;
            if (domainEntityExtensionContext != null)
            {
                // since the property has to be a PK, it must be defined on the base
                return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntityExtensionContext.extendeeName().IdText());
            }

            var domainEntitySubclassContext = definingEntityContext as MetaEdGrammar.DomainEntitySubclassContext;
            if (domainEntitySubclassContext != null)
            {
                // since the property has to be a PK, it must be defined on the base
                var domainEntity = _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), domainEntitySubclassContext.baseName().IdText());
                return domainEntity ?? _symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), domainEntitySubclassContext.baseName().IdText());
            }

            var associationContext = definingEntityContext as MetaEdGrammar.AssociationContext;
            if (associationContext != null)
            {
                return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationContext.associationName().IdText());
            }

            var associationExtensionContext = definingEntityContext as MetaEdGrammar.AssociationExtensionContext;
            if (associationExtensionContext != null)
            {
                return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationExtensionContext.extendeeName().IdText());
            }

            var associationSubclassContext = definingEntityContext as MetaEdGrammar.AssociationSubclassContext;
            if (associationSubclassContext != null)
            {
                // since the property has to be a PK, it must be defined on the base
                return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationSubclassContext.baseName().IdText());
            }

            var abstractContext = definingEntityContext as MetaEdGrammar.AbstractEntityContext;
            if (abstractContext != null)
            {
                return _symbolTable.Get(SymbolTableEntityType.AbstractEntityEntityType(), abstractContext.abstractEntityName().IdText());
            }

            return null;
        }

        private bool IsReferenceProperty(Type type)
        {
            return ((type == typeof(MetaEdGrammar.ReferencePropertyContext)) ||
                    (type == typeof(MetaEdGrammar.FirstDomainEntityContext)) ||
                    (type == typeof(MetaEdGrammar.SecondDomainEntityContext)));
        }

        private bool MatchBaseType(IContextWithIdentifier referencingProperty, string baseTypeName)
        {
            var entityName = referencingProperty.IdNode().GetText();

            EntityContext entityContext = null;
            entityContext = _symbolTable.Get(SymbolTableEntityType.DomainEntitySubclassEntityType(), entityName);
            if (entityContext != null)
            {
                var subclass = entityContext.Context as MetaEdGrammar.DomainEntitySubclassContext;
                return subclass.baseName().IdText() == baseTypeName;
            }

            entityContext = _symbolTable.Get(SymbolTableEntityType.AssociationSubclassEntityType(), entityName);
            if (entityContext != null)
            {
                var subclass = entityContext.Context as MetaEdGrammar.AssociationSubclassContext;
                return subclass.baseName().IdText() == baseTypeName;

            }
            return false;
        }
    }
}