using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.InterchangeExtension
{
    public class InterchangeExtensionIdentifierMustMatchAnInterchange : ValidationRuleBase<MetaEdGrammar.InterchangeExtensionContext>
    {
        private readonly ISymbolTable _symbolTable;

        public InterchangeExtensionIdentifierMustMatchAnInterchange(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.InterchangeExtensionContext context)
        {
            var entityType = context.INTERCHANGE().GetText();
            var identifier = context.extendeeName().GetText();

            return _symbolTable.IdentifiersForEntityType(entityType).Any(x => x.Equals(identifier));
        }

        public override string GetFailureMessage(MetaEdGrammar.InterchangeExtensionContext context)
        {
            return string.Format("Interchange additions '{0}' does not match any declared Interchange.", context.extendeeName().GetText());
        }
    }
}
