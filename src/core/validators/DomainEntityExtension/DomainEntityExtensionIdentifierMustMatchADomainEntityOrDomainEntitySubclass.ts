using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.DomainEntityExtension
{
    public class DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass : ValidationRuleBase<MetaEdGrammar.DomainEntityExtensionContext>
    {
        private readonly ISymbolTable _symbolTable;

        public DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.DomainEntityExtensionContext context)
        {
            var identifier = context.extendeeName().GetText();

            return _symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntityEntityType()).Any(x => x.Equals(identifier)) ||
                _symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntitySubclassEntityType()).Any(x => x.Equals(identifier));
        }

        public override string GetFailureMessage(MetaEdGrammar.DomainEntityExtensionContext context)
        {
            return string.Format("Domain Entity additions '{0}' does not match any declared Domain Entity or Domain Entity Subclass.", context.extendeeName().GetText());
        }
    }
}
