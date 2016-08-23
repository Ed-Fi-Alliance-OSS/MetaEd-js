using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.DomainEntitySubclass
{
    public class DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity : ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
    {
        private readonly ISymbolTable _symbolTable;

        public DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.DomainEntitySubclassContext context)
        {
            var basedOnName = context.baseName().GetText();

            return _symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntityEntityType()).Any(x => x.Equals(basedOnName)) ||
                   _symbolTable.IdentifiersForEntityType(SymbolTableEntityType.AbstractEntityEntityType()).Any(x => x.Equals(basedOnName));
        }

        public override string GetFailureMessage(MetaEdGrammar.DomainEntitySubclassContext context)
        {
            return string.Format("Domain Entity '{0}' based on '{1}' does not match any declared domain or abstract entity.", context.entityName().GetText(), context.baseName().GetText());
        }
    }
}
