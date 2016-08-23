using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.Interchange
{
    public class InterchangeMustNotDuplicateInterchangeElementName : ValidationRuleBase<MetaEdGrammar.InterchangeContext>
    {
        private readonly ISymbolTable _symbolTable;

        public InterchangeMustNotDuplicateInterchangeElementName(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        private static string[] DuplicateInterchangeElements(MetaEdGrammar.InterchangeContext context)
        {
            var interchangeElements = context.interchangeComponent().interchangeElement().Select(x => x.ID().GetText());

            //group and filter duplicates
            return interchangeElements.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
        }

        public override bool IsValid(MetaEdGrammar.InterchangeContext context)
        {
            return !DuplicateInterchangeElements(context).Any();
        }

        public override string GetFailureMessage(MetaEdGrammar.InterchangeContext context)
        {
            var identifier = context.interchangeName().GetText();
            var duplicateInterchangeElements = DuplicateInterchangeElements(context);

            return string.Format("Interchange '{0}' declares duplicate interchange element{2} '{1}'.", identifier, string.Join("', '", duplicateInterchangeElements), duplicateInterchangeElements.Count() > 1 ? "s" : string.Empty);
        }
    }
}
