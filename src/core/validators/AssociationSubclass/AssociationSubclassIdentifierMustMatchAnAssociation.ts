using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.AssociationSubclass
{
    public class AssociationSubclassIdentifierMustMatchAnAssociation : ValidationRuleBase<MetaEdGrammar.AssociationSubclassContext>
    {
        private readonly ISymbolTable _symbolTable;

        public AssociationSubclassIdentifierMustMatchAnAssociation(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.AssociationSubclassContext context)
        {
            var associationEntityType = context.ASSOCIATION().GetText();
            var basedOnName = context.baseName().GetText();

            return _symbolTable.IdentifiersForEntityType(associationEntityType).Any(x => x.Equals(basedOnName));
        }

        public override string GetFailureMessage(MetaEdGrammar.AssociationSubclassContext context)
        {
            return string.Format("Association '{0}' based on '{1}' does not match any declared Association.", context.associationName().GetText(), context.baseName().GetText());
        }
    }
}
