using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.SharedProperty
{
    public class SharedShortPropertyTypeMustMatchACommonSimpleShort : ValidationRuleBase<MetaEdGrammar.SharedShortPropertyContext>
    {
        private readonly ISymbolTable _symbolTable;

        public SharedShortPropertyTypeMustMatchACommonSimpleShort(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.SharedShortPropertyContext context)
        {
            var identifierToMatch = context.sharedPropertyType().GetText();
            var commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);

            return _symbolTable.IdentifierExists(commonShortType, identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.SharedShortPropertyContext context)
        {
            return string.Format("Shared property '{0}' does not match any declared common short.", context.propertyName().GetText());
        }
    }
}
