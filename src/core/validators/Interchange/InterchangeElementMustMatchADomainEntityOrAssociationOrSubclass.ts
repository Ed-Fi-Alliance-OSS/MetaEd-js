using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.Interchange
{
    public class InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass : ValidationRuleBase<MetaEdGrammar.InterchangeElementContext>
    {
        private readonly ISymbolTable _symbolTable;

        public InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.InterchangeElementContext context)
        {
            var identifierToMatch = context.IdText();

            return _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) ||
                   _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) ||
                   _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) ||
                   _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.InterchangeElementContext context)
        {
            return string.Format("Interchange element '{0}' does not match any declared domain entity or subclass, association or subclass.", context.IdText());
        }
    }
}
