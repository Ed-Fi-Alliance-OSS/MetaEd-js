using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.InterchangeExtension
{
    public class InterchangeExtensionMustNotDuplicateIdentityTemplateName : ValidationRuleBase<MetaEdGrammar.InterchangeExtensionContext>
    {
        private readonly ISymbolTable _symbolTable;

        public InterchangeExtensionMustNotDuplicateIdentityTemplateName(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        private static string[] DuplicateIdentityTemplates(MetaEdGrammar.InterchangeExtensionContext context)
        {
            var identityTemplates = context.interchangeExtensionComponent().interchangeIdentityTemplate().Select(x => x.ID().GetText());

            //group and filter duplicates
            return identityTemplates.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
        }

        public override bool IsValid(MetaEdGrammar.InterchangeExtensionContext context)
        {
            return !DuplicateIdentityTemplates(context).Any();
        }

        public override string GetFailureMessage(MetaEdGrammar.InterchangeExtensionContext context)
        {
            var identifier = context.extendeeName().GetText();
            var duplicateIdentityTemplates = DuplicateIdentityTemplates(context);

            return string.Format("Interchange additions '{0}' declares duplicate identity template{2} '{1}'.", identifier, string.Join("', '", duplicateIdentityTemplates), duplicateIdentityTemplates.Count() > 1 ? "s" : string.Empty);
        }
    }
}
