using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.IncludeProperty
{
    public class IncludePropertyMustMatchACommonType : ValidationRuleBase<MetaEdGrammar.IncludePropertyContext>
    {
        private readonly ISymbolTable _symbolTable;

        public IncludePropertyMustMatchACommonType(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.IncludePropertyContext context)
        {
            var identifierToMatch = context.propertyName().GetText();
            var commonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_TYPE);
            var inlineCommonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.INLINE_COMMON_TYPE);
            var choiceCommonType = MetaEdGrammar.TokenName(MetaEdGrammar.CHOICE_TYPE);

            return _symbolTable.IdentifierExists(commonTypeType, identifierToMatch) ||
                   _symbolTable.IdentifierExists(inlineCommonTypeType, identifierToMatch) ||
                   _symbolTable.IdentifierExists(choiceCommonType, identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.IncludePropertyContext context)
        {
            return string.Format("Include property '{0}' does not match any declared common type.", context.propertyName().GetText());
        }
    }
}
