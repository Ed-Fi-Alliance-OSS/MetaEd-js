using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.MergePartOfReference
{
    public class TargetPropertyPathMustExist : ValidationRuleBase<MetaEdGrammar.TargetPropertyPathContext>
    {
        private readonly ISymbolTable _symbolTable;
        private readonly IPropertyPathLookup _propertyPathLookup;

        public TargetPropertyPathMustExist(ISymbolTable symbolTable, IPropertyPathLookup propertyPathLookup)
        {
            _symbolTable = symbolTable;
            _propertyPathLookup = propertyPathLookup;
        }

        public override bool IsValid(MetaEdGrammar.TargetPropertyPathContext context)
        {
            var entityContext = LookupParentEntityContext(context);
            var propertyPathParts = context.propertyPath().PropertyPathParts();

            return _propertyPathLookup.Validate(entityContext, propertyPathParts, PropertyPathLookup.MatchAllIdentityProperties());
        }

        public override string GetFailureMessage(MetaEdGrammar.TargetPropertyPathContext context)
        {
            return string.Format("Path {0} is not valid or lists properties that are not part of the primary key.", context.GetText());
        }

        private EntityContext LookupParentEntityContext(MetaEdGrammar.TargetPropertyPathContext context)
        {
            // first parent - mergePartOfReference
            // second parent - referenceProperty
            // third parent - property collection
            // fourth parent - Association/Extension/Subclass or DomainEntity/Extension/Subclass
            var definingEntityContext = context.parent.parent.parent.parent;

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
    }
}