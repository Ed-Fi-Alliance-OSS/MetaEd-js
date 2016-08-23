using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.SharedProperty
{
    public class SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal : ValidationRuleBase<MetaEdGrammar.SharedDecimalPropertyContext>
    {
        private readonly ISymbolTable _symbolTable;

        public SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.SharedDecimalPropertyContext context)
        {
            var identifierToMatch = context.sharedPropertyType().GetText();
            var commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);

            return _symbolTable.IdentifierExists(commonDecimalType, identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.SharedDecimalPropertyContext context)
        {
            return string.Format("Shared property '{0}' does not match any declared common decimal.", context.propertyName().GetText());
        }
    }
}
