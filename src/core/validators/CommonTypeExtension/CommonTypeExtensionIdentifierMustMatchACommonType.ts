using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.CommonTypeExtension
{
    public class CommonTypeExtensionIdentifierMustMatchACommonType : ValidationRuleBase<MetaEdGrammar.CommonTypeExtensionContext>
    {
        private readonly ISymbolTable _symbolTable;

        public CommonTypeExtensionIdentifierMustMatchACommonType(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.CommonTypeExtensionContext context)
        {
            var entityType = context.COMMON_TYPE().GetText();
            var identifier = context.extendeeName().GetText();

            return _symbolTable.IdentifiersForEntityType(entityType).Any(x => x.Equals(identifier));
        }

        public override string GetFailureMessage(MetaEdGrammar.CommonTypeExtensionContext context)
        {
            return string.Format("Common Type additions '{0}' does not match any declared Common Type.", context.extendeeName().GetText());
        }
    }
}
