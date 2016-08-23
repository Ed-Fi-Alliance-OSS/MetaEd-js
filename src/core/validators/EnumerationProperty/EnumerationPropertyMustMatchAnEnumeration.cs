using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.EnumerationProperty
{
    public class EnumerationPropertyMustMatchAnEnumeration : ValidationRuleBase<MetaEdGrammar.EnumerationPropertyContext>
    {
        private readonly ISymbolTable _symbolTable;

        public EnumerationPropertyMustMatchAnEnumeration(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.EnumerationPropertyContext context)
        {
            var identifierToMatch = context.propertyName().GetText();
            return _symbolTable.IdentifierExists(SymbolTableEntityType.EnumerationEntityType(), identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.EnumerationPropertyContext context)
        {
            return string.Format("Enumeration property '{0}' does not match any declared enumeration.", context.propertyName().GetText());
        }
    }
}
