using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.StringProperty
{
    public class StringPropertyMustNotMatchACommonSimpleType : ValidationRuleBase<MetaEdGrammar.StringPropertyContext>
    {
        private readonly ISymbolTable _symbolTable;

        public StringPropertyMustNotMatchACommonSimpleType(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.StringPropertyContext context)
        {
            var identifierToMatch = context.propertyName().GetText();
            var commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
            var commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
            var commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
            var commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);

            return !(_symbolTable.IdentifierExists(commonDecimalType, identifierToMatch) ||
                     _symbolTable.IdentifierExists(commonIntegerType, identifierToMatch) ||
                     _symbolTable.IdentifierExists(commonShortType, identifierToMatch) ||
                     _symbolTable.IdentifierExists(commonStringType, identifierToMatch));
        }

        public override string GetFailureMessage(MetaEdGrammar.StringPropertyContext context)
        {
            return string.Format("String property '{0}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.", context.propertyName().GetText());
        }
    }
}
