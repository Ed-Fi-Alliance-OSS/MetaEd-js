using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.InterchangeExtension
{
    public class InterchangeExtensionMustNotDuplicateInterchangeElementName : ValidationRuleBase<MetaEdGrammar.InterchangeExtensionContext>
    {
        private readonly ISymbolTable _symbolTable;

        public InterchangeExtensionMustNotDuplicateInterchangeElementName(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        private static string[] DuplicateInterchangeElements(MetaEdGrammar.InterchangeExtensionContext context)
        {
            var interchangeElements = context.interchangeExtensionComponent().interchangeElement().Select(x => x.ID().GetText());

            //group and filter duplicates
            return interchangeElements.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
        }

        public override bool IsValid(MetaEdGrammar.InterchangeExtensionContext context)
        {
            return !DuplicateInterchangeElements(context).Any();
        }

        public override string GetFailureMessage(MetaEdGrammar.InterchangeExtensionContext context)
        {
            var identifier = context.extendeeName().GetText();
            var duplicateInterchangeElements = DuplicateInterchangeElements(context);

            return string.Format("Interchange additions '{0}' declares duplicate interchange element{2} '{1}'.", identifier, string.Join("', '", duplicateInterchangeElements), duplicateInterchangeElements.Count() > 1 ? "s" : string.Empty);
        }
    }
}
