using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.SharedProperty
{
    public class SharedStringPropertyTypeMustMatchACommonSimpleString : ValidationRuleBase<MetaEdGrammar.SharedStringPropertyContext>
    {
        private readonly ISymbolTable _symbolTable;

        public SharedStringPropertyTypeMustMatchACommonSimpleString(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.SharedStringPropertyContext context)
        {
            var identifierToMatch = context.sharedPropertyType().GetText();
            var commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);


            return _symbolTable.IdentifierExists(commonStringType, identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.SharedStringPropertyContext context)
        {
            return string.Format("Shared property '{0}' does not match any declared common string.", context.propertyName().GetText());
        }
    }
}
