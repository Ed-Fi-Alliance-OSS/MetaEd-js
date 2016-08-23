using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.MergePartOfReference
{
    public class MergePropertyPathMustExist : ValidationRuleBase<MetaEdGrammar.MergePropertyPathContext>
    {
        private readonly ISymbolTable _symbolTable;
        private readonly IPropertyPathLookup _propertyPathLookup;

        public MergePropertyPathMustExist(ISymbolTable symbolTable, IPropertyPathLookup propertyPathLookup)
        {
            _propertyPathLookup = propertyPathLookup;
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.MergePropertyPathContext context)
        {
            var entityContext = LookupParentEntityContext(context);
            var propertyPathParts = context.propertyPath().PropertyPathParts();

            return _propertyPathLookup.Validate(entityContext, propertyPathParts, PropertyPathLookup.MatchAllButFirstAsIdentityProperties());
        }

        public override string GetFailureMessage(MetaEdGrammar.MergePropertyPathContext context)
        {
            return string.Format("Path {0} is not valid.", context.GetText());
        }

        private EntityContext LookupParentEntityContext(MetaEdGrammar.MergePropertyPathContext context)
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
                return _symbolTable.Get(SymbolTableEntityType.DomainEntityExtensionEntityType(), domainEntityExtensionContext.extendeeName().IdText());
            }

            var domainEntitySubclassContext = definingEntityContext as MetaEdGrammar.DomainEntitySubclassContext;
            if (domainEntitySubclassContext != null)
            {
                return _symbolTable.Get(SymbolTableEntityType.DomainEntitySubclassEntityType(), domainEntitySubclassContext.entityName().IdText());
            }

            var associationContext = definingEntityContext as MetaEdGrammar.AssociationContext;
            if (associationContext != null)
            {
                return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), associationContext.associationName().IdText());
            }

            var associationExtensionContext = definingEntityContext as MetaEdGrammar.AssociationExtensionContext;
            if (associationExtensionContext != null)
            {
                return _symbolTable.Get(SymbolTableEntityType.AssociationExtensionEntityType(), associationExtensionContext.extendeeName().IdText());
            }

            var associationSubclassContext = definingEntityContext as MetaEdGrammar.AssociationSubclassContext;
            if (associationSubclassContext != null)
            {
                return _symbolTable.Get(SymbolTableEntityType.AssociationSubclassEntityType(), associationSubclassContext.associationName().IdText());
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