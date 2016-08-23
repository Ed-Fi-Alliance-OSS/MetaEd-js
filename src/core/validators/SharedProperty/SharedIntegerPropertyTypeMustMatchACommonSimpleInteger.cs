using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.SharedProperty
{
    public class SharedIntegerPropertyTypeMustMatchACommonSimpleInteger : ValidationRuleBase<MetaEdGrammar.SharedIntegerPropertyContext>
    {
        private readonly ISymbolTable _symbolTable;

        public SharedIntegerPropertyTypeMustMatchACommonSimpleInteger(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.SharedIntegerPropertyContext context)
        {
            var identifierToMatch = context.sharedPropertyType().GetText();
            var commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
            
            return _symbolTable.IdentifierExists(commonIntegerType, identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.SharedIntegerPropertyContext context)
        {
            return string.Format("Shared property '{0}' does not match any declared common integer.", context.propertyName().GetText());
        }
    }
}
