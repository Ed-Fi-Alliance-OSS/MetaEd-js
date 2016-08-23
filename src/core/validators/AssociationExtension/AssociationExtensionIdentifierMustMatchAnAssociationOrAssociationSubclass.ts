using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.AssociationExtension
{
    public class AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass : ValidationRuleBase<MetaEdGrammar.AssociationExtensionContext>
    {
        private readonly ISymbolTable _symbolTable;

        public AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.AssociationExtensionContext context)
        {
            var identifierToMatch = context.extendeeName().GetText();

            return _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) ||
                _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.AssociationExtensionContext context)
        {
            return string.Format("Association additions '{0}' does not match any declared Association or subclass.", context.extendeeName().GetText());
        }
    }
}
